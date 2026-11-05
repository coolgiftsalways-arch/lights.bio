import { Link } from "react-router-dom";
import { Leaf, MapPin, ArrowUpRight } from "lucide-react";
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
              <Leaf size={16} strokeWidth={1.7} />
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
              Explore plants
              <ArrowUpRight size={18} />
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

        {/* FOOTER LINKS */}
        <div className="footer__grid">
          {/* BRAND */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <Leaf size={25} strokeWidth={1.6} />
              <span>
                lights<span>.bio</span>
              </span>
            </Link>

            <p>
              Plants for your space. Inspiration for your lifestyle. A little
              more nature, every day.
            </p>

            {/* SOCIAL ICONS */}
            <div className="footer__socials">
              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/light.bio?dlrf=a25vMjN2aHltZzE4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Light.bio on Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="21"
                  height="21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/share/1BKmFCkZH3/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Light.bio on Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="21"
                  height="21"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H7.6V13h2.7v8h3.2Z" />
                </svg>
              </a>

              {/* YOUTUBE */}
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path
                    d="m10 9 5 3-5 3V9Z"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
            </div>

            <p className="footer__location">
              <MapPin size={17} />
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
            <Link to="/faqs">FAQs</Link>
            <Link to="/customer-reviews">Customer Reviews</Link>
          </div>

          {/* PLANT WORLD */}
          <div className="footer__column">
            <h4>PLANT WORLD</h4>
            <Link to="/products">Indoor Plants</Link>
            <Link to="/products">Outdoor Plants</Link>
            <Link to="/products">Succulents</Link>
            <Link to="/products">Flowering Plants</Link>
            <Link to="/products">Plant Accessories</Link>
            <Link to="/care-instructions">Care Instructions</Link>
            <Link to="/unboxing">Unboxing</Link>
          </div>

          {/* SUPPORT */}
          <div className="footer__column">
            <h4>SUPPORT</h4>
            <Link to="/customer-reviews">Community Guidelines</Link>
            <a href="mailto:hello@lights.bio">Contact Us</a>
            <Link to="/cart">My Cart</Link>
            <a href="mailto:hello@lights.bio">Order Support</a>
            <Link to="/shipping">Shipping Information</Link>
            <Link to="/refund">Returns & Refunds</Link>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} lights.bio. All rights reserved.</p>

          <div className="footer__legal-links">
            <Link to="/terms-and-conditions">Terms & Conditions</Link>

            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
