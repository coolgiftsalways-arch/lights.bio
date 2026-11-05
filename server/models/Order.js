const mongoose = require("mongoose");

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String, // copied at purchase time, so old orders stay correct if you rename/reprice
        price: Number, // paise, per unit
        quantity: { type: Number, min: 1 },
      },
    ],
    customer: {
      name: {
        type: String,
        required: [true, "Please enter your full name."],
        trim: true,
        minlength: [2, "Please enter your full name."],
        maxlength: 80,
      },
      email: {
        type: String,
        required: [true, "Please enter your email."],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email."],
      },
      phone: {
        type: String,
        required: [true, "Please enter your phone number."],
        trim: true,
        set: (v) => String(v).replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""), // keep just 10 digits
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number."],
      },
    },
    shippingAddress: {
      line1: { type: String, required: [true, "Please enter your address."], trim: true, maxlength: 200 },
      line2: { type: String, trim: true, maxlength: 200 },
      landmark: { type: String, trim: true, maxlength: 100 },
      city: { type: String, required: [true, "Please enter your city."], trim: true, maxlength: 80 },
      state: {
        type: String,
        required: [true, "Please select your state."],
        enum: { values: INDIAN_STATES, message: "Please select a valid state." },
      },
      pincode: {
        type: String,
        required: [true, "Please enter your pincode."],
        trim: true,
        match: [/^[1-9]\d{5}$/, "Please enter a valid 6-digit pincode."],
      },
    },
        amount: { type: Number, required: true }, // total charged, in paise (after any discount)
    subtotal: Number, // before discount, in paise
    discount: { type: Number, default: 0 }, // UPI discount, in paise
    delivery: { minDays: Number, maxDays: Number }, // promised delivery window
    paymentMethod: { type: String, enum: ["upi", "cod"], required: true, default: "upi" },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      // pending = waiting for UPI payment, paid = UPI paid, confirmed = COD order placed
      enum: ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    razorpayPaymentLinkId: { type: String, index: true },
    razorpayQrId: String,
    paymentUrl: String, // Razorpay payment link (fixed amount)
    qrImage: String, // Razorpay UPI QR image (fixed amount)
    razorpayPaymentId: String,
    placedAt: { type: Date, index: true }, // when the order became real (UPI paid / COD placed)
    seenByAdmin: Boolean, // false = shows as a new-order notification in the admin panel
  },
  { timestamps: true }
);

orderSchema.statics.INDIAN_STATES = INDIAN_STATES;

module.exports = mongoose.model("Order", orderSchema);