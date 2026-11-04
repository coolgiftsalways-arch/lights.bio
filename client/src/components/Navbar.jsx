import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { getCart, cartCount, onCartChange } from "../cart";
import "../Style/Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/#faq", label: "FAQs" },
  { to: "/#reviews", label: "Reviews" },
];

export default function Navbar() {
  const [count, setCount] = useState(() => cartCount(getCart()));
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => onCartChange(() => setCount(cartCount(getCart()))), []);
  useEffect(() => setOpen(false), [pathname]); // close mobile menu after navigating

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">lights.bio</Link>

        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
          {links.map(({ to, label }) =>
            to.includes("#") ? (
              <a key={label} href={to}>{label}</a>
            ) : (
              <NavLink key={label} to={to} end>{label}</NavLink>
            )
          )}
        </nav>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__icon" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={20} />
            {count > 0 && <span className="navbar__count">{count}</span>}
          </Link>
          <button className="navbar__icon" aria-label="Account">
            <User size={20} />
          </button>
          <button className="navbar__burger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}