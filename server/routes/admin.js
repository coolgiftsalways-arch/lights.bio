const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const requireAdmin = require("../middleware/requireAdmin");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Subscriber = require("../models/Subscriber");
const shiprocket = require("../services/shiprocket");

const router = express.Router();

// ---------- login ----------

// Max 10 failed login attempts per IP every 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
});

// Compare without leaking timing information
const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

// POST /api/admin/login  { email, password }
router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(500).json({ message: "Admin login is not configured on the server (.env)." });
  }
  const ok =
    safeEqual(String(email || "").trim().toLowerCase(), ADMIN_EMAIL.trim().toLowerCase()) &&
    safeEqual(password || "", ADMIN_PASSWORD);
  if (!ok) return res.status(401).json({ message: "Wrong email or password." });

  const token = jwt.sign({ role: "admin", email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, email: ADMIN_EMAIL });
});

// Everything below needs a valid admin token
router.use(requireAdmin);

// ---------- dashboard ----------

// Money we've actually received: UPI paid (not cancelled) + COD once delivered
const COLLECTED = {
  $or: [
    { paymentMethod: "upi", status: { $in: ["paid", "shipped", "delivered"] } },
    { paymentMethod: "cod", status: "delivered" },
  ],
};

router.get("/stats", async (req, res) => {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 13); // last 14 days including today

  const [revenueAgg, statusAgg, pendingCodAgg, daily, recent, lowStock, productCount, subscriberCount] = await Promise.all([
    Order.aggregate([{ $match: COLLECTED }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { paymentMethod: "cod", status: { $in: ["confirmed", "shipped"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Order.aggregate([
      { $match: { ...COLLECTED, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
    ]),
    Order.find({ status: { $ne: "pending" } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("customer.name amount status paymentMethod createdAt"),
    Product.find({ active: true, stock: { $lte: 5 } }).sort({ stock: 1 }).limit(6).select("name stock images"),
    Product.countDocuments({ active: true }),
    Subscriber.countDocuments(),
  ]);

  // Fill in days with no sales so the chart always shows 14 bars
  const byDay = Object.fromEntries(daily.map((d) => [d._id, d]));
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
    days.push({ date: key, revenue: byDay[key]?.revenue || 0, orders: byDay[key]?.orders || 0 });
  }

  const statusCounts = Object.fromEntries(statusAgg.map((s) => [s._id, s.count]));

  res.json({
    revenue: revenueAgg[0]?.total || 0,
    paidOrders: revenueAgg[0]?.count || 0,
    pendingCod: pendingCodAgg[0]?.total || 0,
    toShip: (statusCounts.paid || 0) + (statusCounts.confirmed || 0),
    statusCounts,
    days,
    recent,
    lowStock,
    productCount,
    subscriberCount,
  });
});

// ---------- orders ----------

const STATUSES = ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled"];
// statuses where stock has already been taken for the order
const STOCK_TAKEN = ["paid", "confirmed", "shipped", "delivered"];

// GET /api/admin/orders?status=paid&q=asha&page=1
router.get("/orders", async (req, res) => {
  const filter = {};
  if (STATUSES.includes(req.query.status)) filter.status = req.query.status;

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const or = [{ "customer.name": rx }, { "customer.email": rx }, { "customer.phone": rx }];
    if (mongoose.isValidObjectId(q)) or.push({ _id: q });
    filter.$or = or;
  }

  const limit = 20;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

router.get("/orders/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });
  const order = await Order.findById(req.params.id).populate("items.product", "images slug");
  if (!order) return res.status(404).json({ message: "Order not found" });
  // Opening an order marks its notification as read
  if (order.seenByAdmin === false) await Order.updateOne({ _id: order._id }, { seenByAdmin: true });
  res.json(order);
});

// ---------- notifications ----------

// GET /api/admin/notifications -> { unread, items: latest real orders (newest first) }
router.get("/notifications", async (req, res) => {
  // One-time backfill for orders placed before notifications existed:
  // they get placedAt = createdAt. Ones still waiting to ship (paid / COD confirmed)
  // start as unread so you see them; shipped/delivered/cancelled ones show as read history.
  const legacy = { placedAt: { $exists: false }, status: { $in: ["paid", "confirmed", "shipped", "delivered", "cancelled"] } };
  if (await Order.exists(legacy)) {
    const toShip = await Order.find({ ...legacy, status: { $in: ["paid", "confirmed"] } }).distinct("_id");
    await Order.updateMany(legacy, [{ $set: { placedAt: "$createdAt" } }], { updatePipeline: true });
    if (toShip.length) await Order.updateMany({ _id: { $in: toShip } }, { seenByAdmin: false });
  }

  const real = { placedAt: { $exists: true } };
  const [items, unread] = await Promise.all([
    Order.find(real)
      .sort({ placedAt: -1 })
      .limit(20)
      .select("customer.name shippingAddress.city amount paymentMethod status placedAt seenByAdmin items.quantity"),
    Order.countDocuments({ seenByAdmin: false }),
  ]);
  res.json({ unread, items });
});

// ---------- shipping (Shiprocket) ----------

// POST /api/admin/orders/:id/ship
// Creates the order in Shiprocket, assigns a courier + AWB, books pickup and makes the label.
// Safe to click again: it continues from whichever step failed last time.
router.post("/orders/:id/ship", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!["paid", "confirmed", "shipped"].includes(order.status)) {
    return res.status(400).json({ message: "Only paid or COD-confirmed orders can be shipped." });
  }
  if (!shiprocket.isConfigured()) {
    return res.status(400).json({ message: "Shiprocket isn't set up yet — add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD to the server's environment." });
  }

  order.shipping = order.shipping || {};
  const ship = order.shipping;

  try {
    // 1. Create the order in Shiprocket (once)
    if (!ship.shipmentId) {
      const created = await shiprocket.createOrder(order);
      if (!created.shipment_id) throw new Error(`Shiprocket: ${created.message || "order not created"}`);
      ship.srOrderId = String(created.order_id);
      ship.shipmentId = String(created.shipment_id);
      ship.status = created.status || "NEW";
      await order.save();
    }

    // 2. Assign courier + AWB (tracking number)
    if (!ship.awb) {
      const awb = await shiprocket.assignAwb(ship.shipmentId);
      const data = awb?.response?.data || {};
      if (!data.awb_code) {
        throw new Error(`Shiprocket couldn't assign a courier: ${data.awb_assign_error || awb.message || "no courier available"}`);
      }
      ship.awb = data.awb_code;
      ship.courier = data.courier_name || "";
      ship.trackUrl = shiprocket.trackingUrl(ship.awb);
      ship.status = "AWB ASSIGNED";
      await order.save();
    }

    // 3. Book the pickup
    if (!ship.pickupDate) {
      const pickup = await shiprocket.generatePickup(ship.shipmentId).catch((e) => ({ error: e.message }));
      ship.pickupDate = pickup?.response?.pickup_scheduled_date || (pickup?.error ? "" : "requested");
      if (pickup?.error) ship.lastError = pickup.error;
      if (ship.pickupDate) ship.status = "PICKUP SCHEDULED";
    }

    // 4. Shipping label (PDF to print and stick on the box)
    if (!ship.labelUrl) {
      const label = await shiprocket.generateLabel(ship.shipmentId).catch(() => null);
      if (label?.label_url) ship.labelUrl = label.label_url;
    }

    ship.shippedAt = ship.shippedAt || new Date();
    if (ship.pickupDate) ship.lastError = ""; // everything went through
    order.markModified("shipping");
    await order.save();
    res.json(order);
  } catch (err) {
    ship.lastError = err.message;
    order.markModified("shipping");
    await order.save().catch(() => {});
    res.status(502).json({ message: err.message });
  }
});

// POST /api/admin/orders/:id/tracking — fetch the latest tracking from Shiprocket
router.post("/orders/:id/tracking", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });
  const order = await Order.findById(req.params.id);
  if (!order?.shipping?.awb) return res.status(400).json({ message: "This order has no tracking number yet." });

  try {
    const data = await shiprocket.trackAwb(order.shipping.awb);
    const t = data?.tracking_data || {};
    const current = t.shipment_track?.[0] || {};
    if (current.current_status) order.shipping.status = current.current_status;
    if (t.etd || current.edd) order.shipping.etd = t.etd || current.edd;
    if (t.track_url) order.shipping.trackUrl = t.track_url;
    if (Array.isArray(t.shipment_track_activities)) {
      order.shipping.events = t.shipment_track_activities.slice(0, 15).map((e) => ({
        date: e.date, status: e.activity || e["sr-status-label"] || e.status, location: e.location,
      }));
    }
    const mapped = shiprocket.mapStatus(order.shipping.status);
    if (mapped && order.status !== "cancelled" && order.status !== "delivered") order.status = mapped;
    order.markModified("shipping");
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(502).json({ message: err.message });
  }
});

// POST /api/admin/notifications/read-all
router.post("/notifications/read-all", async (req, res) => {
  await Order.updateMany({ seenByAdmin: false }, { seenByAdmin: true });
  res.json({ unread: 0 });
});

// PATCH /api/admin/orders/:id  { status }
router.patch("/orders/:id", async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid status" });
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const old = order.status;
  if (old === status) return res.json(order);

  // Cancelling an order that had taken stock -> put the stock back
  if (status === "cancelled" && STOCK_TAKEN.includes(old)) {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
  }
  // Un-cancelling -> take the stock again
  if (old === "cancelled" && STOCK_TAKEN.includes(status)) {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
  }

  // Cancelled here -> cancel the Shiprocket shipment too (best effort; can't cancel once picked up)
  if (status === "cancelled" && order.shipping?.srOrderId && shiprocket.isConfigured()) {
    try {
      await shiprocket.cancelOrders([order.shipping.srOrderId]);
      order.shipping.status = "CANCELED";
    } catch (err) {
      order.shipping.lastError = `Couldn't cancel in Shiprocket: ${err.message}`;
    }
    order.markModified("shipping");
  }

  order.status = status;
  await order.save();
  res.json(order);
});

// ---------- products ----------

const PRODUCT_FIELDS = ["name", "description", "price", "stock", "badge", "active", "images"];
const pick = (body) => Object.fromEntries(PRODUCT_FIELDS.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "product";

async function uniqueSlug(name, excludeId) {
  const base = slugify(name);
  let slug = base;
  for (let i = 2; await Product.exists({ slug, _id: { $ne: excludeId } }); i++) slug = `${base}-${i}`;
  return slug;
}

router.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  res.json(products);
});

router.post("/products", async (req, res) => {
  const data = pick(req.body || {});
  if (!data.name) return res.status(400).json({ message: "Name is required" });
  data.slug = await uniqueSlug(data.name);
  try {
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/products/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Product not found" });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  product.set(pick(req.body || {}));
  try {
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- image upload ----------

const UPLOAD_DIR = path.join(__dirname, "..", "public", "images", "products", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => cb(null, Boolean(TYPES[file.mimetype])),
});

// POST /api/admin/upload  (multipart, field "image") -> { url }
router.post("/upload", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Image must be under 5 MB." : err.message });
    if (!req.file) return res.status(400).json({ message: "Please choose a JPG, PNG or WebP image." });
    res.status(201).json({ url: `/images/products/uploads/${req.file.filename}` });
  });
});

// ---------- subscribers ----------

router.get("/subscribers", async (req, res) => {
  const items = await Subscriber.find().sort({ createdAt: -1 });
  res.json(items);
});

router.delete("/subscribers/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Not found" });
  await Subscriber.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;