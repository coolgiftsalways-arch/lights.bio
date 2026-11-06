// Order emails (order confirmation) — uses SMTP settings from server/.env
//
//   SMTP_HOST=smtp.hostinger.com
//   SMTP_PORT=465
//   SMTP_USER=hello@lights.bio
//   SMTP_PASS=your-mailbox-password
//   MAIL_FROM="lights.bio <hello@lights.bio>"
//   CLIENT_URL=https://lights.bio
//
// If SMTP isn't configured, emails are skipped (orders still work).
const nodemailer = require("nodemailer");

let transporter = null;

const isConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

// amounts are stored in paise
const rupees = (paise) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format((Number(paise) || 0) / 100);

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function orderEmail(order) {
  const id = order._id.toString().slice(-6).toUpperCase();
  const site = (process.env.CLIENT_URL || "https://lights.bio").replace(/\/+$/, "");
  const trackUrl = `${site}/track`;
  const cod = order.paymentMethod === "cod";
  const a = order.shippingAddress || {};
  const address = [a.line1, a.line2, a.landmark && `Landmark: ${a.landmark}`, `${a.city}, ${a.state} – ${a.pincode}`]
    .filter(Boolean)
    .join("<br>");
  const delivery = order.delivery?.minDays ? `${order.delivery.minDays}–${order.delivery.maxDays} days` : "";
  const paymentLine = cod ? `Cash on Delivery — please keep ${rupees(order.amount)} ready` : "Paid online (UPI)";

  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #eef0ec;">${esc(i.name)} <span style="color:#7a857e;">× ${i.quantity}</span></td>
        <td style="padding:10px 0;border-bottom:1px solid #eef0ec;text-align:right;white-space:nowrap;">${rupees(i.price * i.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#f4f6f2;font-family:Arial,Helvetica,sans-serif;color:#14211b;">
  <div style="max-width:560px;margin:0 auto;padding:24px 14px;">
    <div style="background:#0d1310;border-radius:16px 16px 0 0;padding:22px 24px;">
      <div style="font-family:Georgia,serif;font-style:italic;font-size:24px;color:#d6ff75;">lights.bio</div>
    </div>
    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:26px 24px;">
      <h1 style="margin:0 0 6px;font-size:22px;">Thank you for your order! 🌱</h1>
      <p style="margin:0 0 18px;color:#5d6b63;font-size:14px;line-height:1.6;">
        Hi ${esc(order.customer?.name)}, we've received your order <b>#${id}</b> and are getting it ready.
        You'll get tracking details once it ships.
      </p>

      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px;">
        ${rows}
        ${order.discount > 0 ? `<tr><td style="padding:8px 0;color:#3f7d20;">UPI discount</td><td style="padding:8px 0;text-align:right;color:#3f7d20;">−${rupees(order.discount)}</td></tr>` : ""}
        <tr><td style="padding:12px 0;font-weight:bold;font-size:16px;">Total</td><td style="padding:12px 0;text-align:right;font-weight:bold;font-size:16px;">${rupees(order.amount)}</td></tr>
      </table>

      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:13px;margin-top:8px;background:#f7f9f5;border-radius:12px;">
        <tr><td style="padding:14px 16px;vertical-align:top;width:50%;">
          <div style="color:#7a857e;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Ship to</div>
          <b>${esc(order.customer?.name)}</b><br>${address
            .split("<br>")
            .map(esc)
            .join("<br>")}<br>+91 ${esc(order.customer?.phone)}
        </td><td style="padding:14px 16px;vertical-align:top;">
          <div style="color:#7a857e;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Payment</div>
          ${esc(paymentLine)}
          ${delivery ? `<div style="color:#7a857e;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 4px;">Estimated delivery</div>${esc(delivery)}` : ""}
        </td></tr>
      </table>

      <div style="text-align:center;margin:24px 0 8px;">
        <a href="${trackUrl}" style="display:inline-block;background:#3f7d20;color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 26px;border-radius:999px;font-size:14px;">Track your order</a>
      </div>
      <p style="margin:16px 0 0;color:#7a857e;font-size:12px;line-height:1.6;text-align:center;">
        Questions? Reply to this email or WhatsApp us at +91 93245 56356.<br>
        Live plants may look a little tired after travel — check our care guide when it arrives.
      </p>
    </div>
  </div></body></html>`;

  const text = [
    `Thank you for your order #${id}!`,
    "",
    ...order.items.map((i) => `${i.name} x${i.quantity} — ${rupees(i.price * i.quantity)}`),
    order.discount > 0 ? `UPI discount: −${rupees(order.discount)}` : "",
    `Total: ${rupees(order.amount)}`,
    `Payment: ${paymentLine}`,
    delivery ? `Estimated delivery: ${delivery}` : "",
    "",
    `Track your order: ${trackUrl}`,
    "Questions? Reply to this email or WhatsApp +91 93245 56356.",
  ]
    .filter((l) => l !== "")
    .join("\n");

  return { subject: `Order confirmed #${id} — lights.bio`, html, text };
}

// Send the order confirmation. Never throws — a failed email must not break the order.
async function sendOrderConfirmation(order) {
  if (!isConfigured()) {
    console.warn("Order email skipped: SMTP_HOST / SMTP_USER / SMTP_PASS not set.");
    return false;
  }
  if (!order?.customer?.email) return false;
  try {
    const { subject, html, text } = orderEmail(order);
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || `lights.bio <${process.env.SMTP_USER}>`,
      to: order.customer.email,
      replyTo: process.env.MAIL_REPLY_TO || process.env.SMTP_USER,
      subject,
      html,
      text,
    });
    console.log(`Order confirmation email sent to ${order.customer.email} for ${order._id}`);
    return true;
  } catch (err) {
    console.error(`Order email failed for ${order._id}:`, err.message);
    return false;
  }
}

module.exports = { sendOrderConfirmation, orderEmail, isConfigured };
