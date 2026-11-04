const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 }, // in paise: 49900 = ₹499
    images: [String],
    badge: { type: String, default: "" }, // e.g. "Website Exclusive"
    stock: { type: Number, default: 0, min: 0 }, // 0 = Sold Out
    active: { type: Boolean, default: true }, // false = hidden from the shop
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);