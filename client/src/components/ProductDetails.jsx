import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { addToCart, formatPrice, imageUrl, API } from "../cart";

import "../Style/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState("");

  /* =====================================
     FETCH SELECTED PRODUCT
  ===================================== */

  useEffect(() => {
    const existingProduct = location.state?.product;

    if (
      existingProduct &&
      String(existingProduct._id || existingProduct.id) === String(id)
    ) {
      setProduct(existingProduct);
      setLoading(false);
      setError("");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/products/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        const fetchedProduct = data.product || data;

        setProduct(fetchedProduct);
        setSelectedImage(0);
      } catch (err) {
        console.error("Product error:", err);
        setError("Unable to load this product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state]);

  /* =====================================
     FETCH ALL PRODUCTS FOR RECOMMENDATIONS
  ===================================== */

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${API}/products`);

        if (!response.ok) {
          throw new Error("Could not load products");
        }

        const data = await response.json();

        const products = Array.isArray(data) ? data : data.products || [];

        setAllProducts(products);
      } catch (err) {
        console.error("Related products error:", err);
      }
    };

    fetchAllProducts();
  }, []);

  /* =====================================
     RELATED PRODUCTS - MAXIMUM 4
  ===================================== */

  const relatedProducts = allProducts
    .filter(
      (item) =>
        String(item._id || item.id) !== String(product?._id || product?.id),
    )
    .slice(0, 4);

  /* =====================================
     PRODUCT IMAGES
  ===================================== */

  const images = (product?.images || [])
    .map((image) => imageUrl(image))
    .filter(Boolean)
    .slice(0, 5);

  const mainImage = images[selectedImage] || "";

  /* =====================================
     ADD TO CART
  ===================================== */

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
  };

  /* =====================================
     BUY NOW
  ===================================== */

  const handleBuyNow = () => {
    if (!product) return;

    navigate("/checkout", {
      state: {
        items: [
          {
            ...product,
            quantity: 1,
          },
        ],
      },
    });
  };

  /* =====================================
     OPEN RELATED PRODUCT
  ===================================== */

  const openRelatedProduct = (item) => {
    const productId = item._id || item.id;

    if (!productId) return;

    navigate(`/product/${productId}`, {
      state: {
        product: item,
      },
    });

    setSelectedImage(0);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <div className="product-details-state">
        <p>Growing your experience...</p>
      </div>
    );
  }

  /* =====================================
     ERROR
  ===================================== */

  if (error || !product) {
    return (
      <div className="product-details-state">
        <h2>{error || "Product not found"}</h2>

        <button onClick={() => navigate("/products")}>Back to products</button>
      </div>
    );
  }

  /* =====================================
     MAIN PAGE
  ===================================== */

  return (
    <div className="product-details-page">
      {/* PRODUCT DETAILS */}

      <section className="product-details">
        {/* LEFT - IMAGE GALLERY */}

        <div className="product-gallery">
          <div className="product-gallery__main">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="product-gallery__main-image"
              />
            ) : (
              <div className="product-gallery__placeholder">
                No image available
              </div>
            )}

            {product.badge && (
              <span className="product-gallery__badge">{product.badge}</span>
            )}
          </div>

          {/* THUMBNAILS */}

          {images.length > 1 && (
            <div className="product-gallery__thumbnails">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`product-gallery__thumb ${
                    selectedImage === index
                      ? "product-gallery__thumb--active"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}

          <p className="product-gallery__count">
            {images.length} / 5 PRODUCT IMAGES
          </p>
        </div>

        {/* RIGHT - PRODUCT INFORMATION */}

        <div className="product-info">
          <p className="product-info__eyebrow">THE BOTANICAL COLLECTION</p>

          <h1 className="product-info__title">
            {product.name}
            <span>.</span>
          </h1>

          <p className="product-info__price">{formatPrice(product.price)}</p>

          <div className="product-info__divider" />

          <p className="product-info__description">
            {product.description ||
              "Bring nature into your space with this beautiful botanical addition. Carefully selected to bring freshness, beauty and life to your surroundings."}
          </p>

          <div className="product-info__features">
            <div className="product-feature">
              <span>01</span>
              <p>Beautifully selected</p>
            </div>

            <div className="product-feature">
              <span>02</span>
              <p>Made for your space</p>
            </div>

            <div className="product-feature">
              <span>03</span>
              <p>Bring nature closer</p>
            </div>
          </div>

          <div className="product-info__actions">
            <button
              type="button"
              className="product-btn product-btn--outline"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>

            <button
              type="button"
              className="product-btn product-btn--dark"
              onClick={handleBuyNow}
            >
              Buy now
              <span>↗</span>
            </button>
          </div>

          <p className="product-info__note">
            A little more green. A little more life.
          </p>
        </div>
      </section>

      {/* RELATED PRODUCTS */}

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-products__heading">
            <div>
              <p>DISCOVER MORE</p>

              <h2>
                You may also like<span>.</span>
              </h2>

              <span>Find another favourite for your space.</span>
            </div>

            <button
              type="button"
              className="related-products__view-all"
              onClick={() => navigate("/products")}
            >
              View all plants ↗
            </button>
          </div>

          <div className="related-products__grid">
            {relatedProducts.map((item) => {
              const itemImage = imageUrl(item.images?.[0]);

              return (
                <article
                  className="related-card"
                  key={item._id || item.id}
                  onClick={() => openRelatedProduct(item)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openRelatedProduct(item);
                    }
                  }}
                >
                  <div className="related-card__image">
                    {itemImage ? (
                      <img src={itemImage} alt={item.name} loading="lazy" />
                    ) : (
                      <div className="related-card__placeholder">Plant</div>
                    )}

                    <span className="related-card__arrow">↗</span>
                  </div>

                  <div className="related-card__info">
                    <h3>{item.name}</h3>

                    <p>{formatPrice(item.price)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
