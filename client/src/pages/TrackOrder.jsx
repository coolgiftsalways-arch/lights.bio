import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, PackageCheck, Truck, Home, Search, MapPin, ExternalLink, XCircle, Smartphone, Banknote } from "lucide-react";
import { API, formatPrice, imageUrl } from "../cart";
import { deliveryWindow } from "../pricing";
import "../Style/OrderResult.css";
import "../Style/TrackOrder.css";

const STEPS = [
  { label: "Confirmed", icon: Check },
  { label: "Packed", icon: PackageCheck },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: Home },
];
const STEP_INDEX = { paid: 0, confirmed: 0, shipped: 2, delivered: 3 };

const HEADLINE = {
  paid: "We've got your order",
  confirmed: "We've got your order",
  shipped: "Your glow is on its way",
  delivered: "Delivered — enjoy the glow!",
  cancelled: "This order was cancelled",
};

export default function TrackOrder() {
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState({ order: params.get("order") || "", phone: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [order]);

  const update = (e) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "").slice(0, 10);
    if (name === "order") value = value.replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, 24);
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.order.length < 6) return setError("Enter the 6-character order number from your confirmation, like E05E1D.");
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError("Enter the 10-digit mobile number you used at checkout.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
      setOrder(data);
      setParams({ order: form.order }, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- lookup form ----------
  if (!order) {
    return (
      <section className="result track">
        <div className="result__glow" />
        <div className="result__inner">
          <div className="result__badge"><Search size={36} strokeWidth={2.4} /></div>
          <p className="result__eyebrow">Order tracking</p>
          <h1 className="result__title">Track your <em>order</em></h1>
          <p className="result__text">Enter your order number and the mobile number you used at checkout.</p>

          <form className="track__form" onSubmit={submit} noValidate>
            <label className="track__field">
              <span>Order number</span>
              <div className="track__prefix">
                <b>#</b>
                <input
                  name="order"
                  value={form.order}
                  onChange={update}
                  placeholder="E05E1D"
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </label>
            <label className="track__field">
              <span>Mobile number</span>
              <div className="track__prefix">
                <b>+91</b>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={update}
                  placeholder="10-digit number"
                />
              </div>
            </label>
            {error && <p className="track__error">{error}</p>}
            <button className="rbtn rbtn--primary track__submit" disabled={loading}>
              {loading ? "Finding your order…" : "Track order"}
            </button>
            <p className="track__hint">Your order number is on the confirmation page, e.g. <b>#E05E1D</b>.</p>
          </form>
        </div>
      </section>
    );
  }

  // ---------- result ----------
  const cancelled = order.status === "cancelled";
  const isCod = order.paymentMethod === "cod";
  const step = Math.max(STEP_INDEX[order.status] ?? 0, order.shipping?.awb ? 1 : 0);
  const code = order._id.slice(-6).toUpperCase();
  const placed = new Date(order.placedAt || order.createdAt);

  return (
    <section className={`result track ${cancelled ? "result--failed" : ""}`}>
      <div className="result__glow" />
      <div className="result__inner">
        <p className="result__eyebrow">Order #{code}</p>
        <h1 className="result__title">
          Hi {order.firstName}, <em>{HEADLINE[order.status] || "here's your order"}</em>
        </h1>
        {!cancelled && order.status !== "delivered" && order.delivery?.minDays && (
          <p className="result__text">
            Estimated delivery: <strong>{order.shipping?.etd || deliveryWindow(order.delivery, placed)}</strong>
          </p>
        )}

        <div className="receipt">
          {!cancelled && (
            <ol className="tracker track__tracker">
              {STEPS.map(({ label, icon: Icon }, i) => (
                <li key={label} className={i <= step ? "tracker__step tracker__step--done" : "tracker__step"}>
                  <span className="tracker__dot"><Icon size={16} /></span>
                  <span className="tracker__label">{label}</span>
                </li>
              ))}
            </ol>
          )}
          {cancelled && (
            <p className="track__cancelled"><XCircle size={18} /> If you paid online, your refund is processed to the original payment method.</p>
          )}

          {order.shipping ? (
            <div className="track__ship">
              <div className="track__ship-head">
                <span className="track__ship-icon"><Truck size={18} /></span>
                <div>
                  <strong>{order.shipping.courier || "Courier"}</strong>
                  <span className="mono">AWB {order.shipping.awb}</span>
                </div>
                {order.shipping.status && <span className="receipt__shipstatus">{order.shipping.status}</span>}
              </div>

              {order.shipping.events?.length > 0 && (
                <ol className="track__events">
                  {order.shipping.events.map((e, i) => (
                    <li key={i}>
                      <strong>{e.status}</strong>
                      <span>{[e.location, e.date].filter(Boolean).join(" · ")}</span>
                    </li>
                  ))}
                </ol>
              )}

              {order.shipping.trackUrl && (
                <a className="rbtn rbtn--ghost track__courier" href={order.shipping.trackUrl} target="_blank" rel="noreferrer">
                  Live tracking on courier site <ExternalLink size={15} />
                </a>
              )}
            </div>
          ) : (
            !cancelled && (
              <p className="track__waiting">
                <PackageCheck size={18} /> We're packing your plants. Tracking details appear here once the courier picks it up.
              </p>
            )
          )}

          <div className="track__meta">
            <p><MapPin size={15} /> {order.shipTo}</p>
            <p>
              {isCod ? <Banknote size={15} /> : <Smartphone size={15} />}
              {isCod ? `Cash on delivery · pay ${formatPrice(order.amount)}` : `Paid via UPI · ${formatPrice(order.amount)}`}
            </p>
          </div>

          <ul className="receipt__items">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.image ? <img src={imageUrl(item.image)} alt="" /> : <span className="receipt__noimg" />}
                <span className="receipt__name">
                  {item.name}
                  <small>Qty {item.quantity}</small>
                </span>
                <span className="receipt__price">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="result__actions">
          <button className="rbtn rbtn--ghost" onClick={() => { setOrder(null); setForm({ order: "", phone: "" }); setParams({}); }}>
            Track another order
          </button>
          <Link to="/products" className="rbtn rbtn--primary">Continue shopping</Link>
        </div>
      </div>
    </section>
  );
}