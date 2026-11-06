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

/* =========================================
   IMAGE PATH HELPER
========================================= */
const homeImage = (filename) => `/Home/${encodeURIComponent(filename)}`;

const categories = [
  {
    name: "Glow Getter Mailbag",
    subtitle: "Your Top Autumn Indoor Care Questions, Answered!",
    slug: "indoor-plants",
    image: homeImage("GlowGetterMailbag.png"),
  },
  {
    name: "How to Photograph The Bioluminescent Glow",
    subtitle: "Capture the magic of glowing flowers",
    slug: "photograph-the-glow",
    image: homeImage("HowtoPhotographthe.png"),
  },
  {
    name: "Cozy Indoor Styling Ideas for Your Firefly Petunia",
    subtitle: "Bring a little glow into your home",
    slug: "cozy-indoor-styling",
    image: homeImage("Cozy Indoor StylingIdeasforYourFirefly.png"),
  },
  {
    name: "Bringing the Glow Indoors",
    subtitle: "How to care for your plants indoors",
    slug: "bringing-the-glow-indoors",
    image: homeImage("BingingtheGlowIndoors.png"),
  },
  {
    name: "A Conversation with Jim Devereux",
    subtitle: "Meet the people behind the plants",
    slug: "jim-devereux-interview",
    image: homeImage("ToAllBlogPostsAConversationwithGreenFuseBotanicalsCo-OwnerJimDevereux.png"),
  },
  {
    name: "Why the Newest Buds Glow the Brightest",
    subtitle: "Discover the science behind the glow",
    slug: "newest-buds-glow",
    image: homeImage("WhytheNewestBudsGlowtheBrightest.png"),
  },
  {
    name: "The Science of Spooky Season",
    subtitle: "Explore the magic of bioluminescence",
    slug: "science-of-spooky-season",
    image: homeImage("TheScienceofSpookySeason.png"),
  },
  {
    name: "Why the Glow Transforms from Day to Night",
    subtitle: "The beauty of nature after dark",
    slug: "glow-day-to-night",
    image: homeImage("WhytheGlowTransformsfromDaytoNight.png"),
  },
  {
    name: "The Firefly Petunia Is Strictly an Outdoor Plant",
    subtitle: "Discover the truth about glowing petunias",
    slug: "outdoor-plant-myth",
    image: homeImage("TheFireflyPetuniaIsStrictlyanOutdoorPlant.png"),
  },
  {
    name: "The Glow in Official Firefly Petunia Photos Is Enhanced",
    subtitle: "The truth behind the glowing photographs",
    slug: "glow-photos-enhanced",
    image: homeImage("TheGlowintheOfficialFirefly.png"),
  },
  {
    name: "The Glow Runs Out of Power After an Hour or Two",
    subtitle: "Understanding the living glow",
    slug: "glow-power",
    image: homeImage("TheGlowRunsOutofPowerAfteranHourorTwo.png"),
  },
  {
    name: "Glowing Petunias Rely on Blacklights and Chemical Sprays",
    subtitle: "Separating facts from myths",
    slug: "blacklights-and-sprays",
    image: homeImage("GlowingPetuniasRelyonSpecialBlacklightsandChemicalSprays.png"),
  },
];

/* =========================================
   CUSTOMER REVIEWS
========================================= */

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

/* =========================================
   HOME COMPONENT
========================================= */

export default function Home() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  /* SCROLL ANIMATION */

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

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  /* REVIEW AUTOPLAY */

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setReviewIndex((current) => (current + 1) % reviews.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [paused]);

  /* REVIEW CONTROLS */

  const previousReview = () => {
    setReviewIndex((current) =>
      current === 0 ? reviews.length - 1 : current - 1,
    );
  };

  const nextReview = () => {
    setReviewIndex((current) => (current + 1) % reviews.length);
  };

  /* IMAGE FALLBACK */

  const handleImageError = (event, originalPath) => {
    console.error("Image failed to load:", originalPath);

    event.currentTarget.onerror = null;

    event.currentTarget.src = homeImage("GlowGetterMailbag.png");
  };

  return (
    <main className="home-page">
      {/* =====================================
          HERO
      ===================================== */}

      <Hero />

      {/* =====================================
          INTRODUCTION
      ===================================== */}

      <section className="home-intro">
        <div className="intro-top reveal">
          <span className="eyebrow">
            <Leaf size={14} />
            The Wonder of Living Light
          </span>

          <span className="intro-number">01 / OUR WORLD</span>
        </div>

        <div className="intro-content">
          <h1 className="intro-heading reveal">
            The World’s First
            <br />
            <span>Naturally Glowing Plants.</span>
          </h1>

          <div className="intro-bottom reveal">
            <p>
              Light Bio™ brings the hidden wonders of the world into your hands
              with the world’s first naturally glowing plants! Inspired by the
              bioluminescence found in our oceans and forests, these
              extraordinary plants glow with their own living energy. No
              batteries, wires, or sprays.
              <br />
              <br />
              Light Bio’s bioluminescent petunias offer a new way to witness the
              vitality of nature! During the day, our petunias harvest and store
              energy through photosynthesis. At night, the plants convert that
              stored energy into a visible soft, steady glow that permeates the
              entire plant, from its brightest new blooms to every leaf and
              stem.
            </p>
          </div>

          <div className="intro-scroll reveal">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={17} />
          </div>
        </div>
      </section>

      {/* =====================================
          BLOG SECTION
      ===================================== */}

      <section className="category-section">
        <div className="section-heading reveal">
          <div>
            <span className="eyebrow">02 / OUR BLOGS</span>

            <h2>
              What's Happening<span>.</span>
            </h2>
          </div>
        </div>

        {/* BLOG GRID */}

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              to={`/blogs/${category.slug}`}
              className="category-card reveal"
              key={category.slug}
            >
              {/* IMAGE */}

              <div className="category-image-wrap">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  onError={(event) => handleImageError(event, category.image)}
                />

                <span className="category-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="category-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>

              {/* CONTENT */}

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

        <div className="blogs-view-all reveal">
          <Link to="/blogs">
            VIEW ALL
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* =====================================
          CUSTOMER REVIEWS
      ===================================== */}

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

        {/* REVIEW SLIDER */}

        <div
          className="review-slider reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            className="review-track"
            style={{
              transform: `translateX(-${reviewIndex * 100}%)`,
            }}
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

        {/* REVIEW DOTS */}

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

      {/* =====================================
          NEWS MODAL
      ===================================== */}

      {selectedNews && (
        <div className="news-modal" onClick={() => setSelectedNews(null)}>
          <div
            className="news-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="news-modal-close"
              onClick={() => setSelectedNews(null)}
              aria-label="Close modal"
            >
              <X size={23} />
            </button>

            <img src={selectedNews.image} alt={selectedNews.title} />

            <div className="news-modal-bottom">
              <div>
                <span>{selectedNews.source}</span>

                <h3>{selectedNews.title}</h3>
              </div>

              <a href={selectedNews.image} download className="news-download">
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
