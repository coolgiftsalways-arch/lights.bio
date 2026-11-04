import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { clearCart, formatPrice, API } from "../cart";
import "../Style/Products.css";
import "../Style/Cart.css";

// Razorpay sends customers back to /order-success?order=... or /order-failed
export default function OrderResult({ success = false }) {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (success) clearCart();
    if (orderId) {
      fetch(`${API}/orders/${orderId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then(setOrder)
        .catch(() => {});
    }
  }, [success, orderId]);

  return (
    <section className="cartpage">
      <div className="cartpage__empty">
        {success ? (
          <>
            <h1>Thank you! 🌱</h1>
            <p>Your payment was successful and your order is confirmed.</p>
            {order && (
              <p>
                Order <strong>#{order._id.slice(-6).toUpperCase()}</strong> · {formatPrice(order.amount)}
              </p>
            )}
            <Link to="/products" className="sbtn sbtn--dark">Continue shopping</Link>
          </>
        ) : (
          <>
            <h1>Payment didn't go through</h1>
            <p>No money was taken. Your cart is still saved — please try again.</p>
            <Link to="/cart" className="sbtn sbtn--dark">Back to cart</Link>
          </>
        )}
      </div>
    </section>
  );
}