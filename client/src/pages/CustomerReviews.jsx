import { useMemo, useState, useEffect } from "react";

import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Image as ImageIcon,
} from "lucide-react";

import "../Style/CustomerReviews.css";

// SETTINGS
const ITEMS_PER_PAGE = 8;
const TOTAL_REVIEWS = 100;

// CUSTOMER IMAGES
// All images are unique. Repeated URLs have been removed.
const customerImages = [
  // Your local images
  "/customer_reviews/User_picture.jpeg",
  "/customer_reviews/User_picture_1.jpeg",
  "/customer_reviews/User_picture_2.jpeg",
  "/customer_reviews/User_picture_3.jpeg",
  "/customer_reviews/User_picture_4.jpeg",
  "/customer_reviews/User_picture_5.jpeg",
  "/customer_reviews/User_picture_6.jpeg",
  "/customer_reviews/User_picture_7.jpeg",
  "/customer_reviews/User_picture_8.jpeg",

  // New images you provided
  "https://tse1.mm.bing.net/th/id/OIP.VDyc3earWa_XVvyT8z23YgHaFq?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.gdhZVvRBMY9EDA3MiX593gHaE7?r=0&pid=Api&h=220&P=0",
  "https://tse2.mm.bing.net/th/id/OIP.qqo2fF17sQjknrVyqmOuHAHaEK?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.qUIwY-SVEd41pBynsP7flwHaEy?r=0&pid=Api&h=220&P=0",
  "https://tse2.mm.bing.net/th/id/OIP.CHlVaQ-QPbukaoudPqDsyAHaEK?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.OatnubwqPR0fVqCKgx8k-QHaD3?r=0&pid=Api&h=220&P=0",
  "https://tse2.mm.bing.net/th/id/OIP.sZ6Q-6a1iXNSETo3Fn9dLwHaLH?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.oLOcy0LhYegrQLqAZAfIxAHaEK?r=0&pid=Api&h=220&P=0",
  "https://tse4.mm.bing.net/th/id/OIP.ZjyFpCaVdBpqUqFeeU4gyQHaJ4?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.i0-1kUaVN9y-DBjBu_4eFgHaJ4?r=0&pid=Api&h=220&P=0",
  "https://tse2.mm.bing.net/th/id/OIP.r2xTRtndaCmtvIhmCWmy_gHaE8?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.iPLivEbHOVAkPIBWOEFx_QHaEL?r=0&pid=Api&h=220&P=0",
  "https://tse1.mm.bing.net/th/id/OIP.P-2I4YLBJHkYVm4YGZkr_AHaEK?r=0&pid=Api&h=220&P=0",
  "https://tse3.mm.bing.net/th/id/OIP.tmY0QkZW5H7cyzslNn354wHaJ4?r=0&pid=Api&h=220&P=0",
  "https://tse4.mm.bing.net/th/id/OIP.I8trEpKN-RdspRyauWqpdgHaHa?r=0&pid=Api&h=220&P=0",
];

// CUSTOMER NAMES
const names = [
  "Aarav Sharma",
  "Priya Mehta",
  "Rohan Patel",
  "Ananya Singh",
  "Ishaan Kapoor",
  "Sneha Desai",
  "Kabir Khan",
  "Aisha Verma",
  "Arjun Malhotra",
  "Diya Shah",
  "Vivaan Joshi",
  "Meera Iyer",
  "Aditya Rao",
  "Kavya Nair",
  "Reyansh Gupta",
  "Sana Sheikh",
  "Rahul Kulkarni",
  "Tanya Roy",
  "Dev Malhotra",
  "Nisha Jain",
  "Karan Sethi",
  "Pooja Mishra",
  "Yash Thakur",
  "Ira Banerjee",
  "Manav Bhatia",
  "Riya Chawla",
  "Siddharth Bose",
  "Mira Thomas",
  "Ayaan Qureshi",
  "Neha Pillai",
  "Krish Reddy",
  "Simran Kaur",
  "Atharv Joshi",
  "Tara Menon",
  "Dhruv Saxena",
  "Ishita Das",
  "Veer Prasad",
  "Anika George",
  "Omkar Patil",
  "Zoya Ali",
  "Harsh Vardhan",
  "Mahi Agarwal",
  "Neil Fernandes",
  "Sanya Arora",
  "Ritvik Sen",
  "Aditi Ghosh",
  "Parth Shah",
  "Naina Kapoor",
  "Samar Khan",
  "Myra Sinha",
  "Rudra Das",
  "Lavanya Rao",
  "Aman Choudhary",
  "Tia Mukherjee",
  "Sahil Jain",
  "Kiara Dutta",
  "Raghav Bansal",
  "Ishani Roy",
  "Varun Nair",
  "Alisha Thomas",
  "Aryan Sood",
  "Navya Reddy",
  "Shivam Yadav",
  "Rhea Malhotra",
  "Kunal Mehra",
  "Avni Shah",
  "Abhinav Rao",
  "Esha Kapoor",
  "Pranav Kulkarni",
  "Misha Sen",
  "Tanmay Joshi",
  "Aarohi Patel",
  "Rishabh Verma",
  "Jhanvi Iyer",
  "Ansh Gupta",
  "Sia Mehta",
  "Mohit Sinha",
  "Nandini Bose",
  "Tushar Pillai",
  "Aanya Khan",
  "Saurabh Das",
  "Ishika Nair",
  "Gaurav Roy",
  "Vanya Sharma",
  "Rajat Bhatia",
  "Ayesha Qureshi",
  "Nikhil Patil",
  "Pari Chawla",
  "Akash Menon",
  "Ritika Jain",
  "Shaan Fernandes",
  "Manya Agarwal",
  "Deepak Sethi",
  "Aaradhya Mishra",
  "Rohan Bose",
  "Suhana Ali",
  "Jayant Rao",
  "Trisha George",
  "Vihaan Arora",
  "Zara Sheikh",
];

// REVIEW TITLES
const reviewTitles = [
  "Beautiful addition to my home",
  "Absolutely love this plant",
  "Looks even better in person",
  "A lovely touch of greenery",
  "Great packaging and presentation",
  "A refreshing change for my space",
  "Very happy with my purchase",
  "Such a beautiful plant",
  "Perfect for my living room",
  "A wonderful gifting option",
];

// REVIEW CONTENT
const reviewTexts = [
  "The plant looks beautiful and adds a fresh, natural feel to my space. I really like the overall presentation.",
  "I loved the way it was packed. It arrived looking lovely and made a great addition to my home.",
  "The design and quality look great. It fits perfectly into my room and gives the space a refreshing feel.",
  "A beautiful product with a premium look. I am happy with how it looks on my desk.",
  "Really nice experience from browsing to delivery. The plant looks lovely in my home.",
  "I wanted something different for my space and this was a lovely choice. The details look great.",
  "The packaging was neat and the plant looks just like what I expected. Very pleased with it.",
  "It adds a nice natural touch to my room. I would consider ordering another one.",
];

// GENERATE REVIEWS
const reviews = Array.from({ length: TOTAL_REVIEWS }, (_, index) => ({
  id: index + 1,
  name: names[index],

  initials: names[index]
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),

  rating: index % 11 === 0 ? 4 : 5,

  title: reviewTitles[index % reviewTitles.length],

  text: reviewTexts[index % reviewTexts.length],

  date: new Date(
    2026,
    9 - Math.floor(index / 12),
    28 - (index % 25),
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),

  verified: index % 4 !== 3,

  // Attach images to selected reviews
  image:
    index % 5 === 0
      ? customerImages[(Math.floor(index / 5) + 1) % customerImages.length]
      : null,
}));

// STAR COMPONENT
function Stars({ rating, size = 15 }) {
  return (
    <div className="cr-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < rating ? "currentColor" : "none"}
          strokeWidth={1.6}
        />
      ))}
    </div>
  );
}

// MAIN COMPONENT
export default function CustomerReviews() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedImage, setSelectedImage] = useState(null);

  // FILTER AND SORT REVIEWS
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (selectedRating !== "all") {
      result = result.filter(
        (review) => review.rating === Number(selectedRating),
      );
    }

    if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating || b.id - a.id);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating || b.id - a.id);
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [selectedRating, sortBy]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / ITEMS_PER_PAGE),
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredReviews.length,
  );

  const visibleReviews = filteredReviews.slice(startIndex, endIndex);

  // RESET PAGE IF FILTER CHANGES
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // LIGHTBOX SCROLL LOCK
  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  // CLOSE LIGHTBOX WITH ESCAPE
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // PAGE NAVIGATION
  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(nextPage);

    document.querySelector(".cr-reviews-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // RATING COUNTS
  const ratingCounts = {
    5: reviews.filter((review) => review.rating === 5).length,
    4: reviews.filter((review) => review.rating === 4).length,
    3: reviews.filter((review) => review.rating === 3).length,
    2: reviews.filter((review) => review.rating === 2).length,
    1: reviews.filter((review) => review.rating === 1).length,
  };

  // AVERAGE RATING
  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <main className="customer-reviews">
      {/* HERO SECTION */}
      <section className="cr-hero">
        <div className="cr-hero-content">
          <span className="cr-eyebrow">THE NIVELY COMMUNITY</span>

          <h1>
            Real spaces.
            <br />
            <em>Green stories.</em>
          </h1>

          <p>
            A closer look at the plants, spaces and little moments our community
            loves.
          </p>

          <a href="#reviews" className="cr-hero-link">
            EXPLORE REVIEWS <span>↓</span>
          </a>
        </div>

        <div className="cr-hero-image">
          <img src={customerImages[0]} alt="Customer's beautiful plant" />
        </div>

        <div className="cr-hero-caption">GROW A LITTLE HAPPINESS</div>
      </section>

      {/* RATING SUMMARY */}
      <section className="cr-summary">
        <div className="cr-summary-intro">
          <span className="cr-eyebrow">KIND WORDS</span>

          <h2>Loved by plant people.</h2>

          <p>
            Discover what customers are saying about their Nively experience.
          </p>
        </div>

        <div className="cr-rating-main">
          <strong>{averageRating}</strong>

          <Stars rating={5} size={20} />

          <span>Average sample rating</span>
        </div>

        <div className="cr-rating-breakdown">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div className="cr-rating-row" key={rating}>
              <span>
                {rating}
                <Star size={12} fill="currentColor" />
              </span>

              <div className="cr-rating-track">
                <div
                  style={{
                    width: `${(ratingCounts[rating] / TOTAL_REVIEWS) * 100}%`,
                  }}
                />
              </div>

              <span>{ratingCounts[rating]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER PHOTO GALLERY */}
      <section className="cr-gallery">
        <div className="cr-section-heading">
          <div>
            <span className="cr-eyebrow">FROM OUR COMMUNITY</span>
            <h2>Little green moments.</h2>
          </div>

          <span className="cr-gallery-count">
            <ImageIcon size={15} />
            CUSTOMER GALLERY
          </span>
        </div>

        <div className="cr-gallery-grid">
          {customerImages.map((image, index) => (
            <button
              className={`cr-gallery-image cr-gallery-image-${(index % 3) + 1}`}
              key={image}
              onClick={() => setSelectedImage(image)}
              aria-label={`View customer photograph ${index + 1}`}
            >
              <img
                src={image}
                alt={`Nively plant gallery image ${index + 1}`}
                loading="lazy"
              />

              <span>VIEW IMAGE ↗</span>
            </button>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="cr-reviews-section" id="reviews">
        <div className="cr-section-heading cr-reviews-heading">
          <div>
            <span className="cr-eyebrow">CUSTOMER FEEDBACK</span>
            <h2>What people are saying.</h2>
            <p>Thoughts and experiences from our community.</p>
          </div>

          <div className="cr-total-count">
            <strong>{filteredReviews.length}</strong>
            <span>REVIEWS</span>
          </div>
        </div>

        {/* FILTER TOOLBAR */}
        <div className="cr-toolbar">
          <div className="cr-filter-label">
            <SlidersHorizontal size={16} />
            <span>FILTER BY</span>
          </div>

          <div className="cr-filter-buttons">
            <button
              className={selectedRating === "all" ? "active" : ""}
              onClick={() => {
                setSelectedRating("all");
                setCurrentPage(1);
              }}
            >
              All reviews
            </button>

            {[5, 4].map((rating) => (
              <button
                key={rating}
                className={selectedRating === String(rating) ? "active" : ""}
                onClick={() => {
                  setSelectedRating(String(rating));
                  setCurrentPage(1);
                }}
              >
                {rating}
                <Star size={12} fill="currentColor" />
              </button>
            ))}
          </div>

          <label className="cr-sort">
            <span>SORT BY</span>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </label>
        </div>

        {/* SHOWING REVIEWS */}
        <div className="cr-showing">
          SHOWING{" "}
          {filteredReviews.length === 0 ? "0" : `${startIndex + 1}–${endIndex}`}{" "}
          OF {filteredReviews.length} REVIEWS
        </div>

        {/* REVIEW CARDS */}
        <div className="cr-review-grid">
          {visibleReviews.map((review) => (
            <article className="cr-review-card" key={review.id}>
              <div className="cr-review-top">
                <div className="cr-reviewer">
                  <div className="cr-avatar">{review.initials}</div>

                  <div>
                    <h3>{review.name}</h3>

                    {review.verified && (
                      <span className="cr-verified">✓ VERIFIED CUSTOMER</span>
                    )}
                  </div>
                </div>

                <span className="cr-review-date">{review.date}</span>
              </div>

              <Stars rating={review.rating} />

              <h4>{review.title}</h4>

              <p className="cr-review-text">{review.text}</p>

              {/* CUSTOMER PHOTO INSIDE REVIEW */}
              {review.image && (
                <button
                  className="cr-review-photo"
                  onClick={() => setSelectedImage(review.image)}
                  aria-label="View customer review photograph"
                >
                  <img
                    src={review.image}
                    alt="Plant gallery photograph"
                    loading="lazy"
                  />

                  <span>VIEW PHOTO ↗</span>
                </button>
              )}
            </article>
          ))}
        </div>

        {/* EMPTY STATE */}
        {visibleReviews.length === 0 && (
          <div className="cr-empty">
            <h3>No reviews found</h3>
            <p>Try selecting another rating.</p>

            <button
              onClick={() => {
                setSelectedRating("all");
                setCurrentPage(1);
              }}
            >
              SHOW ALL REVIEWS
            </button>
          </div>
        )}

        {/* PAGINATION */}
        <div className="cr-pagination">
          <button
            className="cr-page-arrow"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={17} />
            <span>PREV</span>
          </button>

          <div className="cr-page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            className="cr-page-arrow"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <span>NEXT</span>
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="cr-page-status">
          PAGE {currentPage} OF {totalPages}
        </div>
      </section>

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="cr-lightbox"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <button
            className="cr-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            <X size={25} />
          </button>

          <img
            src={selectedImage}
            alt="Expanded plant photograph"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
