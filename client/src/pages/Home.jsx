import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Leaf,
  Quote,
} from "lucide-react";

import Hero from "../components/Hero";
import "../Style/Home.css";

const categories = [
  {
    name: "Indoor Plants",
    subtitle: "Bring nature into your home",
    slug: "indoor-plants",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900",
  },
  {
    name: "Outdoor Plants",
    subtitle: "Make your outdoors greener",
    slug: "outdoor-plants",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900",
  },
  {
    name: "Succulents",
    subtitle: "Small plants, big personality",
    slug: "succulents",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=900",
  },
  {
    name: "Flowering Plants",
    subtitle: "A little colour every day",
    slug: "flowering-plants",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900",
  },
  {
    name: "Air Purifying",
    subtitle: "Breathe a little easier",
    slug: "air-purifying",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=900",
  },
  {
    name: "Rare Plants",
    subtitle: "For the curious collectors",
    slug: "rare-plants",
    image: "https://images.unsplash.com/photo-1508022713622-df2d8fb7b4cd?w=900",
  },
  {
    name: "Plant Combos",
    subtitle: "Perfectly paired greens",
    slug: "plant-combos",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900",
  },
  {
    name: "Hanging Plants",
    subtitle: "Let your greenery flow",
    slug: "hanging-plants",
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=900",
  },
  {
    name: "Plant Pots",
    subtitle: "A home for every plant",
    slug: "plant-pots",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900",
  },
  {
    name: "Garden Tools",
    subtitle: "Everything to grow better",
    slug: "garden-tools",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900",
  },
  {
    name: "Plant Care",
    subtitle: "Keep your plants thriving",
    slug: "plant-care",
    image: "https://images.unsplash.com/photo-1599685315640-6ec1f7f8c3e1?w=900",
  },
  {
    name: "Seeds",
    subtitle: "Start something beautiful",
    slug: "seeds",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900",
  },
];

const reviews = [
  {
    name: "Aarav Mehta",
    location: "Mumbai",
    text: "The plants arrived in perfect condition. The packaging was beautiful and every little detail felt premium.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Pune",
    text: "My home feels so much more alive now. The quality is amazing and the plants are growing beautifully.",
    rating: 5,
  },
  {
    name: "Rohan Kapoor",
    location: "Delhi",
    text: "A wonderful experience from browsing to delivery. Definitely my favourite place to shop for plants.",
    rating: 5,
  },
  {
    name: "Ananya Shah",
    location: "Bengaluru",
    text: "Beautiful plants, thoughtful packaging and a lovely website. I am already planning my next order.",
    rating: 5,
  },
];

const news = [
  {
    title: "The art of bringing nature indoors",
    source: "THE GREEN JOURNAL",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200",
  },
  {
    title: "Small spaces, greener living",
    source: "MODERN LIVING",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1200",
  },
  {
    title: "Why every home needs a little green",
    source: "BOTANICAL DAILY",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200",
  },
  {
    title: "A fresh perspective on plant styling",
    source: "DESIGN NOTES",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200",
  },
  {
    title: "The beauty of slow gardening",
    source: "GREEN CULTURE",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200",
  },
  {
    title: "Creating your own indoor jungle",
    source: "THE PLANT EDIT",
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1200",
  },
];

export default function Home() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // SCROLL REVEAL ANIMATION
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  // AUTOMATIC REVIEW SLIDER
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setReviewIndex((current) => (current + 1) % reviews.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [paused]);

  const previousReview = () => {
    setReviewIndex((current) =>
      current === 0 ? reviews.length - 1 : current - 1,
    );
  };

  const nextReview = () => {
    setReviewIndex((current) => (current + 1) % reviews.length);
  };

  return (
    <main className="home-page">
      {/* HERO */}
      <Hero />

      {/* INTRODUCTION */}
      <section className="home-intro">
        <div className="intro-top reveal">
          <span className="eyebrow">
            <Leaf size={14} /> A DIFFERENT WAY TO LIVE GREEN
          </span>
          <span className="intro-number">01 / OUR WORLD</span>
        </div>

        <div className="intro-content">
          <h1 className="intro-heading reveal">
            Make room for
            <br />
            <span>something natural.</span>
          </h1>

          <div className="intro-bottom reveal">
            <div>
              <h2>More than just plants.</h2>
              <h4>A little nature changes everything.</h4>
            </div>

            <p>
              Discover thoughtfully selected plants, beautiful essentials and
              everything you need to create a greener space. Bring the outside
              in and make every corner feel alive.
            </p>
          </div>

          <div className="intro-scroll reveal">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={17} />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="category-section">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">02 / FIND YOUR GREEN</span>
            <h2>
              Explore our world<span>.</span>
            </h2>
          </div>

          <p>
            From little leafy friends to statement plants, find something that
            feels like you.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              to={`/products?category=${category.slug}`}
              className="category-card reveal"
              key={category.slug}
            >
              <div className="category-image-wrap">
                <img src={category.image} alt={category.name} loading="lazy" />

                <span className="category-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="category-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>

              <div className="category-info">
                <div>
                  <h4>{category.name}</h4>
                  <p>{category.subtitle}</p>
                </div>

                <ArrowUpRight size={17} className="category-small-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="review-section" id="reviews">
        <div className="review-header reveal">
          <div>
            <span className="eyebrow">03 / KIND WORDS</span>
            <h2>
              What Our Customers Are Saying<span>.</span>
            </h2>
          </div>

          <div className="review-controls">
            <button onClick={previousReview} aria-label="Previous review">
              <ChevronLeft size={20} />
            </button>

            <button onClick={nextReview} aria-label="Next review">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          className="review-slider reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            className="review-track"
            style={{ transform: `translateX(-${reviewIndex * 100}%)` }}
          >
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <Quote size={30} className="review-quote-icon" />

                <div className="review-stars">{"★".repeat(review.rating)}</div>

                <p className="review-text">“{review.text}”</p>

                <div className="review-person">
                  <div className="review-avatar">{review.name.charAt(0)}</div>

                  <div>
                    <h4>{review.name}</h4>
                    <span>{review.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="review-pagination">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              className={reviewIndex === index ? "active" : ""}
              onClick={() => setReviewIndex(index)}
              aria-label={`Show review ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section className="news-section">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">04 / PRESS & STORIES</span>
            <h2>
              Light Bio in the News<span>.</span>
            </h2>
          </div>

          <p>
            Stories, inspiration and conversations celebrating a greener way of
            living.
          </p>
        </div>

        <div className="news-grid">
          {news.map((item, index) => (
            <article className="news-card reveal" key={item.title}>
              <button
                className="news-image-button"
                onClick={() => setSelectedNews(item)}
                aria-label={`View ${item.title}`}
              >
                <img src={item.image} alt={item.title} loading="lazy" />

                <span className="news-image-icon">
                  <ArrowUpRight size={22} />
                </span>
              </button>

              <div className="news-info">
                <span>
                  {item.source} / {String(index + 1).padStart(2, "0")}
                </span>

                <h4>{item.title}</h4>

                <button
                  className="news-read"
                  onClick={() => setSelectedNews(item)}
                >
                  VIEW STORY <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWS IMAGE PREVIEW */}
      {selectedNews && (
        <div className="news-modal" onClick={() => setSelectedNews(null)}>
          <div
            className="news-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="news-modal-close"
              onClick={() => setSelectedNews(null)}
              aria-label="Close image preview"
            >
              <X size={23} />
            </button>

            <img src={selectedNews.image} alt={selectedNews.title} />

            <div className="news-modal-bottom">
              <div>
                <span>{selectedNews.source}</span>
                <h3>{selectedNews.title}</h3>
              </div>

              <a
                href={selectedNews.image}
                download="light-bio-news-image.jpg"
                target="_blank"
                rel="noreferrer"
                className="news-download"
              >
                <Download size={17} />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
