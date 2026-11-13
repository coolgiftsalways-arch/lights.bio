require("dotenv").config({ path: require("path").join(__dirname, ".env") });

// Only needed on networks whose DNS can't resolve MongoDB Atlas "mongodb+srv" addresses
// (your home PC). Leave FORCE_PUBLIC_DNS unset on the live server.
if (process.env.FORCE_PUBLIC_DNS === "true") {
  require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
}

const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1); // Hostinger sits behind a proxy; needed for correct IPs + rate limiting

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google.com",
          "https://googleads.g.doubleclick.net",
        ],

        connectSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
          "https://www.googleadservices.com",
          "https://www.google.com",
          "https://googleads.g.doubleclick.net",
          "https://pagead2.googlesyndication.com",
        ],

        imgSrc: ["'self'", "data:", "blob:", "https:"],

        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://td.doubleclick.net",
        ],

        objectSrc: ["'none'"],

        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
  }),
);
app.use(cors({ origin: (process.env.CLIENT_URL || "http://localhost:5173").split(",") }));
app.use(express.json());

// Product images: /images/products/<slug>/1.jpg
app.use("/images", express.static(path.join(__dirname, "public", "images"), { maxAge: "7d" }));

// API
app.use("/api/newsletter", require("./routes/newsletter"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/delivery", require("./routes/delivery"));
app.use("/api", (req, res) => res.status(404).json({ message: "Not found" }));
app.use("/api/pincode", require("./routes/pincode"));

// The React website (built into client/dist), served from the same domain
const dist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: isProd ? "1h" : 0 }));
  // Any other URL (/, /products, /admin/orders, ...) -> index.html, React Router takes over
  app.get(/^(?!\/api|\/images).*/, (req, res) => res.sendFile(path.join(dist, "index.html")));
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });