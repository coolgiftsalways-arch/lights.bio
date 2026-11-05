import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X, PackageCheck, Truck, Home, Sparkles, Smartphone, Banknote } from "lucide-react";
import { clearCart, formatPrice, imageUrl, API } from "../cart";
import { deliveryWindow } from "../pricing";
import "../Style/OrderResult.css";

const STEPS = [
  { label: "Confirmed", icon: Check },
  { label: "Packed", icon: PackageCheck },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: Home },
];
// which step is reached for each order status
const STEP_INDEX = { paid: 0, confirmed: 0, shipped: 2, delivered: 3 };

// Razorpay sends customers back to /order-success?order=... or /order-failed
export default function OrderResult({ success = false }) {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (success) clearCart();
    if (!orderId) return;
    fetch(`${API}/orders/${orderId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .catch(() => {});
  }, [success, orderId]);

  const isCod = order?.paymentMethod === "cod";
  const step = STEP_INDEX[order?.status] ?? 0;
  const date = order && new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  if (!success) {
    return (
      <section className="result result--failed">
        <div className="result__glow" />
        <div className="result__inner">
          <div className="result__badge result__badge--failed">
            <X size={38} strokeWidth={2.5} />
          </div>
          <p className="result__eyebrow">Payment not completed</p>
          <h1 className="result__title">Something didn't glow right</h1>
          <p className="result__text">
            No money was taken. Your cart is still saved, so you can try again whenever you're ready.
          </p>
          <div className="result__actions">
            <Link to="/cart" className="rbtn rbtn--primary">Back to cart</Link>
            <Link to="/products" className="rbtn rbtn--ghost">Browse products</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="result">
      <div className="result__glow" />
      <div className="result__inner">
        <div className="result__badge">
          <span className="result__ring" />
          <Check size={40} strokeWidth={2.75} />
        </div>

        <p className="result__eyebrow"><Sparkles size={14} /> Order confirmed</p>
        <h1 className="result__title">
          Thank you. <em>Your glow is on its way.</em>
        </h1>
        <p className="result__text">
          {isCod
            ? <>Please keep <strong>{order && formatPrice(order.amount)}</strong> ready to pay in cash when your order arrives.</>
            : "Your payment was successful. We're getting your plants ready to ship."}
        </p>

        {order && (
          <div className="receipt">
            <div className="receipt__head">
              <div>
                <span className="receipt__label">Order</span>
                <strong className="receipt__id">#{order._id.slice(-6).toUpperCase()}</strong>
              </div>
              <div className="receipt__meta">
                <span>{date}</span>
                <span className={`receipt__pill ${isCod ? "receipt__pill--cod" : ""}`}>
                  {isCod ? <Banknote size={14} /> : <Smartphone size={14} />}
                  {isCod ? "Cash on delivery" : "Paid via UPI"}
                </span>
              </div>
            </div>

            <ul className="receipt__items">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.product?.images?.[0] ? (
                    <img src={imageUrl(item.product.images[0])} alt="" />
                  ) : (
                    <span className="receipt__noimg" />
                  )}
                  <span className="receipt__name">
                    {item.name}
                    <small>Qty {item.quantity}</small>
                  </span>
                  <span className="receipt__price">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

                        {order.discount > 0 && (
              <div className="receipt__line">
                <span>UPI discount</span>
                <span className="receipt__save">−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="receipt__total">
              <span>{isCod ? "To pay on delivery" : "Total paid"}</span>
              <strong>{formatPrice(order.amount)}</strong>
            </div>
            {order.discount > 0 && (
              <p className="receipt__saved">🎉 You saved {formatPrice(order.discount)} by paying with UPI</p>
            )}
            {order.delivery?.minDays && (
              <p className="receipt__eta">
                Estimated delivery: <strong>{deliveryWindow(order.delivery, new Date(order.placedAt || order.createdAt))}</strong>
              </p>
            )}

            <ol className="tracker">
              {STEPS.map(({ label, icon: Icon }, i) => (
                <li key={label} className={i <= step ? "tracker__step tracker__step--done" : "tracker__step"}>
                  <span className="tracker__dot"><Icon size={16} /></span>
                  <span className="tracker__label">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="result__actions">
          <Link to="/products" className="rbtn rbtn--primary">Continue shopping</Link>
          <Link to="/" className="rbtn rbtn--ghost">Back to home</Link>
        </div>
      </div>
    </section>
  );
}