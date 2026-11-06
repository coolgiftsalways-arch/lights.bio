import { useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import FAQs from "./pages/FAQs";
import CustomerReviews from "./pages/CustomerReviews";
import Unboxing from "./pages/Unboxing";
import CareInstructions from "./pages/CareInstructions";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderResult from "./pages/OrderResult";
import TrackOrder from "./pages/TrackOrder";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AdminOrders from "./admin/Orders";
import AdminProducts from "./admin/Products";
import Subscribers from "./admin/Subscribers";

export default function App() {
  const lenisRef = useRef(null);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  // LENIS SMOOTH SCROLL
  useLayoutEffect(() => {
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

  // PAGE AND HASH SCROLL
  useLayoutEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) return;

    let frame1;
    let frame2;

    if (!location.hash) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }

    const sectionId = decodeURIComponent(location.hash.substring(1));

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);

        if (section) {
          lenis.scrollTo(section, {
            offset: -90,
            duration: 1.5,
          });
        }
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [location.pathname, location.hash]);

  return (
    <>
      {!isAdmin && <Navbar />}

      <main>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* PRODUCTS */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* FAQ */}
          <Route path="/faqs" element={<FAQs />} />

          {/* CUSTOMER REVIEWS */}
          <Route path="/customer-reviews" element={<CustomerReviews />} />

          {/* OTHER PAGES */}
          <Route path="/unboxing" element={<Unboxing />} />
          <Route path="/care-instructions" element={<CareInstructions />} />

          {/* CART */}
          <Route path="/cart" element={<Cart />} />

          {/* CHECKOUT */}
          <Route path="/checkout" element={<Checkout />} />

          {/* ORDER RESULTS */}
          <Route path="/order-success" element={<OrderResult success />} />
          <Route path="/order-failed" element={<OrderResult />} />
                    {/* TRACK ORDER */}
          <Route path="/track" element={<TrackOrder />} />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <div className="page-placeholder">
                <h1>My Profile</h1>
                <p>Profile page coming soon.</p>
              </div>
            }
          />

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN DASHBOARD */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="subscribers" element={<Subscribers />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}
