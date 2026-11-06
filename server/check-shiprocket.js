// Run: node check-shiprocket.js   (from the server folder) — prints NO secrets
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const email = process.env.SHIPROCKET_EMAIL || "";
const pass = process.env.SHIPROCKET_PASSWORD || "";

const describe = (v) => ({
  length: v.length,
  startsOrEndsWithSpace: v !== v.trim(),
  hasQuotes: /^["']|["']$/.test(v),
  firstChar: v[0] || "(empty)",
  lastChar: v.slice(-1) || "(empty)",
});

console.log("Email read from .env:", JSON.stringify(email));
console.log("Password check:", describe(pass));

fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password: pass }),
})
  .then((r) => r.json().then((d) => ({ status: r.status, d })))
  .then(({ status, d }) => console.log(d.token ? "✅ LOGIN OK" : `❌ LOGIN FAILED (${status}): ${d.message}`))
  .catch((e) => console.log("Network error:", e.message));