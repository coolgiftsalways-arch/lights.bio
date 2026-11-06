import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import gsap from "gsap";

import {
  getCart,
  setQuantity,
  onCartChange,
  cartTotal,
  cartCount,
  formatPrice,
  imageUrl,
} from "../cart";

import "../Style/Products.css";
import "../Style/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState(getCart);
  const pageRef = useRef(null);

  useEffect(() => {
    return onCartChange(() => {
      setCart(getCart());
    });
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .from(".cartpage__eyebrow", {
          y: 20,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".cartpage__title",
          {
            y: 75,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.35",
        )
        .from(
          ".cartpage__subtitle",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.65",
        )
        .from(
          ".cartpage__list-heading",
          {
            opacity: 0,
            x: -20,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".citem",
          {
            y: 45,
            opacity: 0,
            stagger: 0.13,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.25",
        )
        .from(
          ".summary",
          {
            x: 50,
            opacity: 0,
            scale: 0.96,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.65",
        )
        .from(
          ".cartpage__note",
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.35",
        );

      // Subtle floating movement for the summary card
      if (
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches
      ) {
        gsap.to(".summary", {
          y: -5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, page);

    return () => ctx.revert();
  }, [cart.length]);

  if (cart.length === 0) {
    return (
      <section className="cartpage" ref={pageRef}>
        <div className="cartpage__empty">
          <div className="cartpage__empty-icon">
            <Leaf size={42} strokeWidth={1.2} />
          </div>

          <p className="cartpage__empty-label">A LITTLE MORE GREEN</p>

          <h1>Your cart is waiting for something beautiful.</h1>

          <p>Your next favourite plant is just around the corner.</p>

          <Link to="/products" className="sbtn">
            Explore collection
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  const total = cartTotal(cart);
  const count = cartCount(cart);

  return (
    <section className="cartpage" ref={pageRef}>
      <div className="cartpage__inner">
        <div className="cartpage__topline">
          <span className="cartpage__eyebrow">YOUR LITTLE GREEN WORLD</span>

          <span className="cartpage__count">
            {count} {count === 1 ? "ITEM" : "ITEMS"} IN YOUR BAG
          </span>
        </div>

        <div className="cartpage__heading">
          <h1 className="cartpage__title">
            Your <em>Cart.</em>
          </h1>

          <p className="cartpage__subtitle">
            Good things grow here. Take your time and find the perfect green
            addition to your space.
          </p>
        </div>

        <div className="cartpage__layout">
          {/* Cart products */}
          <div className="cartpage__products">
            <div className="cartpage__list-heading">
              <span>YOUR SELECTION</span>
              <span>{count} PRODUCTS</span>
            </div>

            <ul className="cartpage__list">
              {cart.map((item) => (
                <li key={item.productId} className="citem">
                  <div className="citem__image-wrap">
                    <img
                      className="citem__img"
                      src={imageUrl(item.image)}
                      alt={item.name}
                    />
                  </div>

                  <div className="citem__info">
                    <span className="citem__tag">BOTANICAL COLLECTION</span>

                    <h2 className="citem__name">{item.name}</h2>

                    <p className="citem__price">
                      {formatPrice(item.price)} / each
                    </p>

                    <div className="citem__controls">
                      <div className="qty">
                        <button
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          aria-label="Increase quantity"
                          disabled={item.quantity >= 10}
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="citem__remove"
                        onClick={() => setQuantity(item.productId, 0)}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="citem__right">
                    <span className="citem__total-label">Subtotal</span>

                    <p className="citem__total">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cartpage__note">
              <Leaf size={16} />
              Every plant deserves a beautiful new home.
            </div>
          </div>

          {/* Order summary */}
          <aside className="summary">
            <div className="summary__top">
              <p className="summary__eyebrow">THE FINAL DETAILS</p>

              <Leaf size={21} />
            </div>

            <h2>Order summary.</h2>

            <ul className="summary__items">
              {cart.map((item) => (
                <li key={item.productId}>
                  <img src={imageUrl(item.image)} alt={item.name} />

                  <div>
                    <div className="summary__item-name">{item.name}</div>

                    <div className="summary__item-qty">
                      Quantity: {item.quantity}
                    </div>
                  </div>

                  <span className="summary__items-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="summary__divider" />

            <div className="summary__row">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="summary__row">
              <span>Shipping</span>
              <strong>FREE</strong>
            </div>

            <div className="summary__shipping">
              <span />
              Your order qualifies for free shipping.
            </div>

            <div className="summary__divider" />

            <div className="summary__row summary__row--total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <Link to="/checkout" className="summary__btn">
              <span>Proceed to checkout</span>
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/products" className="summary__link">
              ← Continue exploring
            </Link>

            <div className="summary__divider" />

            <div className="summary__shipping">
              <ShieldCheck size={15} />
              Secure checkout experience
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
