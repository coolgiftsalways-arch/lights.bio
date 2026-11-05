// Pricing & delivery rules by payment method (for display).
// The server (server/config/pricing.js) uses the same rules and is what actually charges.
export const UPI_DISCOUNT_PERCENT = 10;

export const DELIVERY_DAYS = {
  upi: { minDays: 3, maxDays: 5 },
  cod: { minDays: 7, maxDays: 10 },
};

// amounts in paise
export function priceOrder(subtotal, paymentMethod) {
  let discount = 0;
  if (paymentMethod === "upi") {
    discount = Math.round((subtotal * UPI_DISCOUNT_PERCENT) / 100 / 100) * 100;
    discount = Math.max(0, Math.min(discount, subtotal - 100));
  }
  return { subtotal, discount, total: subtotal - discount, delivery: DELIVERY_DAYS[paymentMethod] };
}

// "3–5 days"
export const deliveryDays = (method) => `${DELIVERY_DAYS[method].minDays}–${DELIVERY_DAYS[method].maxDays} days`;

// "8 Nov – 10 Nov" counted from a start date (default: today)
export function deliveryWindow({ minDays, maxDays }, from = new Date()) {
  const fmt = (n) => {
    const d = new Date(from);
    d.setDate(d.getDate() + n);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };
  return `${fmt(minDays)} – ${fmt(maxDays)}`;
}