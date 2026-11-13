import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Check,
  X,
  PackageCheck,
  Truck,
  Home,
  Sparkles,
  Smartphone,
  Banknote,
  ExternalLink,
} from "lucide-react";

import { clearCart, formatPrice, imageUrl, API } from "../cart";

import { deliveryWindow } from "../pricing";

import "../Style/OrderResult.css";

// ==========================================
// GOOGLE ADS PURCHASE CONVERSION
// ==========================================

// IMPORTANT:
// Replace LABEL_HERE with your actual Google Ads conversion label.

const GOOGLE_ADS_SEND_TO = "AW-18247244209/LABEL_HERE";

// ==========================================
// ORDER TRACKING
// ==========================================

const STEPS = [
  { label: "Confirmed", icon: Check },
  { label: "Packed", icon: PackageCheck },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: Home },
];

const STEP_INDEX = {
  paid: 0,
  confirmed: 0,
  shipped: 2,
  delivered: 3,
};

// ==========================================
// ORDER RESULT COMPONENT
// ==========================================

export default function OrderResult({ success = false }) {
  const [params] = useSearchParams();

  const orderId = params.get("order");

  const [order, setOrder] = useState(null);

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    if (success) {
      clearCart();
    }

    if (!orderId) return;

    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API}/orders/${orderId}`);

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Order fetching failed:", error);
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [success, orderId]);

  // ==========================================
  // GOOGLE ADS PURCHASE TRACKING
  // ==========================================

  useEffect(() => {
    if (!success || !order) return;

    // Only track successfully confirmed orders.
    // UPI = paid
    // COD = confirmed

    const validOrder = order.status === "paid" || order.status === "confirmed";

    if (!validOrder) return;

    // Wait until Google tag is available.
    if (typeof window.gtag !== "function") {
      console.warn("Google Ads tag is not available.");
      return;
    }

    // Unique transaction ID.
    const transactionId = String(order._id);

    // Prevent duplicate conversion events.
    const storageKey = `google_ads_purchase_${transactionId}`;

    if (localStorage.getItem(storageKey)) {
      console.log("Purchase already tracked:", transactionId);
      return;
    }

    // Your backend stores prices in paise.
    // Google Ads requires the value in INR.

    const conversionValue = Number(order.amount) / 100;

    if (!Number.isFinite(conversionValue) || conversionValue <= 0) {
      console.error("Invalid purchase value.");
      return;
    }

    // Send Google Ads purchase conversion.

    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_SEND_TO,

      value: conversionValue,

      currency: "INR",

      transaction_id: transactionId,
    });

    // Save transaction ID to prevent duplicate tracking.

    localStorage.setItem(storageKey, "tracked");

    console.log("Google Ads Purchase Conversion Sent:", {
      transactionId,
      value: conversionValue,
      currency: "INR",
      paymentMethod: order.paymentMethod,
    });
  }, [success, order]);

  // ==========================================
  // ORDER DETAILS
  // ==========================================

  const isCod = order?.paymentMethod === "cod";

  const step = Math.max(
    STEP_INDEX[order?.status] ?? 0,
    order?.shipping?.awb ? 1 : 0,
  );

  const date =
    order &&
    new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // ==========================================
  // FAILED PAYMENT
  // ==========================================

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
            No money was taken. Your cart is still saved, so you can try again
            whenever you're ready.
          </p>

          <div className="result__actions">
            <Link to="/cart" className="rbtn rbtn--primary">
              Back to cart
            </Link>

            <Link to="/products" className="rbtn rbtn--ghost">
              Browse products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // SUCCESSFUL ORDER
  // ==========================================

  return (
    <section className="result">
      <div className="result__glow" />

      <div className="result__inner">
        <div className="result__badge">
          <span className="result__ring" />

          <Check size={40} strokeWidth={2.75} />
        </div>

        <p className="result__eyebrow">
          <Sparkles size={14} />
          Order confirmed
        </p>

        <h1 className="result__title">
          Thank you.
          <em>Your glow is on its way.</em>
        </h1>

        <p className="result__text">
          {isCod ? (
            <>
              Please keep
              <strong>{order && formatPrice(order.amount)}</strong>
              ready to pay in cash when your order arrives.
            </>
          ) : (
            "Your payment was successful. We're getting your plants ready to ship."
          )}
        </p>

        {/* ======================================
            ORDER RECEIPT
        ====================================== */}

        {order && (
          <div className="receipt">
            <div className="receipt__head">
              <div>
                <span className="receipt__label">Order</span>

                <strong className="receipt__id">
                  #{order._id.slice(-6).toUpperCase()}
                </strong>
              </div>

              <div className="receipt__meta">
                <span>{date}</span>

                <span
                  className={`receipt__pill ${
                    isCod ? "receipt__pill--cod" : ""
                  }`}
                >
                  {isCod ? <Banknote size={14} /> : <Smartphone size={14} />}

                  {isCod ? "Cash on delivery" : "Paid via UPI"}
                </span>
              </div>
            </div>

            {/* PRODUCT ITEMS */}

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

                  <span className="receipt__price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* DISCOUNT */}

            {order.discount > 0 && (
              <div className="receipt__line">
                <span>UPI discount</span>

                <span className="receipt__save">
                  −{formatPrice(order.discount)}
                </span>
              </div>
            )}

            {/* TOTAL */}

            <div className="receipt__total">
              <span>{isCod ? "To pay on delivery" : "Total paid"}</span>

              <strong>{formatPrice(order.amount)}</strong>
            </div>

            {order.discount > 0 && (
              <p className="receipt__saved">
                🎉 You saved {formatPrice(order.discount)} by paying with UPI
              </p>
            )}

            {/* DELIVERY */}

            {order.delivery?.minDays && (
              <p className="receipt__eta">
                Estimated delivery:
                <strong>
                  {deliveryWindow(
                    order.delivery,
                    new Date(order.placedAt || order.createdAt),
                  )}
                </strong>
              </p>
            )}

            {/* SHIPPING */}

            {order.shipping?.awb && (
              <div className="receipt__ship">
                <div>
                  <span className="receipt__label">
                    Shipped with {order.shipping.courier || "our courier"}
                  </span>

                  <span className="mono">AWB {order.shipping.awb}</span>

                  {order.shipping.status && (
                    <span className="receipt__shipstatus">
                      {order.shipping.status}
                    </span>
                  )}
                </div>

                {order.shipping.trackUrl && (
                  <a
                    className="rbtn rbtn--ghost receipt__track"
                    href={order.shipping.trackUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Track package
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            )}

            {/* ORDER TRACKER */}

            <ol className="tracker">
              {STEPS.map(({ label, icon: Icon }, i) => (
                <li
                  key={label}
                  className={
                    i <= step
                      ? "tracker__step tracker__step--done"
                      : "tracker__step"
                  }
                >
                  <span className="tracker__dot">
                    <Icon size={16} />
                  </span>

                  <span className="tracker__label">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ======================================
            ACTION BUTTONS
        ====================================== */}

        <div className="result__actions">
          <Link to="/products" className="rbtn rbtn--primary">
            Continue shopping
          </Link>

          <Link to="/" className="rbtn rbtn--ghost">
            Back to home
          </Link>

          {order ? (
            <Link
              to={`/track?order=${order._id.slice(-6).toUpperCase()}`}
              className="rbtn rbtn--ghost"
            >
              Track this order
            </Link>
          ) : (
            <Link to="/" className="rbtn rbtn--ghost">
              Back to home
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
