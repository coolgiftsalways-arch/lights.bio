import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, PackageCheck, Truck, Home, Search, MapPin, ExternalLink, XCircle, Smartphone, Banknote, CalendarDays, Leaf, MessageCircle, ShieldCheck } from "lucide-react";
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
      <section className="result track track--lookup">
        <div className="result__glow" />
        <div className="track-look">
          {/* left: intro */}
          <div className="track-look__intro">
            <span className="track-look__badge"><Search size={26} strokeWidth={2.4} /></span>
            <p className="result__eyebrow">Order tracking</p>
            <h1 className="result__title track-look__title">Track your <em>order</em></h1>
            <p className="track-look__text">
              Enter your order number and the mobile number you used at checkout to see where your plants are.
            </p>

            <ol className="track-look__steps">
              <li><span><Check size={16} /></span><div><strong>Confirmed</strong><small>We've received your order</small></div></li>
              <li><span><PackageCheck size={16} /></span><div><strong>Packed with care</strong><small>Plants prepared for travel</small></div></li>
              <li><span><Truck size={16} /></span><div><strong>On its way</strong><small>Live courier tracking</small></div></li>
            </ol>
          </div>

          {/* right: form */}
          <form className="track__form track-look__form" onSubmit={submit} noValidate>
            <div className="track-look__form-head">
              <strong>Find your order</strong>
              <small>Takes less than 10 seconds</small>
            </div>

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
            <p className="track__hint">
              Your order number is in your confirmation email and on the order page, e.g. <b>#E05E1D</b>.
            </p>
            <a className="track__help track-look__help" href="https://wa.me/919324556356?text=Hi%2C%20I%20need%20help%20tracking%20my%20order" target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Can't find it? Chat on WhatsApp
            </a>
          </form>

          {/* trust strip */}
          <ul className="track-look__trust">
            <li><span><Truck size={18} /></span><div><strong>Live courier tracking</strong><small>Updates from pickup to your door</small></div></li>
            <li><span><Leaf size={18} /></span><div><strong>Plant-safe packaging</strong><small>Packed to travel without stress</small></div></li>
            <li><span><ShieldCheck size={18} /></span><div><strong>Secure lookup</strong><small>Order number + mobile only</small></div></li>
          </ul>
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
        <p className="track__chip">Order <b>#{code}</b></p>
        <h1 className="result__title track__title">
          <span className="track__hi">Hi {order.firstName},</span>
          <em>{HEADLINE[order.status] || "here's your order"}</em>
        </h1>
        {!cancelled && order.status !== "delivered" && order.delivery?.minDays && (
          <div className="track__eta">
            <CalendarDays size={18} />
            <span>
              <small>Estimated delivery</small>
              <strong>{order.shipping?.etd || deliveryWindow(order.delivery, placed)}</strong>
            </span>
          </div>
        )}

        <div className="receipt track__card">
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
            <div className="track__row">
              <span className="track__row-icon"><MapPin size={16} /></span>
              <span><small>Delivering to</small>{order.shipTo}</span>
            </div>
            <div className="track__row">
              <span className="track__row-icon">{isCod ? <Banknote size={16} /> : <Smartphone size={16} />}</span>
              <span>
                <small>Payment</small>
                {isCod ? `Cash on delivery · pay ${formatPrice(order.amount)} on arrival` : `Paid via UPI · ${formatPrice(order.amount)}`}
              </span>
            </div>
          </div>

          <ul className="receipt__items">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.image ? <img src={imageUrl(item.image)} alt="" /> : <span className="receipt__noimg track__noimg"><Leaf size={20} /></span>}
                <span className="receipt__name">
                  {item.name}
                  <small>Qty {item.quantity}</small>
                </span>
                <span className="receipt__price">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="track__total">
            <span>{isCod ? "To pay on delivery" : "Total paid"}</span>
            <strong>{formatPrice(order.amount)}</strong>
          </div>
        </div>

        <div className="result__actions track__actions">
          <Link to="/products" className="rbtn rbtn--primary">Continue shopping</Link>
          <button className="rbtn rbtn--ghost" onClick={() => { setOrder(null); setForm({ order: "", phone: "" }); setParams({}); }}>
            Track another order
          </button>
        </div>
        <a className="track__help" href={`https://wa.me/919324556356?text=${encodeURIComponent(`Hi, I need help with order #${code}`)}`} target="_blank" rel="noreferrer">
          <MessageCircle size={15} /> Need help with this order? Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}