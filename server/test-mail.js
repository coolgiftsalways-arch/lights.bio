// Run from the server folder: node test-mail.js you@gmail.com   (prints no passwords)
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const nodemailer = require("nodemailer");

const to = process.argv[2];
const port = Number(process.env.SMTP_PORT) || 465;
console.log("SMTP_HOST:", process.env.SMTP_HOST, "| PORT:", port, "| USER:", process.env.SMTP_USER,
  "| PASS length:", (process.env.SMTP_PASS || "").length);

nodemailer
  .createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  .sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject: "lights.bio test email", text: "If you see this, order emails will work." })
  .then((i) => console.log("✅ SENT:", i.response))
  .catch((e) => console.log("❌ FAILED:", e.message));