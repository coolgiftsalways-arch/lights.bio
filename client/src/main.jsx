import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// ==========================================
// GOOGLE ADS INITIALIZATION
// ==========================================

window.dataLayer = window.dataLayer || [];

window.gtag = function () {
  window.dataLayer.push(arguments);
};

window.gtag("js", new Date());

window.gtag("config", "AW-18247244209");

// Load Google Ads script dynamically
const googleScript = document.createElement("script");

googleScript.async = true;

googleScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-18247244209";

document.head.appendChild(googleScript);

// ==========================================
// REACT APPLICATION
// ==========================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
