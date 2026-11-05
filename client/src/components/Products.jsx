import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import { addToCart, formatPrice, imageUrl, API } from "../cart";
import "../Style/Products.css";

/* =========================================
   BOTANICAL SVG COMPONENTS
========================================= */

function BotanicalRight() {
  return (
    <svg
      className="botanical botanical--right"
      viewBox="0 0 420 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="botanical-stem"
        d="M210 610 C190 490 260 390 220 290 C185 200 220 110 280 20"
      />
      <path className="botanical-stem" d="M210 480 C140 420 90 350 45 270" />
      <path className="botanical-stem" d="M225 370 C300 320 340 260 375 180" />
      <path className="botanical-stem" d="M210 270 C140 230 105 160 95 90" />

      <g className="botanical-leaf">
        <path d="M200 470 C125 470 80 420 65 350 C135 355 190 395 200 470Z" />
        <path d="M200 470 L65 350" />
      </g>
      <g className="botanical-leaf">
        <path d="M230 410 C295 410 340 365 350 300 C285 305 240 350 230 410Z" />
        <path d="M230 410 L350 300" />
      </g>
      <g className="botanical-leaf">
        <path d="M195 285 C125 275 85 225 80 160 C145 175 185 220 195 285Z" />
        <path d="M195 285 L80 160" />
      </g>
      <g className="botanical-leaf">
        <path d="M250 220 C310 205 350 155 350 95 C290 115 255 160 250 220Z" />
        <path d="M250 220 L350 95" />
      </g>
      <g className="botanical-leaf">
        <path d="M215 145 C160 125 135 80 145 30 C195 55 220 95 215 145Z" />
        <path d="M215 145 L145 30" />
      </g>

      <circle className="botanical-orbit" cx="45" cy="270" r="5" />
      <circle className="botanical-orbit" cx="375" cy="180" r="5" />
      <circle className="botanical-orbit" cx="95" cy="90" r="4" />
    </svg>
  );
}

function BotanicalLeft() {
  return (
    <svg
      className="botanical botanical--left"
      viewBox="0 0 420 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="botanical-stem"
        d="M210 610 C230 500 170 400 205 300 C240 200 180 100 120 20"
      />
      <path className="botanical-stem" d="M205 450 C285 400 325 330 370 250" />
      <path className="botanical-stem" d="M195 350 C120 300 75 235 45 155" />
      <path className="botanical-stem" d="M200 230 C270 190 300 130 305 70" />

      <g className="botanical-leaf">
        <path d="M205 455 C280 455 325 410 350 345 C280 350 220 390 205 455Z" />
        <path d="M205 455 L350 345" />
      </g>
      <g className="botanical-leaf">
        <path d="M195 355 C125 350 80 305 65 240 C130 250 180 295 195 355Z" />
        <path d="M195 355 L65 240" />
      </g>
      <g className="botanical-leaf">
        <path d="M215 245 C280 235 320 190 320 130 C260 145 220 190 215 245Z" />
        <path d="M215 245 L320 130" />
      </g>
      <g className="botanical-leaf">
        <path d="M175 175 C115 155 90 110 100 55 C150 80 175 125 175 175Z" />
        <path d="M175 175 L100 55" />
      </g>

      <circle className="botanical-orbit" cx="370" cy="250" r="5" />
      <circle className="botanical-orbit" cx="45" cy="155" r="5" />
    </svg>
  );
}

function BotanicalMiddle() {
  return (
    <svg
      className="botanical botanical--middle"
      viewBox="0 0 420 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="botanical-stem"
        d="M210 610 C190 500 250 400 210 300 C175 210 220 100 280 20"
      />
      <path className="botanical-stem" d="M210 440 C130 390 90 320 60 250" />
      <path className="botanical-stem" d="M220 340 C300 300 340 230 360 160" />

      <g className="botanical-leaf">
        <path d="M210 445 C135 435 90 390 75 325 C145 335 195 380 210 445Z" />
        <path d="M210 445 L75 325" />
      </g>
      <g className="botanical-leaf">
        <path d="M220 350 C290 340 330 295 340 230 C275 245 235 295 220 350Z" />
        <path d="M220 350 L340 230" />
      </g>
      <g className="botanical-leaf">
        <path d="M205 235 C140 220 110 175 115 115 C170 140 200 185 205 235Z" />
        <path d="M205 235 L115 115" />
      </g>
    </svg>
  );
}

/* =========================================
   PRODUCTS PAGE
========================================= */

export default function Products() {
  const navigate = useNavigate();
  const shopRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* FETCH PRODUCTS */

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/products`);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (mounted) {
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* GSAP BOTANICAL + FALLING LEAF ANIMATIONS */

  useEffect(() => {
    if (!shopRef.current) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      /* Draw botanical stems */

      gsap.fromTo(
        ".botanical-stem",
        {
          opacity: 0,
          strokeDasharray: 1200,
          strokeDashoffset: 1200,
        },
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 2.5,
          stagger: 0.2,
          ease: "power2.out",
        },
      );

      /* Grow botanical leaves */

      gsap.fromTo(
        ".botanical-leaf",
        {
          opacity: 0,
          scale: 0.65,
          rotate: -15,
          transformOrigin: "center center",
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.5,
          stagger: 0.12,
          delay: 0.5,
          ease: "power3.out",
        },
      );

      /* Floating background plants */

      gsap.to(".botanical--right", {
        y: -20,
        rotate: 3,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".botanical--left", {
        y: 18,
        rotate: -5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".botanical--middle", {
        y: -15,
        rotate: 40,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* Pulsing botanical dots */

      gsap.to(".botanical-orbit", {
        opacity: 0.35,
        scale: 1.5,
        transformOrigin: "center center",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
      });

      /* FALLING LEAVES */

      const fallingLeaves = gsap.utils.toArray(".falling-leaf");

      fallingLeaves.forEach((leaf, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const duration = 10 + (i % 5) * 2;

        gsap.fromTo(
          leaf,
          {
            y: -100 - (i % 3) * 90,
            x: 0,
            rotation: direction * 25,
            opacity: 0,
          },
          {
            y: window.innerHeight + 150,
            x: direction * (70 + (i % 4) * 35),
            rotation: direction * (300 + (i % 3) * 100),
            opacity: 0.78,
            duration,
            delay: i * 0.65,
            repeat: -1,
            ease: "none",
          },
        );
      });

      /* Page heading entrance */

      gsap.from(".shop__eyebrow, .shop__title, .shop__subtitle", {
        y: 35,
        opacity: 0,
        duration: 1,
        stagger: 0.16,
        ease: "power3.out",
      });

      /* Product cards entrance */

      gsap.from(".pcard", {
        y: 65,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.13,
        delay: 0.3,
        ease: "power3.out",
      });
    }, shopRef);

    return () => ctx.revert();
  }, [loading, products.length]);

  /* ADD TO CART */

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  /* BUY NOW */

  const handleBuyNow = (product) => {
    navigate("/checkout", {
      state: {
        items: [{ ...product, quantity: 1 }],
      },
    });
  };

  /* PRODUCT IMAGE */

  const getProductImage = (image) => {
    if (!image) return "";
    return imageUrl(image);
  };

  /* SOLD OUT CHECK */

  const isSoldOut = (product) => {
    return (
      product.stock === 0 ||
      product.available === false ||
      product.isAvailable === false
    );
  };

  /* OPEN PRODUCT DETAILS */

  const openProductDetails = (product) => {
    const productId = product._id || product.id;

    if (!productId) {
      console.error("Product ID is missing:", product);
      return;
    }

    navigate(`/product/${productId}`, {
      state: { product },
    });
  };

  /* RENDER */

  return (
    <section className="shop" ref={shopRef}>
      {/* BOTANICAL BACKGROUND */}

      <div className="shop__art" aria-hidden="true">
        <BotanicalRight />
        <BotanicalLeft />
        <BotanicalMiddle />

        <div className="shop__art-circle shop__art-circle--one" />
        <div className="shop__art-circle shop__art-circle--two" />

        {/* FALLING LEAVES */}

        <div className="shop__falling-leaves">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              className={`falling-leaf falling-leaf--${(i % 4) + 1}`}
              key={i}
              style={{ left: `${(i * 17 + 5) % 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* PAGE CONTENT */}

      <div className="shop__content">
        <div className="shop__eyebrow">
          <span />
          BRING NATURE HOME
          <span />
        </div>

        <h1 className="shop__title">Our Collection</h1>

        <p className="shop__subtitle">
          Discover beautiful plants that bring life, freshness and natural
          beauty into your space.
        </p>

        {/* LOADING */}

        {loading && <div className="shop__state">Loading our plants...</div>}

        {/* ERROR */}

        {!loading && error && <div className="shop__state">{error}</div>}

        {/* EMPTY PRODUCTS */}

        {!loading && !error && products.length === 0 && (
          <div className="shop__state">No products available right now.</div>
        )}

        {/* PRODUCT GRID */}

        {!loading && !error && products.length > 0 && (
          <div className="shop__grid">
            {products.map((product) => {
              const firstImage = getProductImage(product.images?.[0]);
              const secondImage = getProductImage(product.images?.[1]);
              const soldOut = isSoldOut(product);

              return (
                <article
                  className="pcard"
                  key={product._id || product.id}
                  onClick={() => openProductDetails(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProductDetails(product);
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  aria-label={`View details for ${product.name}`}
                >
                  <div className="pcard__media">
                    {firstImage && (
                      <img
                        className="pcard__img"
                        src={firstImage}
                        alt={product.name || "Plant"}
                        loading="lazy"
                      />
                    )}

                    {secondImage && (
                      <img
                        className="pcard__img pcard__img--hover"
                        src={secondImage}
                        alt={`${product.name || "Plant"} alternate view`}
                        loading="lazy"
                      />
                    )}

                    {product.badge && (
                      <span className="pcard__badge">{product.badge}</span>
                    )}

                    {soldOut && (
                      <span className="pcard__soldout">Sold Out</span>
                    )}

                    <span className="pcard__view">VIEW PLANT ↗</span>
                  </div>

                  <div className="pcard__body">
                    <h2 className="pcard__name">{product.name}</h2>

                    <p className="pcard__price">{formatPrice(product.price)}</p>

                    <div className="pcard__actions">
                      <button
                        type="button"
                        className="sbtn sbtn--outline"
                        disabled={soldOut}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        className="sbtn sbtn--dark"
                        disabled={soldOut}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleBuyNow(product);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
