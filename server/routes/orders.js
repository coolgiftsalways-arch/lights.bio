const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { priceOrder } = require("../config/pricing");
const rateLimit = require("express-rate-limit");
const shiprocket = require("../services/shiprocket");
const { sendOrderConfirmation } = require("../services/mailer");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------- helpers ----------

// Take stock for every item; if any item runs out, put back what was taken and return that item.
async function reserveStock(items) {
  const done = [];
  for (const item of items) {
    const r = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (r.modifiedCount === 0) {
      for (const d of done) await Product.updateOne({ _id: d.product }, { $inc: { stock: d.quantity } });
      return item;
    }
    done.push(item);
  }
  return null;
}

// Mark a pending UPI order as paid exactly once, take stock, and close the other payment option.
async function markPaid(orderId, paymentId) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "pending" },
    { status: "paid", razorpayPaymentId: paymentId, placedAt: new Date(), seenByAdmin: false },
    { returnDocument: "after" }
  );
  if (!order) return; // already handled

  const outOfStock = await reserveStock(order.items);
  if (outOfStock) console.warn(`Stock ran out for ${outOfStock.name} on PAID order ${order._id} — handle manually.`);

  // Order confirmation email (runs in the background; never blocks or breaks the order)
  sendOrderConfirmation(order);

  // Stop the customer paying twice through the other option (best effort)
  if (order.razorpayQrId) razorpay.qrCode.close(order.razorpayQrId).catch(() => {});
  if (order.razorpayPaymentLinkId) razorpay.paymentLink.cancel(order.razorpayPaymentLinkId).catch(() => {});
}

// Ask Razorpay whether a pending UPI order has been paid (via QR or link).
async function syncPayment(order) {
  if (order.status !== "pending" || order.paymentMethod !== "upi") return;

  if (order.razorpayQrId) {
    const qr = await razorpay.qrCode.fetch(order.razorpayQrId);
    if (qr.payments_amount_received >= order.amount) {
      const payments = await razorpay.qrCode.fetchAllPayments(order.razorpayQrId);
      const paid = payments.items?.find((p) => p.status === "captured") || payments.items?.[0];
      return markPaid(order._id, paid?.id || "qr-payment");
    }
  }

  if (order.razorpayPaymentLinkId) {
    const link = await razorpay.paymentLink.fetch(order.razorpayPaymentLinkId);
    if (link.status === "paid") {
      return markPaid(order._id, link.payments?.[0]?.payment_id || "link-payment");
    }
  }
}

// ---------- routes ----------

// POST /api/orders/checkout
// body: { items: [{ productId, quantity }], customer: {...}, shippingAddress: {...}, paymentMethod: "upi" | "cod" }
router.post("/checkout", async (req, res) => {
  const { items, customer, shippingAddress } = req.body;
  const paymentMethod = req.body.paymentMethod === "cod" ? "cod" : "upi";

  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    return res.status(400).json({ message: "Your cart is empty." });
  }

  // Look up real prices from the DB — never trust prices sent by the browser.
  const orderItems = [];
  for (const { productId, quantity } of items) {
    const qty = Number(quantity);
    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({ message: "Invalid cart item." });
    }
    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) return res.status(400).json({ message: "A product in your cart is no longer available." });
    if (product.stock < qty) {
      return res.status(400).json({ message: `${product.name} is sold out or has only ${product.stock} left.` });
    }
    orderItems.push({ product: product._id, name: product.name, price: product.price, quantity: qty });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // UPI gets 10% off + faster delivery; COD pays full price + slower delivery (see config/pricing.js)
  const { discount, total: amount, delivery } = priceOrder(subtotal, paymentMethod);

  const order = new Order({ items: orderItems, customer, shippingAddress, amount, subtotal, discount, delivery, paymentMethod });
  try {
    await order.validate();
  } catch (err) {
    const first = Object.values(err.errors || {})[0];
    return res.status(400).json({ message: first ? first.message : "Please check your details." });
  }

  // ----- Cash on Delivery: confirm right away -----
  if (paymentMethod === "cod") {
    const outOfStock = await reserveStock(orderItems);
    if (outOfStock) return res.status(400).json({ message: `${outOfStock.name} just sold out.` });
    order.status = "confirmed";
    order.placedAt = new Date();
    order.seenByAdmin = false;
    await order.save();
    sendOrderConfirmation(order); // order confirmation email (background)
    return res.status(201).json({ orderId: order._id, paymentMethod, amount, subtotal, discount, delivery });
  }

  // ----- UPI: fixed-amount Razorpay payment link for this order -----
  const description = (
    "lights.bio — " +
    orderItems.map((i) => `${i.name} x${i.quantity}`).join(", ") + (discount ? " (10% UPI discount applied)" : "")
  ).slice(0, 250);

  try {
    const link = await razorpay.paymentLink.create({
      amount,
      currency: "INR",
      reference_id: order._id.toString(),
      description,
      customer: { name: order.customer.name, email: order.customer.email, contact: `+91${order.customer.phone}` },
      notify: { sms: false, email: false },
      reminder_enable: false,
      expire_by: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      callback_url: `${process.env.SERVER_URL}/api/orders/payment-callback`,
      callback_method: "get",
      notes: {
        brand: "lights.bio",
        orderId: order._id.toString(),
        orderNumber: order._id.toString().slice(-6).toUpperCase(),
      },
    });
    order.razorpayPaymentLinkId = link.id;
    order.paymentUrl = link.short_url;
  } catch (err) {
    console.error("Razorpay payment link error:", err.error || err);
    return res.status(502).json({ message: "Couldn't start payment. Please try again." });
  }

  await order.save();

  res.status(201).json({
    orderId: order._id,
    paymentMethod,
    amount,
    subtotal,
    discount,
    delivery,
    paymentUrl: order.paymentUrl,
    qrImage: order.qrImage || null,
  });
});

// GET /api/orders/payment-callback — Razorpay sends the customer here after paying via the link
router.get("/payment-callback", async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_reference_id,
    razorpay_payment_link_status,
    razorpay_signature,
  } = req.query;

  const fail = (orderId) =>
    res.redirect(`${process.env.CLIENT_URL}/order-failed${orderId ? `?order=${orderId}` : ""}`);

  const params = [razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature];
  if (!params.every((v) => typeof v === "string")) return fail();

  // Prove this redirect really came from Razorpay (not a faked URL)
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`)
    .digest("hex");
  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

  if (!valid || razorpay_payment_link_status !== "paid") return fail(razorpay_payment_link_reference_id);

  const order = await Order.findOne({ razorpayPaymentLinkId: razorpay_payment_link_id });
  if (order) await markPaid(order._id, razorpay_payment_id);

  res.redirect(`${process.env.CLIENT_URL}/order-success?order=${razorpay_payment_link_reference_id}`);
});

// ---------- Track your order (public) ----------
// Customers look up an order with its number (#E05E1D) + the mobile number used at checkout.

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30, // stops people guessing order numbers
  message: { message: "Too many tries. Please wait a few minutes and try again." },
});

const TRACK_REFRESH_MS = 15 * 60 * 1000; // ask Shiprocket for fresh tracking at most every 15 min per order

// POST /api/orders/track  { order: "E05E1D", phone: "9324556356" }
router.post("/track", trackLimiter, async (req, res) => {
  const code = String(req.body?.order || "").trim().replace(/^#/, "").toLowerCase();
  const phone = String(req.body?.phone || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (!/^[0-9a-f]{6,24}$/.test(code) || !/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ message: "Enter your order number (like E05E1D) and the mobile number you used at checkout." });
  }

  // Order number = last 6 characters of the order id (what we show customers as #E05E1D)
  const order = await Order.findOne({
    "customer.phone": phone,
    status: { $ne: "pending" },
    $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: `${code}$` } },
  })
    .sort({ createdAt: -1 })
    .populate("items.product", "images");

  if (!order) {
    return res.status(404).json({ message: "We couldn't find that order. Check the order number and mobile number." });
  }

  // Fresh tracking from Shiprocket (cached for 15 minutes)
  const sh = order.shipping;
  if (sh?.awb && sh.testMode !== "mock" && shiprocket.isConfigured() && (!sh.syncedAt || Date.now() - sh.syncedAt > TRACK_REFRESH_MS)) {
    try {
      const t = (await shiprocket.trackAwb(sh.awb))?.tracking_data || {};
      const current = t.shipment_track?.[0] || {};
      if (current.current_status) sh.status = current.current_status;
      if (t.etd || current.edd) sh.etd = t.etd || current.edd;
      if (t.track_url) sh.trackUrl = t.track_url;
      if (Array.isArray(t.shipment_track_activities)) {
        sh.events = t.shipment_track_activities.slice(0, 15).map((e) => ({
          date: e.date, status: e.activity || e["sr-status-label"] || e.status, location: e.location,
        }));
      }
      const mapped = shiprocket.mapStatus(sh.status);
      if (mapped && order.status !== "cancelled" && order.status !== "delivered") order.status = mapped;
    } catch (err) {
      console.warn("Tracking refresh failed:", err.message);
    }
    sh.syncedAt = new Date();
    order.markModified("shipping");
    await order.save();
  }

  // Only what the customer needs — no street address or email in the response
  res.json({
    _id: order._id,
    status: order.status,
    paymentMethod: order.paymentMethod,
    amount: order.amount,
    subtotal: order.subtotal,
    discount: order.discount,
    delivery: order.delivery,
    createdAt: order.createdAt,
    placedAt: order.placedAt,
    firstName: order.customer.name.split(" ")[0],
    shipTo: `${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}`,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price, image: i.product?.images?.[0] || "" })),
    shipping: sh?.awb
      ? { awb: sh.awb, courier: sh.courier, trackUrl: sh.trackUrl, status: sh.status, etd: sh.etd, events: sh.events || [] }
      : null,
  });
});


// GET /api/orders/:id/status — the checkout page polls this while showing the QR
router.get("/:id/status", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });
  let order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  try {
    await syncPayment(order);
    order = await Order.findById(order._id);
  } catch (err) {
    console.error("Payment status check failed:", err.error || err.message);
  }
  res.json({ status: order.status, paymentMethod: order.paymentMethod });
});

// GET /api/orders/:id — order confirmation page
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });
  const order = await Order.findById(req.params.id)
       .select("items amount subtotal discount delivery currency status paymentMethod createdAt placedAt shipping.awb shipping.courier shipping.trackUrl shipping.status shipping.etd")
    .populate("items.product", "images");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;