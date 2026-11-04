import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__notice">
          <strong>Official notice:</strong> write your own distribution or disclaimer note here.
        </p>

        <div className="footer__grid">
          <a href="#top" className="logo">light bio</a>

          <div>
            <h4>Quick links</h4>
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Unboxing</a>
            <a href="#">Care Instructions</a>
            <a href="#faq">FAQs</a>
            <a href="#reviews">Customer Reviews</a>
          </div>

          <div>
            <h4>Support</h4>
            <a href="#">Community Guidelines</a>
            <a href="#">Contact Us</a>
            <a href="#">My Orders</a>
            <a href="#">Retailer Locator</a>
          </div>

          <div>
            <p className="footer__join">Join our email list for updates and stories.</p>
            <Newsletter variant="footer" />
            <p className="footer__legal">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>

        <div className="footer__bar">
          <span>© {new Date().getFullYear()}, Light Bio clone. Practice project.</span>
          <span className="footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
            <a href="#">Refund Policy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}