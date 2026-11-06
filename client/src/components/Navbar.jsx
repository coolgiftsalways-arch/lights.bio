import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  ShoppingBag,
  Menu,
  X,
  Leaf,
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";

import { getCart, cartCount, onCartChange } from "../cart";
import "../Style/Navbar.css";

// PREMIUM INDIA-FOCUSED BRAND TICKER
const tickerItems = [
  "EXCLUSIVELY AVAILABLE IN INDIA",
  "DISCOVER LIVING BOTANICALS",
  "BRING NATURE CLOSER TO HOME",
  "A NEW WAY TO EXPERIENCE PLANTS",
  "MADE FOR INDIAN HOMES",
  "SHOP YOUR BOTANICAL FAVOURITES",
];

const links = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Unboxing", path: "/unboxing" },
  { name: "Care Guide", path: "/care-instructions" },
  { name: "FAQs", path: "/faqs" },
  { name: "Reviews", path: "/customer-reviews" },
  { name: "Track Order", path: "/track" },
];

export default function Navbar() {
  const [count, setCount] = useState(() => cartCount(getCart()));
  const [open, setOpen] = useState(false);

  const location = useLocation();

  // CART COUNT UPDATE
  useEffect(() => {
    return onCartChange(() => {
      setCount(cartCount(getCart()));
    });
  }, []);

  // CLOSE MENU AFTER NAVIGATION
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // CLOSE MENU ON DESKTOP RESIZE
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

  // PREVENT BACKGROUND SCROLL WHEN MOBILE MENU IS OPEN
  useEffect(() => {
    document.body.classList.toggle("menu-is-open", open);

    return () => {
      document.body.classList.remove("menu-is-open");
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  // ACTIVE NAVIGATION LINK
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <header className="navbar">
      {/* TOP INFINITE TICKER */}
      <div className="navbar__ticker">
        <div className="navbar__ticker-track">
          {[0, 1].map((group) => (
            <div
              className="navbar__ticker-group"
              key={group}
              aria-hidden={group === 1}
            >
              {tickerItems.map((item, index) => (
                <span className="navbar__ticker-item" key={index}>
                  <span className="ticker-star">✳</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="navbar__main">
        <div className="navbar__inner">
          {/* LOGO */}
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            <span className="navbar__logo-icon">
              <Leaf size={25} strokeWidth={1.5} />
            </span>

            <span className="navbar__logo-text">
              lights<span className="navbar__logo-dot">.</span>bio
              <span className="navbar__logo-caption">LIVING BOTANICALS</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="navbar__links">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${
                  isActive(link.path) ? "active" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* NAVBAR ACTIONS */}
          <div className="navbar__actions">
            {/* CART */}
            <Link
              to="/cart"
              className="navbar__cart"
              aria-label={`Cart with ${count} items`}
              onClick={closeMenu}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />

              <span className="navbar__cart-count">{count}</span>
            </Link>

            {/* SHOP BUTTON */}
            <Link
              to="/products"
              className="navbar__shop-btn"
              onClick={closeMenu}
            >
              SHOP NOW
              <ArrowUpRight size={16} />
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              className={`navbar__menu-btn ${open ? "is-open" : ""}`}
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* PREMIUM MOBILE MENU */}
      <div
        id="mobile-navigation"
        className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}
        aria-hidden={!open}
      >
        <div className="mobile-menu__top">
          <span>EXPLORE THE WORLD OF LIGHTS.BIO</span>

          <span className="mobile-menu__status">
            <span className="mobile-menu__status-dot" />
            ONLINE STORE
          </span>
        </div>

        <div className="mobile-menu__content">
          {/* MENU HEADING */}
          <div className="mobile-menu__heading">
            <span>DISCOVER</span>
            <Leaf size={23} strokeWidth={1.3} />
          </div>

          {/* MOBILE LINKS */}
          <nav className="mobile-menu__links">
            {links.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`mobile-menu__link ${
                  isActive(link.path) ? "active" : ""
                }`}
                style={{ "--menu-index": index }}
                tabIndex={open ? 0 : -1}
              >
                <span className="mobile-menu__number">0{index + 1}</span>

                <span className="mobile-menu__link-name">{link.name}</span>

                <MoveUpRight className="mobile-menu__arrow" size={20} />
              </Link>
            ))}
          </nav>

          {/* MOBILE SHOP SECTION */}
          <div className="mobile-menu__bottom">
            <Link
              to="/products"
              className="mobile-menu__shop"
              onClick={closeMenu}
              tabIndex={open ? 0 : -1}
            >
              EXPLORE OUR COLLECTION
              <ArrowUpRight size={20} />
            </Link>

            <div className="mobile-menu__footer">
              <span>GROWN WITH NATURE</span>
              <span>MADE FOR INDIA ✳</span>
            </div>
          </div>
        </div>

        {/* DECORATIVE LEAF */}
        <div className="mobile-menu__decoration">
          <Leaf size={170} strokeWidth={0.5} />
        </div>
      </div>
    </header>
  );
}
