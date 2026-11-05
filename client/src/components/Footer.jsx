
import { Link } from "react-router-dom";
import "../Style/Footer.css";

export default function Footer() {
 

  return (
    <footer className="footer" id="footer">
      <div className="footer__glow"></div>

      <div className="container">
        {/* NOTICE */}
        <div className="footer__notice">
          <span className="footer__notice-dot"></span>
          <p>
            <strong>Official notice:</strong> lights.bio is a plant discovery
            and shopping experience. Explore our collection and bring nature
            into your space.
          </p>
        </div>

        {/* HERO */}
        <div className="footer__hero">
          <div className="footer__hero-content">
            <span className="footer__eyebrow">
              <span className="footer__leaf">✳</span>
              ROOTED IN NATURE
            </span>

            <h2>
              Bring life
              <br />
              <span>into your space.</span>
            </h2>

            <p>
              A greener home starts with one little plant. Find your favourite
              and let nature become part of your everyday.
            </p>

            <Link to="/products" className="footer__shop">
              Explore plants <span>↗</span>
            </Link>
          </div>

          <div className="footer__quote">
            <span>01 / A GREENER WAY OF LIVING</span>
            <p>
              "Grow a little. Live a little greener. Make every corner feel
              alive."
            </p>
            <div className="footer__quote-line"></div>
          </div>
        </div>

        <div className="footer__divider"></div>

        {/* LINKS */}
        <div className="footer__grid">
          {/* BRAND */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">✳</span>
              light<span>.bio</span>
            </Link>

            <p>
              Plants for your space. Inspiration for your lifestyle. A little
              more nature, every day.
            </p>

            <div className="footer__socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ◎
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                ▶
              </a>
            </div>

            <p className="footer__location">
              <span>⌖</span>
              Made for plant lovers everywhere
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer__column">
            <h4>QUICK LINKS</h4>
            <Link to="/">Home</Link>
            <Link to="/products">All Products</Link>
            <Link to="/products">Shop by Category</Link>
            <Link to="/products">New Arrivals</Link>
            <a href="/#faq">FAQs</a>
            <a href="/#reviews">Customer Reviews</a>
          </div>

          {/* PLANT WORLD */}
          <div className="footer__column">
            <h4>PLANT WORLD</h4>
            <Link to="/products">Indoor Plants</Link>
            <Link to="/products">Outdoor Plants</Link>
            <Link to="/products">Succulents</Link>
            <Link to="/products">Flowering Plants</Link>
            <Link to="/products">Plant Accessories</Link>
            <a href="/#care">Care Instructions</a>
            <a href="/#unboxing">Unboxing</a>
          </div>

          {/* SUPPORT */}
          <div className="footer__column">
            <h4>SUPPORT</h4>
            <a href="/#community">Community Guidelines</a>
            <a href="mailto:hello@lights.bio">Contact Us</a>
            <Link to="/cart">My Cart</Link>
            <a href="mailto:hello@lights.bio">Order Support</a>
            <a href="/shipping">Shipping Information</a>
            <a href="/refund">Returns & Refunds</a>
          </div>
        </div>

        {/* NEWSLETTER */}
       
      </div>
    </footer>
  );
}
