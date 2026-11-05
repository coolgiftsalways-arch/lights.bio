import { useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./components/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderResult from "./pages/OrderResult";

import "./index.css";
import "lenis/dist/lenis.css";

export default function App() {
  const location = useLocation();
  const lenisRef = useRef(null);

  // Initialize Lenis only once
  useLayoutEffect(() => {
    // Prevent browser from restoring previous scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll whenever the page changes
  useLayoutEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) return;

    if (location.hash) {
      const sectionId = location.hash.substring(1);

      requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);

        if (section) {
          lenis.scrollTo(section, {
            offset: -80,
            duration: 1.2,
          });
        }
      });
    } else {
      // Immediately move to the top
      lenis.scrollTo(0, {
        immediate: true,
      });

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success" element={<OrderResult success />} />

          <Route path="/order-failed" element={<OrderResult />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
