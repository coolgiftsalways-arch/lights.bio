import { useMemo, useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  Camera,
  MessageCircle,
  BadgeCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

import "../Style/CustomerReviews.css";

const ratingBreakdown = [
  { stars: 5, count: 728 },
  { stars: 4, count: 107 },
  { stars: 3, count: 94 },
  { stars: 2, count: 37 },
  { stars: 1, count: 97 },
];

const reviews = [
  {
    id: 1,
    name: "Zachary Krackow",
    initial: "Z",
    date: "2026-09-18",
    rating: 5,
    verified: true,
    title: "My second year growing Light Bio petunias",
    text: "This is my second year growing the Light Bio petunias, and I've really enjoyed having them. The biggest thing I learned is that they need WAY more light than I originally expected. Full sun is an absolute must if you want them to really take off and perform well. Once I figured that out, I had much better results. They're such a fun and unique plant to grow, and I'm already excited for next year. I've got some much bigger plans for them next season!",
    reply:
      "Hi Zachary, thank you so much for leaving us a 5-star review! We're so happy you've been enjoying growing them. Quality and quantity of light are definitely key factors in keeping them glowing and happy. If you have any issues or concerns in the future, please reach out to our team. With appreciation, The Light Bio Team.",
    dateLabel: "09/18/2026",
  },
  {
    id: 2,
    name: "Hector Chavez",
    initial: "H",
    date: "2026-09-09",
    rating: 5,
    verified: false,
    title: "Wonderful plant and great customer service",
    text: "Wonderful plant that glows bright and great customer service! You are covered if anything goes wrong, and the customer service here is great. They stand by their products. My plant did glow nicely for the time it was alive. Excited for next growing season!",
    reply:
      "Thank you so much for sharing this. We're glad to hear how much you enjoyed the glow while your plant was thriving. Plants can sometimes be stressed from transit, and Firefly Petunias are especially sensitive to heat. We hope you'll consider giving them another try next spring!",
    dateLabel: "09/09/2026",
  },
  {
    id: 3,
    name: "April Lawrence",
    initial: "A",
    date: "2026-08-31",
    rating: 1,
    verified: true,
    title: "Every one I've gotten has ended up dying",
    text: "Every one I've gotten has ended up dying. The last three that I got were sick from the start. I got them to make a slight comeback and start to flourish, but then they started to die again and never recovered. I know I have an issue with black flies, but I don't think they can make them deteriorate that quickly. These last three never even bloomed again. I get excited each year to try my luck again, but it is an expensive gift to myself that only ever ends up dying.",
    reply:
      "Hi April, we're so sorry to hear your plants arrived in bad shape. We checked your order and realized it may have shipped in the heat, which could have affected their health. We stand by our plants and would love to help find a solution for you.",
    dateLabel: "08/31/2026",
  },
  {
    id: 4,
    name: "Karima Kamal",
    initial: "K",
    date: "2026-08-29",
    rating: 5,
    verified: false,
    title: "Happy with Light Bio",
    text: "I previously wrote a review based on an experience that unfortunately did not meet my expectations. However, with the help of the customer service team, the issue was quickly addressed and resolved. I truly appreciate their professionalism, responsiveness, and commitment to making things right. I'm happy to support this growing company and look forward to seeing them continue to grow and succeed!",
    reply:
      "Hi Karima, thank you so much for such kind words. It really means a lot to know the experience was turned around for you. We're glad to have your support, and we're looking forward to continuing to grow and improve.",
    dateLabel: "08/29/2026",
  },
  {
    id: 5,
    name: "Thom",
    initial: "T",
    date: "2026-08-09",
    rating: 5,
    verified: false,
    title: "Pretty cool!",
    text: "Didn't know what to expect and was pleasantly surprised to see the glow in the flower! They were delivered on time and were packaged beyond careful, maybe a little OCD? It was a really fun experience seeing the flowers glow.",
    reply:
      "Hi Thom, thanks so much for the 5-star review! We definitely take our plant packaging very seriously. Guaranteeing these glowing beauties arrive safe and sound takes a little extra care. We're thrilled you were pleasantly surprised by the glow!",
    dateLabel: "08/09/2026",
  },
];

const highlights = [
  {
    quote:
      "Beyond my expectations. I had no idea they would grow in profusion and glow so brightly.",
    label: "THE GLOW",
  },
  {
    quote:
      "Brightest spot in my garden. I own a piece of history and I'm really proud to support the team!",
    label: "THE EXPERIENCE",
  },
  {
    quote:
      "The soft, natural glow creates an almost fairy-tale ambiance in the garden.",
    label: "THE FLOWERS",
  },
];

const topics = ["Flowers", "Packaging", "Glow", "Customer service", "Plants"];

const galleryImages = [
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700",
  "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=700",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=700",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=700",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700",
  "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=700",
];

function Stars({ rating, size = 17 }) {
  return (
    <span className="cr-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < rating ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export default function CustomerReviews() {
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [expandedReview, setExpandedReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reviewsPerPage = 3;

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (ratingFilter !== "all") {
      result = result.filter(
        (review) => review.rating === Number(ratingFilter),
      );
    }

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [ratingFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / reviewsPerPage),
  );

  const currentReviews = filteredReviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage,
  );

  const changeFilter = (value) => {
    setRatingFilter(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="customer-reviews">
      {/* HERO */}
      <section className="cr-hero">
        <div className="cr-hero-orb cr-hero-orb-one" />
        <div className="cr-hero-orb cr-hero-orb-two" />

        <div className="cr-container cr-hero-inner">
          <div className="cr-eyebrow">
            <span />
            REAL EXPERIENCES, REAL GROWTH
          </div>

          <h1>
            Customer
            <br />
            <em>Reviews.</em>
          </h1>

          <div className="cr-hero-bottom">
            <p>
              Every garden has a story. Discover what our growing community
              thinks about their experience with us.
            </p>

            <a href="#cr-reviews" className="cr-hero-link">
              EXPLORE REVIEWS
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="cr-hero-decoration">GROW TOGETHER</div>
        </div>
      </section>

      {/* RATING OVERVIEW */}
      <section className="cr-overview cr-container">
        <div className="cr-overview-heading">
          <div>
            <span className="cr-section-label">01 / THE COMMUNITY</span>
            <h2>
              Your words.
              <br />
              <em>Our growth.</em>
            </h2>
          </div>

          <p>
            We value constructive feedback. Our support channels and social
            media pages are governed by community standards to help create a
            respectful environment for everyone.
          </p>
        </div>

        <div className="cr-rating-panel">
          <div className="cr-rating-main">
            <span className="cr-rating-number">4.3</span>
            <Stars rating={4} size={23} />
            <span className="cr-rating-total">Based on 1,063 reviews</span>
            <button
              className="cr-write-button"
              onClick={() => {
                setShowReviewForm(true);
                setSubmitted(false);
              }}
            >
              Write a review <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="cr-rating-breakdown">
            {ratingBreakdown.map((item) => (
              <button
                className={`cr-rating-row ${
                  ratingFilter === String(item.stars) ? "selected" : ""
                }`}
                key={item.stars}
                onClick={() =>
                  changeFilter(
                    ratingFilter === String(item.stars)
                      ? "all"
                      : String(item.stars),
                  )
                }
              >
                <span>{item.stars}</span>
                <Star size={13} fill="currentColor" />
                <span className="cr-rating-bar">
                  <span
                    style={{
                      width: `${(item.count / 1063) * 100}%`,
                    }}
                  />
                </span>
                <span className="cr-rating-count">{item.count}</span>
              </button>
            ))}
            {ratingFilter !== "all" && (
              <button
                className="cr-clear-filter"
                onClick={() => changeFilter("all")}
              >
                Clear rating filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* AI SUMMARY */}
      <section className="cr-summary-section">
        <div className="cr-container">
          <div className="cr-summary-top">
            <div className="cr-summary-icon">
              <Sparkles size={21} />
            </div>
            <div>
              <span className="cr-section-label">02 / THE BIG PICTURE</span>
              <h2>
                Customers <em>about us.</em>
              </h2>
            </div>
            <span className="cr-ai-label">AI REVIEW SUMMARY</span>
          </div>

          <div className="cr-summary-content">
            <p>
              Customers love the unique bioluminescent petunias and often praise
              the responsive customer service. Shipping experiences are mixed:
              some plants arrive healthy, while others may arrive stressed or
              damaged. The company responds to plant issues with support and
              possible replacements or refunds. Customers also mention that
              following the right care instructions, especially providing plenty
              of sunlight and proper watering, makes a difference to plant
              health and glow.
            </p>

            <div className="cr-topic-list">
              {topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEW HIGHLIGHTS */}
      <section className="cr-highlights cr-container">
        <div className="cr-section-heading">
          <div>
            <span className="cr-section-label">03 / WORDS THAT STAY</span>
            <h2>
              Review <em>highlights.</em>
            </h2>
          </div>
          <p>A few moments shared by our customers.</p>
        </div>

        <div className="cr-highlight-grid">
          {highlights.map((item, index) => (
            <article className="cr-highlight-card" key={item.label}>
              <span className="cr-highlight-number">
                0{index + 1} / {item.label}
              </span>
              <div className="cr-highlight-stars">
                <Stars rating={5} size={15} />
              </div>
              <h3>“{item.quote}”</h3>
              <span className="cr-highlight-bottom">
                CUSTOMER VOICE <ArrowUpRight size={15} />
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS LIST */}
      <section className="cr-review-list-section" id="cr-reviews">
        <div className="cr-container">
          <div className="cr-section-heading cr-list-heading">
            <div>
              <span className="cr-section-label">04 / THE DETAILS</span>
              <h2>
                Stories from <em>the garden.</em>
              </h2>
            </div>

            <div className="cr-review-total">
              <strong>{filteredReviews.length}</strong>
              <span>displayed reviews</span>
            </div>
          </div>

          <div className="cr-filter-bar">
            <div className="cr-filter-title">
              <SlidersHorizontal size={17} />
              FILTERS
            </div>

            <div className="cr-filter-controls">
              <label>
                Rating
                <select
                  value={ratingFilter}
                  onChange={(event) => changeFilter(event.target.value)}
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </label>

              <label>
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => changeSort(event.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </label>
            </div>
          </div>

          <div className="cr-reviews">
            {currentReviews.length === 0 ? (
              <div className="cr-empty">
                <Leaf size={32} />
                <h3>No reviews found</h3>
                <p>Try selecting a different rating.</p>
                <button onClick={() => changeFilter("all")}>
                  Show all reviews
                </button>
              </div>
            ) : (
              currentReviews.map((review) => (
                <article className="cr-review-card" key={review.id}>
                  <div className="cr-review-user">
                    <div className="cr-review-avatar">{review.initial}</div>

                    <div className="cr-review-user-info">
                      <h3>{review.name}</h3>
                      {review.verified && (
                        <span className="cr-verified">
                          <BadgeCheck size={13} /> Verified
                        </span>
                      )}
                      <span className="cr-review-date">{review.dateLabel}</span>
                    </div>
                  </div>

                  <div className="cr-review-body">
                    <Stars rating={review.rating} size={17} />
                    <h4>{review.title}</h4>
                    <p>{review.text}</p>

                    <button
                      className="cr-more-button"
                      onClick={() =>
                        setExpandedReview(
                          expandedReview === review.id ? null : review.id,
                        )
                      }
                    >
                      {expandedReview === review.id
                        ? "Show less"
                        : "More details"}
                      <ArrowUpRight size={15} />
                    </button>

                    {expandedReview === review.id && (
                      <div className="cr-company-reply">
                        <div className="cr-reply-heading">
                          <MessageCircle size={17} />
                          <strong>Reply from Light Bio</strong>
                        </div>
                        <p>{review.reply}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>

          {/* PAGINATION */}
          {filteredReviews.length > reviewsPerPage && (
            <div className="cr-pagination">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={19} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={page === index + 1 ? "active" : ""}
                  onClick={() => {
                    setPage(index + 1);
                    setExpandedReview(null);
                  }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          )}

          <p className="cr-demo-note">
            This page currently displays the five review examples supplied for
            the design. Connect your review database to display all customer
            reviews.
          </p>
        </div>
      </section>

      {/* CUSTOMER GALLERY */}
      <section className="cr-gallery-section">
        <div className="cr-container">
          <div className="cr-section-heading">
            <div>
              <span className="cr-section-label">05 / COMMUNITY MOMENTS</span>
              <h2>
                Customers <em>gallery.</em>
              </h2>
            </div>

            <button
              className="cr-gallery-toggle"
              onClick={() => setShowGallery((value) => !value)}
            >
              {showGallery ? "SHOW LESS" : "SHOW MORE"}
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="cr-gallery-grid">
            {galleryImages
              .slice(0, showGallery ? galleryImages.length : 4)
              .map((image, index) => (
                <div className="cr-gallery-item" key={image}>
                  <img src={image} alt={`Plant gallery preview ${index + 1}`} />
                  <span>
                    <Camera size={14} /> GALLERY PREVIEW
                  </span>
                </div>
              ))}
          </div>

          <p className="cr-gallery-note">
            Demo gallery images — replace these with real customer-submitted
            review photos before publishing.
          </p>
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="cr-cta">
        <div className="cr-container cr-cta-inner">
          <div>
            <span className="cr-section-label">YOUR STORY MATTERS</span>
            <h2>
              Have a story
              <br />
              <em>to share?</em>
            </h2>
          </div>

          <button
            className="cr-cta-button"
            onClick={() => {
              setShowReviewForm(true);
              setSubmitted(false);
            }}
          >
            Write your review <ArrowUpRight size={19} />
          </button>
        </div>
      </section>

      {/* WRITE REVIEW MODAL */}
      {showReviewForm && (
        <div
          className="cr-modal-overlay"
          onClick={() => setShowReviewForm(false)}
        >
          <div
            className="cr-review-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="cr-modal-close"
              onClick={() => setShowReviewForm(false)}
              aria-label="Close review form"
            >
              <X size={21} />
            </button>

            {!submitted ? (
              <>
                <span className="cr-section-label">SHARE YOUR EXPERIENCE</span>
                <h2>
                  Write a <em>review.</em>
                </h2>

                <form onSubmit={handleReviewSubmit}>
                  <label>
                    Your name
                    <input type="text" placeholder="Enter your name" required />
                  </label>

                  <label>
                    Your email
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </label>

                  <label>
                    Your rating
                    <select required defaultValue="5">
                      <option value="5">★★★★★ — Excellent</option>
                      <option value="4">★★★★ — Very good</option>
                      <option value="3">★★★ — Good</option>
                      <option value="2">★★ — Fair</option>
                      <option value="1">★ — Poor</option>
                    </select>
                  </label>

                  <label>
                    Your experience
                    <textarea
                      placeholder="Tell us about your experience..."
                      rows="4"
                      required
                    />
                  </label>

                  <button className="cr-submit-review" type="submit">
                    Submit review <ArrowUpRight size={17} />
                  </button>
                </form>

                <p className="cr-form-note">
                  This is a front-end demo form. Connect a backend or review
                  service to receive and publish submissions.
                </p>
              </>
            ) : (
              <div className="cr-form-success">
                <Sparkles size={35} />
                <h2>Thank you!</h2>
                <p>
                  Your form preview is complete. No review has been sent or
                  saved because a review service is not connected yet.
                </p>
                <button onClick={() => setShowReviewForm(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
