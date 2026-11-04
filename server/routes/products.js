const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products — all products for the shop page
router.get("/", async (req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: 1 });
  res.json(products);
});

// GET /api/products/:slug — one product page
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

module.exports = router;