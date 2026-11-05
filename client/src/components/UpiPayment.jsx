import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { API, formatPrice } from "../cart";

// Shows a QR of the fixed-amount Razorpay payment link + a "Pay with Razorpay" button,
// and waits for the payment.
export default function UpiPayment({ order, onCancel }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  // Ask the server every 4 seconds whether the payment came through
  useEffect(() => {
    let stopped = false;
    const check = async () => {
      try {
        const res = await fetch(`${API}/orders/${order.orderId}/status`);
        const data = await res.json();
        if (!stopped && data.status === "paid") navigate(`/order-success?order=${order.orderId}`);
      } catch {
        /* try again next tick */
      }
    };
    const id = setInterval(check, 4000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [order.orderId, navigate]);

  const checkNow = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API}/orders/${order.orderId}/status`);
      const data = await res.json();
      if (data.status === "paid") navigate(`/order-success?order=${order.orderId}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="co upi">
      <h2>Pay {formatPrice(order.amount)}</h2>

      <p className="upi__hint">Scan with your phone camera to open the payment page, then pay with any UPI app.</p>

      <div className="upi__qrbox">
        <QRCodeSVG value={order.paymentUrl} size={240} level="M" marginSize={2} />
        <span className="upi__amount">{formatPrice(order.amount)}</span>
      </div>

      <div className="upi__or"><span>or</span></div>

      <a className="co-submit upi__btn" href={order.paymentUrl}>
        Pay {formatPrice(order.amount)} with Razorpay
      </a>

      <p className="upi__status">
        <span className="upi__dot" /> Waiting for payment… this page updates automatically.
      </p>

      <div className="upi__links">
        <button type="button" onClick={checkNow} disabled={checking}>
          {checking ? "Checking…" : "I've paid — check now"}
        </button>
        <button type="button" onClick={onCancel}>← Change details</button>
      </div>
    </div>
  );
}