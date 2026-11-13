require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

// ==========================================
// DNS CONFIGURATION
// ==========================================

if (process.env.FORCE_PUBLIC_DNS === "true") {
  require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
}

// ==========================================
// IMPORTS
// ==========================================

const path = require("path");
const fs = require("fs");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

// ==========================================
// APP CONFIGURATION
// ==========================================

const app = express();

const isProd = process.env.NODE_ENV === "production";

const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

// ==========================================
// HELMET SECURITY + GOOGLE ADS CSP
// ==========================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        // Scripts
        scriptSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google.com",
          "https://googleads.g.doubleclick.net",
        ],

        // Google Ads and Analytics connections
        connectSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
          "https://www.googleadservices.com",
          "https://www.google.com",
          "https://www.google.co.in",
          "https://googleads.g.doubleclick.net",
          "https://ad.doubleclick.net",
          "https://pagead2.googlesyndication.com",
        ],

        // Images
        imgSrc: ["'self'", "data:", "blob:", "https:"],

        // Frames
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://td.doubleclick.net",
        ],

        // Fonts
        fontSrc: ["'self'", "data:", "https:"],

        // Styles
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],

        // Objects
        objectSrc: ["'none'"],

        // Base URI
        baseUri: ["'self'"],

        // Form actions
        formAction: ["'self'"],

        // Upgrade HTTP requests in production
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
  }),
);

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim()),
  }),
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

// ==========================================
// STATIC PRODUCT IMAGES
// ==========================================

app.use(
  "/images",
  express.static(path.join(__dirname, "public", "images"), {
    maxAge: "7d",
  }),
);

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/newsletter", require("./routes/newsletter"));

app.use("/api/products", require("./routes/products"));

app.use("/api/orders", require("./routes/orders"));

app.use("/api/admin", require("./routes/admin"));

app.use("/api/delivery", require("./routes/delivery"));

app.use("/api/pincode", require("./routes/pincode"));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ==========================================
// API 404 HANDLER
// ==========================================

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

// ==========================================
// REACT FRONTEND
// ==========================================

const dist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(dist)) {
  app.use(
    express.static(dist, {
      index: false,
      maxAge: isProd ? "1h" : 0,
    }),
  );

  // React Router fallback

  app.get(/^\/(?!api|images).*/, (req, res) => {
    res.sendFile(path.join(dist, "index.html"));
  });
}

// ==========================================
// DATABASE CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);

    process.exit(1);
  });
