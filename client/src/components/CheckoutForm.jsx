import { useState } from "react";
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

// items: [{ productId, quantity }]. If not passed, reads the cart from localStorage ("cart").
export default function CheckoutForm({ items }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const cartItems = items ?? JSON.parse(localStorage.getItem("cart") || "[]");

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (!cartItems.length) {
      setServerError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(({ productId, quantity }) => ({ productId, quantity })),
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: {
            line1: form.line1, line2: form.line2, landmark: form.landmark,
            city: form.city, state: form.state, pincode: form.pincode,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");

      window.location.href = data.paymentUrl; // go to Razorpay's payment page
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

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
      {field("name", "Full name *", { autoComplete: "name" })}
      <div className="co-row">
        {field("email", "Email *", { type: "email", autoComplete: "email" })}
        {field("phone", "Mobile number *", { type: "tel", inputMode: "numeric", maxLength: 10, autoComplete: "tel-national", placeholder: "10-digit number" })}
      </div>

      <h2>Shipping address</h2>
      {field("line1", "House no., building, street *", { autoComplete: "address-line1" })}
      {field("line2", "Area, locality", { autoComplete: "address-line2" })}
      {field("landmark", "Landmark")}
      <div className="co-row">
        {field("city", "City *", { autoComplete: "address-level2" })}
        {field("pincode", "Pincode *", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
      </div>

      <label className={`co-field ${errors.state ? "co-field--error" : ""}`}>
        <span>State *</span>
        <select name="state" value={form.state} onChange={update} autoComplete="address-level1">
          <option value="">Select state</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        {errors.state && <small>{errors.state}</small>}
      </label>

      {serverError && <p className="co-server-error">{serverError}</p>}

      <button className="co-submit" disabled={loading}>
        {loading ? "Taking you to payment…" : "Continue to payment"}
      </button>
    </form>
  );
}