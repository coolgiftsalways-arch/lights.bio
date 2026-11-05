import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Truck, BadgePercent, ShoppingBag, ChevronDown } from "lucide-react";
import CheckoutForm from "../components/CheckoutForm";
import { getCart, cartTotal, formatPrice, imageUrl } from "../cart";
import { priceOrder, deliveryDays, deliveryWindow, UPI_DISCOUNT_PERCENT } from "../pricing";
import "../Style/Products.css";
import "../Style/Cart.css";

export default function Checkout() {
  const { state } = useLocation();
  const [payment, setPayment] = useState("upi"); // "upi" | "cod"
  const [showSummary, setShowSummary] = useState(false); // phones: summary collapsed at the top

  // Accept both cart items ({ productId, image }) and full products from "Buy Now" ({ _id, images })
  const items = (state?.items ?? getCart()).map((i) => ({
    productId: i.productId || i._id || i.id,
    name: i.name,
    price: i.price,
    image: i.image || i.images?.[0] || "",
    quantity: Number(i.quantity) || 1,
  }));

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const price = priceOrder(cartTotal(items), payment);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <section className="cartpage">
      <div className="cartpage__inner">
        <h1 className="cartpage__title">Checkout</h1>

        <div className="cartpage__layout cartpage__layout--checkout">
          {/* Phones: compact summary bar at the top (tap to expand) */}
          <div className={`msum ${showSummary ? "msum--open" : ""}`}>
            <button type="button" className="msum__bar" onClick={() => setShowSummary(!showSummary)} aria-expanded={showSummary}>
              <ShoppingBag size={18} />
              <span className="msum__label">
                {showSummary ? "Hide" : "Show"} order · {count} item{count === 1 ? "" : "s"}
                <ChevronDown size={16} className="msum__chev" />
              </span>
              <span className="msum__total">
                {price.discount > 0 && <s>{formatPrice(price.subtotal)}</s>}
                <strong>{formatPrice(price.total)}</strong>
              </span>
            </button>
            {showSummary && (
              <div className="msum__body">
                <ul className="summary__items">
                  {items.map((i) => (
                    <li key={i.productId}>
                      <img src={imageUrl(i.image)} alt="" />
                      <span>{i.name} × {i.quantity}</span>
                      <strong>{formatPrice(i.price * i.quantity)}</strong>
                    </li>
                  ))}
                </ul>
                {price.discount > 0 && (
                  <div className="summary__row summary__row--discount">
                    <span><BadgePercent size={15} /> UPI discount ({UPI_DISCOUNT_PERCENT}%)</span>
                    <span>−{formatPrice(price.discount)}</span>
                  </div>
                )}
              </div>
            )}
            <p className="msum__delivery">
              <Truck size={14} /> Delivery in {deliveryDays(payment)} · arrives {deliveryWindow(price.delivery)}
            </p>
          </div>

          <CheckoutForm items={items} payment={payment} onPaymentChange={setPayment} />

          <aside className="summary">
            <h2>Your order</h2>
            <ul className="summary__items">
              {items.map((i) => (
                <li key={i.productId}>
                  <img src={imageUrl(i.image)} alt="" />
                  <span>{i.name} × {i.quantity}</span>
                  <strong>{formatPrice(i.price * i.quantity)}</strong>
                </li>
              ))}
            </ul>

            <div className="summary__row">
              <span>Subtotal</span>
              <span>{formatPrice(price.subtotal)}</span>
            </div>
            {price.discount > 0 && (
              <div className="summary__row summary__row--discount">
                <span><BadgePercent size={15} /> UPI discount ({UPI_DISCOUNT_PERCENT}%)</span>
                <span>−{formatPrice(price.discount)}</span>
              </div>
            )}
            <div className="summary__row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary__row summary__row--total">
              <span>Total</span>
              <span>{formatPrice(price.total)}</span>
            </div>

            <p className="summary__delivery">
              <Truck size={15} />
              <span>
                Delivery in <strong>{deliveryDays(payment)}</strong> · arrives {deliveryWindow(price.delivery)}
              </span>
            </p>
            {payment === "cod" && (
              <p className="summary__nudge">
                Pay by UPI to save {formatPrice(priceOrder(price.subtotal, "upi").discount)} and get it faster.
              </p>
            )}

            <Link to={state?.items ? "/products" : "/cart"} className="summary__link">
              ← {state?.items ? "Back to products" : "Back to cart"}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}