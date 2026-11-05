const express = require("express");

const router = express.Router();
const cache = new Map(); // pincode -> { city, state } (lookups don't change, so keep them)

// GET /api/pincode/411001 -> { city: "Pune", state: "Maharashtra" }
// Uses India Post's free public API. If it's down, the customer just types city/state themselves.
router.get("/:pin", async (req, res) => {
  const pin = req.params.pin;
  if (!/^[1-9]\d{5}$/.test(pin)) return res.status(400).json({ message: "Invalid pincode" });
  if (cache.has(pin)) return res.json(cache.get(pin));

  try {
    const r = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: AbortSignal.timeout(5000) });
    const data = await r.json();
    const office = data?.[0]?.Status === "Success" ? data[0].PostOffice?.[0] : null;
    if (!office) return res.status(404).json({ message: "Pincode not found" });

    const result = { city: office.District, state: office.State };
    cache.set(pin, result);
    res.json(result);
  } catch {
    res.status(502).json({ message: "Pincode lookup unavailable" });
  }
});

module.exports = router;