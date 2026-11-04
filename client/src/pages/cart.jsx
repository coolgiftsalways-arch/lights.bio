import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCart, setQuantity, onCartChange, cartTotal, cartCount, formatPrice, imageUrl } from "../cart";
import "../Style/Products.css";
import "../Style/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState(getCart);

  useEffect(() => onCartChange(() => setCart(getCart())), []);

  if (cart.length === 0) {
    return (
      <section className="cartpage">
        <div className="cartpage__empty">
          <h1>Your cart is empty</h1>
          <p>Find something that glows.</p>
          <Link to="/products" className="sbtn sbtn--dark">Shop products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cartpage">
      <div className="cartpage__inner">
        <h1 className="cartpage__title">Your Cart</h1>

        <div className="cartpage__layout">
          <ul className="cartpage__list">
            {cart.map((item) => (
              <li key={item.productId} className="citem">
                <img className="citem__img" src={imageUrl(item.image)} alt={item.name} />

                <div className="citem__info">
                  <h2 className="citem__name">{item.name}</h2>
                  <p className="citem__price">{formatPrice(item.price)}</p>

                  <div className="citem__controls">
                    <div className="qty">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        disabled={item.quantity >= 10}
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button className="citem__remove" onClick={() => setQuantity(item.productId, 0)}>
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>

                <p className="citem__total">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <aside className="summary">
            <h2>Order summary</h2>
            <div className="summary__row">
              <span>Items ({cartCount(cart)})</span>
              <span>{formatPrice(cartTotal(cart))}</span>
            </div>
            <div className="summary__row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary__row summary__row--total">
              <span>Total</span>
              <span>{formatPrice(cartTotal(cart))}</span>
            </div>
            <Link to="/checkout" className="sbtn sbtn--dark summary__btn">Checkout</Link>
            <Link to="/products" className="summary__link">← Continue shopping</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}