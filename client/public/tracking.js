// ==========================================
// LIGHTS.BIO TRACKING CONFIGURATION
// ==========================================

const META_PIXEL_ID = "1761236734955235";
const GOOGLE_MEASUREMENT_ID = "G-44VJ0V3EMD";
const GOOGLE_ADS_ID = "AW-18247244209";

// ==========================================
// GOOGLE ANALYTICS + GOOGLE ADS
// ==========================================

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

window.gtag = gtag;

gtag("js", new Date());
gtag("config", GOOGLE_MEASUREMENT_ID);
gtag("config", GOOGLE_ADS_ID);

// Load Google tracking script
(function () {
  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" + GOOGLE_MEASUREMENT_ID;

  document.head.appendChild(script);
})();

// ==========================================
// META PIXEL
// ==========================================

(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;

  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };

  if (!f._fbq) f._fbq = n;

  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  t = b.createElement(e);
  t.async = true;
  t.src = v;

  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js",
);

// Initialize Pixel
fbq("init", META_PIXEL_ID);

// Track page views
fbq("track", "PageView");
