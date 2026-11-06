const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { mapStatus } = require("../services/shiprocket");

const router = express.Router();

// Compare secrets without leaking timing information
const safeEqual = (a, b) =>
  crypto.timingSafeEqual(
    crypto.createHash("sha256").update(String(a)).digest(),
    crypto.createHash("sha256").update(String(b)).digest()
  );

// POST /api/delivery/updates — Shiprocket calls this whenever a shipment's status changes.
// Set it up in Shiprocket: Settings → API → Webhooks, URL https://lights.bio/api/delivery/updates,
// token = SHIPROCKET_WEBHOOK_TOKEN. (Shiprocket doesn't allow its own name in the URL, hence "delivery".)
router.post("/updates", async (req, res) => {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  if (!expected || !safeEqual(req.get("x-api-key") || "", expected)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Always answer 200 quickly so Shiprocket doesn't keep retrying; problems are logged instead.
  try {
    const p = req.body || {};
    const awb = p.awb ? String(p.awb) : "";
    const ourId = p.order_id ? String(p.order_id) : "";

    let order = awb ? await Order.findOne({ "shipping.awb": awb }) : null;
    if (!order && mongoose.isValidObjectId(ourId)) order = await Order.findById(ourId);
    if (!order) {
      console.warn("Delivery update for unknown shipment:", awb || ourId);
      return res.json({ ok: true });
    }

    order.shipping = order.shipping || {};
    if (awb) order.shipping.awb = awb;
    if (p.courier_name) order.shipping.courier = p.courier_name;
    if (p.current_status) order.shipping.status = p.current_status;
    if (p.etd) order.shipping.etd = p.etd;
    if (!order.shipping.trackUrl && order.shipping.awb) {
      order.shipping.trackUrl = `https://shiprocket.co/tracking/${order.shipping.awb}`;
    }
    if (Array.isArray(p.scans) && p.scans.length) {
      order.shipping.events = p.scans.slice(-15).reverse().map((s) => ({
        date: s.date, status: s.activity || s["sr-status-label"] || s.status, location: s.location,
      }));
    }

    const mapped = mapStatus(p.current_status);
    if (mapped && order.status !== "cancelled" && order.status !== "delivered") order.status = mapped;

    order.markModified("shipping");
    await order.save();
  } catch (err) {
    console.error("Delivery update failed:", err.message);
  }
  res.json({ ok: true });
});

module.exports = router;