import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, formatPrice, imageUrl, API } from "../cart";
import "../Style/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [added, setAdded] = useState(null); // id of product just added (for button feedback)
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(product._id);
    setTimeout(() => setAdded((id) => (id === product._id ? null : id)), 1500);
  };

  // Buy Now skips the cart: go straight to checkout with just this product
  const handleBuyNow = (p) => {
    navigate("/checkout", {
      state: { items: [{ productId: p._id, name: p.name, price: p.price, image: p.images[0], quantity: 1 }] },
    });
  };

  return (
    <section className="shop">
      <h1 className="shop__title">Our Products</h1>

      {status === "loading" && <p className="shop__state">Loading products…</p>}
      {status === "error" && <p className="shop__state">Couldn't load products. Is the server running?</p>}
      {status === "ready" && products.length === 0 && <p className="shop__state">No products yet.</p>}

      <div className="shop__grid">
        {products.map((p) => {
          const soldOut = p.stock <= 0;
          return (
            <article key={p._id} className="pcard">
              <div className="pcard__media">
                <img className="pcard__img" src={imageUrl(p.images[0])} alt={p.name} loading="lazy" />
                {p.images[1] && (
                  <img className="pcard__img pcard__img--hover" src={imageUrl(p.images[1])} alt="" loading="lazy" />
                )}
                {p.badge && <span className="pcard__badge">{p.badge}</span>}
                {soldOut && <span className="pcard__soldout">Sold Out</span>}
              </div>

              <div className="pcard__body">
                <h2 className="pcard__name">{p.name}</h2>
                <p className="pcard__price">{formatPrice(p.price)}</p>

                <div className="pcard__actions">
                  <button className="sbtn sbtn--outline" disabled={soldOut} onClick={() => handleAdd(p)}>
                    {added === p._id ? "Added ✓" : "Add to Cart"}
                  </button>
                  <button className="sbtn sbtn--dark" disabled={soldOut} onClick={() => handleBuyNow(p)}>
                    Buy Now
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}