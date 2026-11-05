import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, ArrowUpRight } from "lucide-react";
import "../Style/LegalPages.css";

export default function TermsConditions() {
  return (
    <main className="legal-page">
      <div className="legal-topbar">
        <Link to="/" className="legal-logo">
          <Leaf size={25} />
          <span>
            nively<span>.bio</span>
          </span>
        </Link>
        <Link to="/" className="legal-back">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>

      <section className="legal-hero">
        <span className="legal-eyebrow">THE IMPORTANT DETAILS</span>
        <h1>
          Terms & <span>Conditions.</span>
        </h1>
        <p>
          A few simple guidelines to make your shopping experience comfortable,
          transparent and enjoyable.
        </p>
        <span className="legal-updated">Last updated: November 2026</span>
      </section>

      <section className="legal-content">
        <aside className="legal-sidebar">
          <span>ON THIS PAGE</span>
          <a href="#acceptance">01. Acceptance</a>
          <a href="#products">02. Products</a>
          <a href="#orders">03. Orders</a>
          <a href="#payments">04. Payments</a>
          <a href="#shipping">05. Shipping</a>
          <a href="#returns">06. Returns</a>
          <a href="#responsibility">07. Responsibility</a>
          <a href="#contact">08. Contact</a>
        </aside>

        <div className="legal-article">
          <div className="legal-intro">
            <Leaf size={23} />
            <p>
              Welcome to Nively. By visiting our website or purchasing products,
              you agree to the following terms and conditions. Please read them
              carefully before placing an order.
            </p>
          </div>

          <article id="acceptance">
            <span>01 / GENERAL</span>
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to follow these
              Terms & Conditions and all applicable laws. If you do not agree
              with these terms, please do not use our website.
            </p>
          </article>

          <article id="products">
            <span>02 / OUR COLLECTION</span>
            <h2>Products & Descriptions</h2>
            <p>
              We aim to display accurate product photographs, descriptions and
              prices. However, natural plants may vary slightly in size, colour,
              shape and appearance.
            </p>
            <p>
              Product availability may change without prior notice. Images are
              representative and the actual plant may have natural variations.
            </p>
          </article>

          <article id="orders">
            <span>03 / SHOPPING</span>
            <h2>Orders & Confirmation</h2>
            <p>
              When you place an order, you agree to provide accurate contact,
              delivery and billing information.
            </p>
            <p>
              An order confirmation does not guarantee acceptance. We reserve
              the right to cancel an order if a product is unavailable, pricing
              information is incorrect or a transaction cannot be verified. Any
              payment received for a cancelled order will be handled
              appropriately.
            </p>
          </article>

          <article id="payments">
            <span>04 / SECURE CHECKOUT</span>
            <h2>Payments & Pricing</h2>
            <p>
              All prices are displayed in Indian Rupees (INR), unless stated
              otherwise. Applicable taxes and delivery charges will be shown
              during checkout.
            </p>
            <p>
              Payments must be completed through the payment methods made
              available on our website. Orders may not be processed until
              payment is confirmed.
            </p>
          </article>

          <article id="shipping">
            <span>05 / DELIVERY</span>
            <h2>Shipping & Delivery</h2>
            <p>
              Delivery timelines are estimates and may vary depending on your
              location, courier availability, weather and other circumstances.
            </p>
            <p>
              Please provide a complete and correct delivery address. We will
              communicate shipping updates where available.
            </p>
          </article>

          <article id="returns">
            <span>06 / AFTER PURCHASE</span>
            <h2>Returns & Refunds</h2>
            <p>
              Return and refund requests are subject to our applicable return
              policy. Because plants are living products, special conditions may
              apply.
            </p>
            <p>
              If your product arrives damaged or incorrect, contact us promptly
              with your order details and clear photographs. Our team will
              review your request under the applicable policy.
            </p>
            <p>Please read our return policy before placing an order.</p>
          </article>

          <article id="responsibility">
            <span>07 / WEBSITE USE</span>
            <h2>Website Responsibility</h2>
            <p>
              You agree not to misuse this website, interfere with its
              operation, attempt unauthorised access or use its content for
              unlawful purposes.
            </p>
            <p>
              Website text, branding, graphics and design elements may not be
              copied or reused without appropriate permission.
            </p>
          </article>

          <article id="contact">
            <span>08 / GET IN TOUCH</span>
            <h2>Questions About These Terms?</h2>
            <p>
              If you have questions about these terms, please contact our team.
            </p>
            <a className="legal-contact-link" href="mailto:hello@lights.bio">
              hello@lights.bio <ArrowUpRight size={17} />
            </a>
          </article>

          <div className="legal-note">
            <Leaf size={20} />
            <p>
              Thank you for being part of our growing community. Let's make
              everyday spaces a little greener.
            </p>
          </div>
        </div>
      </section>

      <footer className="legal-footer">
        <span>© {new Date().getFullYear()} Nively. All rights reserved.</span>
        <Link to="/privacy-policy">
          Privacy Policy <ArrowUpRight size={14} />
        </Link>
        <Link to="/">Return to home</Link>
      </footer>
    </main>
  );
}
