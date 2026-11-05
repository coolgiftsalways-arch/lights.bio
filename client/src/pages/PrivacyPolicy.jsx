import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import "../Style/LegalPages.css";

export default function PrivacyPolicy() {
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
        <span className="legal-eyebrow">YOUR PRIVACY MATTERS</span>
        <h1>
          Privacy <span>Policy.</span>
        </h1>
        <p>
          Your trust matters to us. Here's how we handle the information you
          share when shopping with Nively.
        </p>
        <span className="legal-updated">Last updated: November 2026</span>
      </section>

      <section className="legal-content">
        <aside className="legal-sidebar">
          <span>ON THIS PAGE</span>
          <a href="#information">01. Information</a>
          <a href="#usage">02. How we use it</a>
          <a href="#cookies">03. Cookies</a>
          <a href="#sharing">04. Sharing</a>
          <a href="#security">05. Security</a>
          <a href="#rights">06. Your rights</a>
          <a href="#children">07. Children</a>
          <a href="#changes">08. Updates</a>
          <a href="#contact">09. Contact</a>
        </aside>

        <div className="legal-article">
          <div className="legal-intro">
            <ShieldCheck size={25} />
            <p>
              This Privacy Policy explains how Nively collects, uses, stores and
              protects information when you visit our website, contact us or
              place an order.
            </p>
          </div>

          <article id="information">
            <span>01 / INFORMATION WE COLLECT</span>
            <h2>What Information Do We Collect?</h2>
            <p>Depending on how you use our website, we may collect:</p>
            <ul>
              <li>Your name and contact details.</li>
              <li>Email address and phone number.</li>
              <li>Billing and delivery addresses.</li>
              <li>Order history and purchase details.</li>
              <li>Information you provide when contacting support.</li>
              <li>Basic device and website usage information.</li>
            </ul>
            <p>
              Payment information may be processed securely by our payment
              service providers. We do not claim to store complete payment card
              details ourselves.
            </p>
          </article>

          <article id="usage">
            <span>02 / WHY WE COLLECT IT</span>
            <h2>How We Use Your Information</h2>
            <p>We may use your information to:</p>
            <ul>
              <li>Process and deliver your orders.</li>
              <li>Send order confirmations and delivery updates.</li>
              <li>Respond to questions and customer support requests.</li>
              <li>Improve our products and website experience.</li>
              <li>Prevent fraud and protect website security.</li>
              <li>Send promotional communications where permitted.</li>
            </ul>
          </article>

          <article id="cookies">
            <span>03 / WEBSITE EXPERIENCE</span>
            <h2>Cookies & Tracking</h2>
            <p>
              Our website may use cookies or similar technologies to remember
              preferences, maintain shopping cart functionality and understand
              website performance.
            </p>
            <p>
              You can manage cookies through your browser settings. Disabling
              certain cookies may affect some website features.
            </p>
          </article>

          <article id="sharing">
            <span>04 / THIRD-PARTY SERVICES</span>
            <h2>When We Share Information</h2>
            <p>
              We may share relevant information with trusted service providers
              when needed to operate our business, including:
            </p>
            <ul>
              <li>Payment processing providers.</li>
              <li>Shipping and delivery partners.</li>
              <li>Website hosting and technology providers.</li>
              <li>Customer support and communication services.</li>
            </ul>
            <p>
              We do not sell your personal information. Information may also be
              disclosed where required by applicable law or to protect legal
              rights and security.
            </p>
          </article>

          <article id="security">
            <span>05 / DATA PROTECTION</span>
            <h2>How We Protect Your Information</h2>
            <p>
              We take reasonable technical and organisational measures to
              protect personal information against unauthorised access, loss,
              misuse or alteration.
            </p>
            <p>
              However, no online transmission or storage system can be
              guaranteed to be completely secure.
            </p>
          </article>

          <article id="rights">
            <span>06 / YOUR CONTROL</span>
            <h2>Your Privacy Rights</h2>
            <p>
              Subject to applicable law, you may request access to, correction
              of or deletion of your personal information. You may also withdraw
              consent where processing is based on consent.
            </p>
            <p>
              You can contact us to make a privacy-related request. We may need
              to verify your identity before responding.
            </p>
          </article>

          <article id="children">
            <span>07 / AGE & PRIVACY</span>
            <h2>Children's Privacy</h2>
            <p>
              Our website is not intended to knowingly collect personal
              information from children without appropriate parental or guardian
              involvement. If you believe a child has provided personal
              information improperly, please contact us.
            </p>
          </article>

          <article id="changes">
            <span>08 / POLICY UPDATES</span>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy when our practices or legal
              requirements change. The latest version will be published on this
              page with its updated date.
            </p>
          </article>

          <article id="contact">
            <span>09 / CONTACT US</span>
            <h2>Questions About Your Privacy?</h2>
            <p>
              For privacy questions, information requests or concerns, contact
              our team:
            </p>
            <a className="legal-contact-link" href="mailto:hello@lights.bio">
              hello@lights.bio <ArrowUpRight size={17} />
            </a>
          </article>

          <div className="legal-note">
            <ShieldCheck size={22} />
            <p>Your trust is important to us. Thank you for choosing Nively.</p>
          </div>
        </div>
      </section>

      <footer className="legal-footer">
        <span>© {new Date().getFullYear()} Nively. All rights reserved.</span>
        <Link to="/terms-and-conditions">
          Terms & Conditions <ArrowUpRight size={14} />
        </Link>
        <Link to="/">Return to home</Link>
      </footer>
    </main>
  );
}
