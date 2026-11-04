const express = require("express");
const rateLimit = require("express-rate-limit");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

// Max 10 sign-up attempts per IP every 15 minutes (stops spam bots)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });

router.post("/", limiter, async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email." });
  }

  try {
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.json({ message: "You're already subscribed!" });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: "You're subscribed! Welcome, Glow-Getter." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
});

module.exports = router;