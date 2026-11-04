const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/checkout
// body: { items: [{ productId, quantity }], customer: {name,email,phone}, shippingAddress: {...} }
// returns: { paymentUrl } -> frontend redirects the customer there
router.post("/checkout", async (req, res) => {
  const { items, customer, shippingAddress } = req.body;

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

  const amount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = new Order({ items: orderItems, customer, shippingAddress, amount });
  try {
    await order.validate();
  } catch (err) {
    const first = Object.values(err.errors || {})[0];
    return res.status(400).json({ message: first ? first.message : "Please check your details." });
  }

  // Create a Razorpay Payment Link for this exact amount
  let link;
  try {
    link = await razorpay.paymentLink.create({
      amount,
      currency: "INR",
      reference_id: order._id.toString(), // ties the link back to our order
      description: orderItems.map((i) => `${i.name} x${i.quantity}`).join(", ").slice(0, 2000),
      customer: { name: order.customer.name, email: order.customer.email, contact: `+91${order.customer.phone}` },
      notify: { sms: false, email: false },
      reminder_enable: false,
      expire_by: Math.floor(Date.now() / 1000) + 60 * 60, // link valid for 1 hour
      callback_url: `${process.env.SERVER_URL}/api/orders/payment-callback`,
      callback_method: "get",
    });
  } catch (err) {
    console.error("Razorpay error:", err.error || err);
    return res.status(502).json({ message: "Couldn't start payment. Please try again." });
  }

  order.razorpayPaymentLinkId = link.id;
  await order.save();

  res.status(201).json({ orderId: order._id, paymentUrl: link.short_url });
});

// GET /api/orders/payment-callback
// Razorpay sends the customer here after paying. We verify, then send them to the site.
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

  // Mark paid only once (refreshing the page won't double-count)
  const order = await Order.findOneAndUpdate(
    { razorpayPaymentLinkId: razorpay_payment_link_id, status: "pending" },
    { status: "paid", razorpayPaymentId: razorpay_payment_id },
    { returnDocument: "after" }
  );

  if (order) {
    for (const item of order.items) {
      const updated = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (updated.modifiedCount === 0) {
        console.warn(`Stock ran out for ${item.name} on paid order ${order._id} — check this order manually.`);
      }
    }
  }

  res.redirect(`${process.env.CLIENT_URL}/order-success?order=${razorpay_payment_link_reference_id}`);
});

// GET /api/orders/:id — order confirmation page
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });
  const order = await Order.findById(req.params.id).select("items amount currency status createdAt");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;