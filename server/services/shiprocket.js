// Shiprocket API helper.
// Docs: https://apidocs.shiprocket.in  — uses an "API user" (Shiprocket panel → Settings → API → Create API user).
const BASE = "https://apiv2.shiprocket.in/v1/external";

let token = null;
let tokenAt = 0;
const TOKEN_MAX_AGE = 20 * 60 * 60 * 1000; // re-login after 20h (Shiprocket tokens last at least a day)

const isConfigured = () => Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);

async function login() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) throw new Error(`Shiprocket login failed: ${data.message || res.status}`);
  token = data.token;
  tokenAt = Date.now();
  return token;
}

// Calls the API; logs in first if needed, and once more if the token was rejected.
async function api(path, { method = "GET", body } = {}, retried = false) {
  if (!isConfigured()) throw new Error("Shiprocket is not set up (add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD to .env).");
  if (!token || Date.now() - tokenAt > TOKEN_MAX_AGE) await login();

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !retried) {
    token = null;
    return api(path, { method, body }, true);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Shiprocket returns { message, errors: { field: [..] } } on validation errors
    const details = data.errors ? Object.values(data.errors).flat().join(" ") : "";
    throw new Error(`Shiprocket: ${data.message || res.statusText}${details ? ` — ${details}` : ""}`);
  }
  return data;
}

const rupees = (paise) => Math.round(paise) / 100;

// "2026-11-05 14:30" in India time
function srDate(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour === "24" ? "00" : p.hour}:${p.minute}`;
}

// Turn one of our orders into Shiprocket's "create order" request
function buildOrderPayload(order) {
  const [first, ...rest] = order.customer.name.trim().split(/\s+/);
  const a = order.shippingAddress;
  const units = order.items.reduce((n, i) => n + i.quantity, 0);
  const itemWeight = Number(process.env.SHIPROCKET_ITEM_WEIGHT_KG) || 0.5;

  return {
    order_id: order._id.toString(), // our order id — comes back in webhooks
    order_date: srDate(order.placedAt || order.createdAt),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary", // nickname of your pickup address in Shiprocket
    billing_customer_name: first,
    billing_last_name: rest.join(" "),
    billing_address: a.line1,
    billing_address_2: [a.line2, a.landmark && `Landmark: ${a.landmark}`].filter(Boolean).join(", "),
    billing_city: a.city,
    billing_pincode: a.pincode,
    billing_state: a.state,
    billing_country: "India",
    billing_email: order.customer.email,
    billing_phone: order.customer.phone,
    shipping_is_billing: true,
    order_items: order.items.map((i) => ({
      name: i.name,
      sku: String(i.product),
      units: i.quantity,
      selling_price: rupees(i.price),
    })),
    payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
    shipping_charges: 0,
    total_discount: rupees(order.discount || 0),
    sub_total: rupees(order.amount), // what the customer pays (COD amount to collect)
    length: Number(process.env.SHIPROCKET_BOX_LENGTH_CM) || 15,
    breadth: Number(process.env.SHIPROCKET_BOX_BREADTH_CM) || 15,
    height: Number(process.env.SHIPROCKET_BOX_HEIGHT_CM) || 15,
    weight: Math.max(0.1, +(units * itemWeight).toFixed(2)), // kg
  };
}

const createOrder = (order) => api("/orders/create/adhoc", { method: "POST", body: buildOrderPayload(order) });
const assignAwb = (shipmentId) => api("/courier/assign/awb", { method: "POST", body: { shipment_id: shipmentId } });
const generatePickup = (shipmentId) => api("/courier/generate/pickup", { method: "POST", body: { shipment_id: [shipmentId] } });
const generateLabel = (shipmentId) => api("/courier/generate/label", { method: "POST", body: { shipment_id: [shipmentId] } });
const trackAwb = (awb) => api(`/courier/track/awb/${encodeURIComponent(awb)}`);
const cancelOrders = (srOrderIds) => api("/orders/cancel", { method: "POST", body: { ids: srOrderIds } });

const trackingUrl = (awb) => `https://shiprocket.co/tracking/${encodeURIComponent(awb)}`;

// Shiprocket status text -> our order status (or null to leave it alone)
function mapStatus(srStatus = "") {
  const s = String(srStatus).toUpperCase();
  if (s.includes("RTO") || s.includes("UNDELIVERED") || s.includes("CANCEL") || s.includes("LOST")) return null;
  if (s.includes("DELIVERED")) return "delivered";
  if (["PICKED UP", "IN TRANSIT", "OUT FOR DELIVERY", "SHIPPED", "REACHED", "OUT FOR PICKUP"].some((k) => s.includes(k))) {
    return s.includes("OUT FOR PICKUP") ? null : "shipped";
  }
  return null;
}

module.exports = {
  isConfigured,
  buildOrderPayload,
  createOrder,
  assignAwb,
  generatePickup,
  generateLabel,
  trackAwb,
  cancelOrders,
  trackingUrl,
  mapStatus,
};