// Pricing & delivery rules by payment method.
// Keep in sync with client/src/pricing.js (the server is the one that actually charges).
const UPI_DISCOUNT_PERCENT = 10;

const DELIVERY_DAYS = {
  upi: { minDays: 3, maxDays: 5 },
  cod: { minDays: 7, maxDays: 10 },
};

// All amounts in paise. Discount is rounded to whole rupees and never takes the total below ₹1
// (Razorpay's minimum).
function priceOrder(subtotal, paymentMethod) {
  let discount = 0;
  if (paymentMethod === "upi") {
    discount = Math.round((subtotal * UPI_DISCOUNT_PERCENT) / 100 / 100) * 100;
    discount = Math.max(0, Math.min(discount, subtotal - 100));
  }
  return {
    subtotal,
    discount,
    total: subtotal - discount,
    delivery: DELIVERY_DAYS[paymentMethod] || DELIVERY_DAYS.cod,
  };
}

module.exports = { UPI_DISCOUNT_PERCENT, DELIVERY_DAYS, priceOrder };