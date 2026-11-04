import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, formatPrice } from "../cart";

// Shows the fixed-amount UPI QR + "Pay with Razorpay" link, and waits for the payment.
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
      <h2>Pay {formatPrice(order.amount)} with UPI</h2>

      {order.qrImage ? (
        <>
          <p className="upi__hint">Scan with any UPI app — GPay, PhonePe, Paytm, BHIM.</p>
          <img className="upi__qr" src={order.qrImage} alt={`UPI QR code for ${formatPrice(order.amount)}`} />
          <div className="upi__or"><span>or</span></div>
        </>
      ) : (
        <p className="upi__hint">Tap the button below to pay securely with Razorpay.</p>
      )}

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