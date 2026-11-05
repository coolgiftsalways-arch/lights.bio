import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Leaf } from "lucide-react";
import gsap from "gsap";

import { getCart, cartCount, onCartChange } from "../cart";
import "../Style/Navbar.css";

export default function Navbar() {
  const [count, setCount] = useState(() => cartCount(getCart()));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navbarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    location.hash === "#faq"
      ? "FAQs"
      : location.hash === "#reviews"
        ? "Reviews"
        : location.pathname === "/products"
          ? "Products"
          : location.pathname === "/"
            ? "Home"
            : "";

  // CART UPDATE
  useEffect(() => {
    return onCartChange(() => {
      setCount(cartCount(getCart()));
    });
  }, []);

  // MOBILE MENU CLOSE
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // DETECT SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP BACKGROUND ANIMATION ONLY
  useEffect(() => {
    if (!navbarRef.current) return;

    gsap.to(navbarRef.current, {
      backgroundColor: scrolled
        ? "rgba(16, 20, 15, 0.94)"
        : "rgba(16, 20, 15, 0)",
      backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
      borderBottomColor: scrolled
        ? "rgba(255,255,255,0.10)"
        : "rgba(255,255,255,0)",
      boxShadow: scrolled
        ? "0 8px 30px rgba(0,0,0,0.12)"
        : "0 0px 0px rgba(0,0,0,0)",
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [scrolled]);

  // FAQ AND REVIEWS NAVIGATION
  const goToSection = (section) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
        });
        window.history.replaceState(null, "", `/#${section}`);
      }, 350);
    } else {
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
      });
      window.history.replaceState(null, "", `/#${section}`);
    }
  };

  return (
    <header ref={navbarRef} className="navbar">
      <div className="navbar__inner">
        {/* LOGO */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <Leaf size={21} strokeWidth={1.6} />
          </span>
          <span>
            lights<span className="navbar__logo-dot">.</span>bio
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
          <Link
            to="/"
            className={`navbar__link ${currentPage === "Home" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`navbar__link ${currentPage === "Products" ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Products
          </Link>

          <button
            className={`navbar__link ${currentPage === "FAQs" ? "active" : ""}`}
            onClick={() => goToSection("faq")}
          >
            FAQs
          </button>

          <button
            className={`navbar__link ${currentPage === "Reviews" ? "active" : ""}`}
            onClick={() => goToSection("reviews")}
          >
            Reviews
          </button>
        </nav>

        {/* ACTIONS */}
        <div className="navbar__actions">
          <Link to="/profile" className="navbar__icon" aria-label="Profile">
            <User size={19} strokeWidth={1.6} />
          </Link>

          <Link to="/cart" className="navbar__cart" aria-label="Cart">
            <ShoppingBag size={19} strokeWidth={1.6} />
            <span className="navbar__cart-count">{count}</span>
          </Link>

          <button
            className="navbar__menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}
