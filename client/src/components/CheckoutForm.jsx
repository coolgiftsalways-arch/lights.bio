import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Banknote, Plus, MapPin } from "lucide-react";
import { API, cartTotal, formatPrice } from "../cart";
import { priceOrder, deliveryDays, UPI_DISCOUNT_PERCENT } from "../pricing";
import UpiPayment from "./UpiPayment";
import "../Style/CheckoutForm.css";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const EMPTY = {
  name: "", email: "", phone: "",
  line1: "", line2: "", landmark: "", city: "", state: "", pincode: "",
};

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Please enter a valid email.";
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Please enter a valid 10-digit mobile number.";
  if (!f.line1.trim()) e.line1 = "Please enter your address.";
  if (!f.city.trim()) e.city = "Please enter your city.";
  if (!f.state) e.state = "Please select your state.";
  if (!/^[1-9]\d{5}$/.test(f.pincode.trim())) e.pincode = "Please enter a valid 6-digit pincode.";
  return e;
}

// items: [{ productId, quantity }]
// payment / onPaymentChange come from the Checkout page so its summary can show the right price
export default function CheckoutForm({ items, payment: paymentProp, onPaymentChange }) {
  const [form, setForm] = useState(EMPTY);
  const [ownPayment, setOwnPayment] = useState("upi"); // used if the parent doesn't control it
  const payment = paymentProp ?? ownPayment;
  const setPayment = onPaymentChange ?? setOwnPayment;
  const subtotal = cartTotal(items || []);
  const upiPrice = priceOrder(subtotal, "upi");
  const codPrice = priceOrder(subtotal, "cod");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [upiOrder, setUpiOrder] = useState(null); // set after a UPI order is created
  const navigate = useNavigate();
  const [showExtra, setShowExtra] = useState(false); // "Area / landmark" are optional, hidden until asked
  const [pinInfo, setPinInfo] = useState(""); // "Pune, Maharashtra" under the pincode box
  const autoFilled = useRef({ city: "", state: "" });

  // Typing a 6-digit pincode fills in city + state (user can still edit them)
  const lookupPincode = async (pin) => {
    setPinInfo("");
    try {
      const res = await fetch(`${API}/pincode/${pin}`);
      if (!res.ok) return;
      const { city, state } = await res.json();
      const norm = (s) => String(s).toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
      const matchedState = STATES.find((s) => norm(s) === norm(state)) || "";
      setForm((f) => {
        // only overwrite fields that are empty or that we filled in last time
        const next = { ...f };
        if (!f.city || f.city === autoFilled.current.city) next.city = city;
        if (matchedState && (!f.state || f.state === autoFilled.current.state)) next.state = matchedState;
        autoFilled.current = { city: next.city, state: next.state };
        return next;
      });
      setErrors((err) => ({ ...err, city: undefined, state: undefined }));
      setPinInfo(`${city}, ${state}`);
    } catch {
      /* no autofill — customer types city/state */
    }
  };

  const update = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "pincode") value = value.replace(/\D/g, "").slice(0, 6); // digits only
    if (name === "phone") {
      value = value.replace(/\D/g, ""); // "+91 93245-56356" -> "919324556356"
      if (value.length > 10 && /^(91|0)/.test(value)) value = value.replace(/^(91|0)/, "");
      value = value.slice(0, 10);
    }
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
    if (name === "pincode") {
      if (/^[1-9]\d{5}$/.test(value)) lookupPincode(value);
      else setPinInfo("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      // take the customer straight to the first problem
      const first = document.querySelector(`.co [name="${Object.keys(found)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus({ preventScroll: true });
      return;
    }
    if (!items?.length) return setServerError("Your cart is empty.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ productId, quantity }) => ({ productId, quantity })),
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: {
            line1: form.line1, line2: form.line2, landmark: form.landmark,
            city: form.city, state: form.state, pincode: form.pincode,
          },
          paymentMethod: payment,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");

      if (data.paymentMethod === "cod") {
        navigate(`/order-success?order=${data.orderId}`);
      } else {
        setUpiOrder(data); // show QR + Pay with Razorpay
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 for UPI: QR code + payment link
  if (upiOrder) return <UpiPayment order={upiOrder} onCancel={() => setUpiOrder(null)} />;

  const field = (name, label, props = {}) => (
    <label className={`co-field ${errors[name] ? "co-field--error" : ""}`}>
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={update} {...props} />
      {errors[name] && <small>{errors[name]}</small>}
    </label>
  );

  return (
    <form className="co" onSubmit={submit} noValidate>
      <h2>Contact details</h2>
      {field("name", "Full name *", { autoComplete: "name", autoCapitalize: "words", enterKeyHint: "next" })}
      <div className="co-row">
        {field("phone", "Mobile number *", { type: "tel", inputMode: "numeric", autoComplete: "tel-national", placeholder: "10-digit number", enterKeyHint: "next" })}
        {field("email", "Email *", { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "off", enterKeyHint: "next" })}
      </div>

      <h2>Shipping address</h2>
      <div className="co-pin">
        {field("pincode", "Pincode *", { inputMode: "numeric", autoComplete: "postal-code", placeholder: "6 digits", enterKeyHint: "next" })}
        {pinInfo && (
          <p className="co-pin__found"><MapPin size={14} /> {pinInfo}</p>
        )}
      </div>
      {field("line1", "House no., building, street *", { autoComplete: "address-line1", enterKeyHint: "next" })}
      {showExtra || form.line2 || form.landmark ? (
        <div className="co-row">
          {field("line2", "Area, locality", { autoComplete: "address-line2" })}
          {field("landmark", "Landmark")}
        </div>
      ) : (
        <button type="button" className="co-more" onClick={() => setShowExtra(true)}>
          <Plus size={15} /> Add area or landmark (optional)
        </button>
      )}
      <div className="co-row">
        {field("city", "City *", { autoComplete: "address-level2", autoCapitalize: "words" })}

        <label className={`co-field ${errors.state ? "co-field--error" : ""}`}>
          <span>State *</span>
          <select name="state" value={form.state} onChange={update} autoComplete="address-level1">
            <option value="">Select state</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.state && <small>{errors.state}</small>}
        </label>
      </div>

      <h2>Payment method</h2>
      <div className="co-pay">
        <label className={`co-pay__option ${payment === "upi" ? "co-pay__option--active" : ""}`}>
          <input type="radio" name="payment" value="upi" checked={payment === "upi"} onChange={() => setPayment("upi")} />
          <Smartphone size={22} />
          <span>
            <strong>
              UPI {upiPrice.discount > 0 && <em className="co-pay__save">Save {UPI_DISCOUNT_PERCENT}%</em>}
            </strong>
            <small>
              {upiPrice.discount > 0 ? <><s>{formatPrice(subtotal)}</s> {formatPrice(upiPrice.total)}</> : formatPrice(upiPrice.total)}
              {" · "}Faster delivery: {deliveryDays("upi")}
            </small>
          </span>
        </label>
        <label className={`co-pay__option ${payment === "cod" ? "co-pay__option--active" : ""}`}>
          <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} />
          <Banknote size={22} />
          <span>
            <strong>Cash on Delivery</strong>
            <small>
              {formatPrice(codPrice.total)} (full price) · Delivery: {deliveryDays("cod")}
            </small>
          </span>
        </label>
      </div>

      {serverError && <p className="co-server-error">{serverError}</p>}

      <div className="co-paybar">
      <button className="co-submit" disabled={loading}>
        {loading
          ? "Please wait…"
          : payment === "cod"
            ? `Place order · ${formatPrice(codPrice.total)}`
            : `Pay ${formatPrice(upiPrice.total)} with UPI`}
      </button>
      </div>
    </form>
  );
}