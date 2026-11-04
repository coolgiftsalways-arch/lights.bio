import { Link, Navigate, useLocation } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import { getCart, cartTotal, formatPrice, imageUrl } from "../cart";
import "../Style/Products.css";
import "../Style/Cart.css";

export default function Checkout() {
  const { state } = useLocation();
  // "Buy Now" passes its single item in the navigation state; otherwise use the cart
  const items = state?.items ?? getCart();

  if (items.length === 0) return <Navigate to="/cart" replace />;

  return (
    <section className="cartpage">
      <div className="cartpage__inner">
        <h1 className="cartpage__title">Checkout</h1>

        <div className="cartpage__layout cartpage__layout--checkout">
          <CheckoutForm items={items} />

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
            <div className="summary__row summary__row--total">
              <span>Total</span>
              <span>{formatPrice(cartTotal(items))}</span>
            </div>
            <Link to={state?.items ? "/products" : "/cart"} className="summary__link">
              ← {state?.items ? "Back to products" : "Back to cart"}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}