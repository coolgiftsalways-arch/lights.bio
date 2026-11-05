import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Leaf } from "lucide-react";

import { getCart, cartCount, onCartChange } from "../cart";
import "../Style/Navbar.css";

export default function Navbar() {
  const [count, setCount] = useState(() => cartCount(getCart()));
  const [open, setOpen] = useState(false);

  const location = useLocation();

  // UPDATE CART COUNT
  useEffect(() => {
    return onCartChange(() => {
      setCount(cartCount(getCart()));
    });
  }, []);

  // CLOSE MOBILE MENU ON NAVIGATION
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // CLOSE MENU ON DESKTOP
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* LOGO */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">
            <Leaf size={22} strokeWidth={1.5} />
          </span>

          <span className="navbar__logo-text">
            lights<span className="navbar__logo-dot">.</span>bio
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
          <Link
            to="/"
            className={`navbar__link ${isActive("/") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`navbar__link ${isActive("/products") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Products
          </Link>

          <Link
            to="/unboxing"
            className={`navbar__link ${isActive("/unboxing") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Unboxing
          </Link>

          <Link
            to="/care-instructions"
            className={`navbar__link ${
              isActive("/care-instructions") ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Care Instructions
          </Link>

          {/* FAQ PAGE */}
          <Link
            to="/faqs"
            className={`navbar__link ${isActive("/faqs") ? "active" : ""}`}
            onClick={closeMenu}
          >
            FAQs
          </Link>

          {/* SEPARATE CUSTOMER REVIEWS PAGE */}
          <Link
            to="/customer-reviews"
            className={`navbar__link ${
              isActive("/customer-reviews") ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Reviews
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="navbar__actions">
          {/* CART ONLY - PROFILE ICON REMOVED */}
          <Link
            to="/cart"
            className="navbar__cart"
            aria-label={`Cart with ${count} items`}
            onClick={closeMenu}
          >
            <ShoppingBag size={20} strokeWidth={1.6} />
            <span className="navbar__cart-count">{count}</span>
          </Link>

          {/* MOBILE MENU */}
          <button
            type="button"
            className="navbar__menu-btn"
            onClick={() => setOpen((previous) => !previous)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
