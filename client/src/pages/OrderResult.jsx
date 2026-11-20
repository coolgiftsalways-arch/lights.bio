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
// META PIXEL CONFIGURATION
// ==========================================

const META_PIXEL_ID = "1761236734955235";

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
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ORDER FROM BACKEND
  // ==========================================

  useEffect(() => {
    if (success) {
      clearCart();
    }

    if (!orderId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrder = async () => {
      try {
        setLoading(true);

        console.log("Fetching order:", orderId);

        const response = await fetch(`${API}/orders/${orderId}`);

        if (!response.ok) {
          throw new Error(`Order API error: ${response.status}`);
        }

        const data = await response.json();

        // Support different API response structures.
        const orderData = data.order || data.data || data;

        if (!cancelled) {
          console.log("ORDER DATA:", orderData);
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Order fetching failed:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [success, orderId]);

  // ==========================================
  // META ADS PURCHASE CONVERSION
  // ==========================================

  useEffect(() => {
    if (!success || !order) {
      console.log("Meta Purchase waiting for order data.");
      return;
    }

    console.log("Checking Meta Purchase eligibility:", {
      orderId: order._id,
      status: order.status,
      amount: order.amount,
      paymentMethod: order.paymentMethod,
    });

    // ========================================
    // VERIFY SUCCESSFUL ONLINE PAYMENT
    // ========================================

    // Only count successfully paid UPI orders.
    // COD is not an online purchase yet.

    const validOrder = order.status === "paid" && order.paymentMethod === "upi";

    if (!validOrder) {
      console.log("Meta Purchase not sent. Order is not a paid UPI order.");

      return;
    }

    // ========================================
    // TRANSACTION ID
    // ========================================

    const transactionId = String(order._id || "");

    if (!transactionId || transactionId === "undefined") {
      console.error("Meta Purchase: Invalid transaction ID.");
      return;
    }

    // ========================================
    // DUPLICATE PREVENTION
    // ========================================

    const storageKey = `meta_purchase_${transactionId}`;

    try {
      if (localStorage.getItem(storageKey)) {
        console.log("Meta Purchase already tracked:", transactionId);

        return;
      }
    } catch (error) {
      console.warn("LocalStorage unavailable:", error);
      return;
    }

    // ========================================
    // META PIXEL CHECK
    // ========================================

    if (typeof window.fbq !== "function") {
      console.error("Meta Pixel is not initialized. Purchase not sent.");

      return;
    }

    // ========================================
    // PURCHASE VALUE
    // ========================================

    // Razorpay and the backend store the amount in paise.
    // Meta expects the amount in rupees.

    const purchaseValue = Number(order.amount) / 100;

    if (!Number.isFinite(purchaseValue) || purchaseValue <= 0) {
      console.error("Invalid Meta Purchase amount:", order.amount);

      return;
    }

    // ========================================
    // PRODUCT INFORMATION
    // ========================================

    const contentIds = (order.items || [])
      .map((item) => {
        const product = item.product;

        return String(product?._id || product || "");
      })
      .filter(Boolean);

    const numberOfItems = (order.items || []).reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );

    // ========================================
    // SEND META PURCHASE EVENT
    // ========================================

    try {
      // Store transaction ID to prevent duplicate events
      // when the customer refreshes the success page.

      localStorage.setItem(storageKey, "sent");

      window.fbq(
        "track",
        "Purchase",
        {
          value: purchaseValue,
          currency: "INR",
          content_type: "product",
          content_ids: contentIds,
          num_items: numberOfItems,
        },
        {
          eventID: transactionId,
        },
      );

      console.log("META PURCHASE EVENT SENT:", {
        pixelId: META_PIXEL_ID,
        transactionId,
        value: purchaseValue,
        currency: "INR",
        contentIds,
        numberOfItems,
      });
    } catch (error) {
      // Allow another attempt if the tracking call throws.
      try {
        localStorage.removeItem(storageKey);
      } catch (storageError) {
        console.warn("Could not reset tracking record:", storageError);
      }

      console.error("Meta Purchase tracking error:", error);
    }
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
              Please keep <strong>{order && formatPrice(order.amount)}</strong>{" "}
              ready to pay in cash when your order arrives.
            </>
          ) : (
            "Your payment was successful. We're getting your plants ready to ship."
          )}
        </p>

        {/* ==================================
            ORDER RECEIPT
        ================================== */}

        {loading && (
          <p className="result__text">Loading your order details...</p>
        )}

        {order && (
          <div className="receipt">
            {/* ORDER HEADER */}

            <div className="receipt__head">
              <div>
                <span className="receipt__label">Order</span>

                <strong className="receipt__id">
                  #{String(order._id).slice(-6).toUpperCase()}
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
              {order.items?.map((item, i) => (
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

        {/* ==================================
            ACTION BUTTONS
        ================================== */}

        <div className="result__actions">
          <Link to="/products" className="rbtn rbtn--primary">
            Continue shopping
          </Link>

          <Link to="/" className="rbtn rbtn--ghost">
            Back to home
          </Link>

          {order ? (
            <Link
              to={`/track?order=${String(order._id).slice(-6).toUpperCase()}`}
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
