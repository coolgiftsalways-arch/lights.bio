import { useState } from "react";

const links = [
  ["Products", "#"],
  ["Retailer Locator", "#"],
  ["Unboxing", "#"],
  ["Care Instructions", "#"],
  ["FAQs", "#faq"],
  ["Reviews", "#reviews"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="logo">light bio</a>

        <nav className={open ? "nav nav--open" : "nav"}>
          {links.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href="#" className="user" aria-label="Log in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </a>
        </nav>

        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}