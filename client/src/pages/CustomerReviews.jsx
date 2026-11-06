
import { useMemo, useState, useEffect } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Play,
} from "lucide-react";

import "../Style/CustomerReviews.css";

const ITEMS_PER_PAGE = 8;
const TOTAL_REVIEWS = 100;
const INITIAL_GALLERY_COUNT = 12;
const GALLERY_INCREMENT = 8;

// CUSTOMER IMAGES
const customerImages = [
  "/LightBio/The bioluminescent Firefly Petunia’s created by @light.bio do indeed glow..jpg",
  "/LightBio/The bioluminescent Firefly Petunia’s created by @light.bio do indeed glow. (1).jpg",
  "/LightBio/The bioluminescent Firefly Petunia’s created by @light.bio do indeed glow. (2).jpg",
  "/LightBio/Ever seen a flower change its look based on the weather 🌸➡️🤍 If your Light Bio Trial Pink & Wh.jpg",
  "/LightBio/Ever seen a flower change its look based on the weather 🌸➡️🤍 If your Light Bio Trial Pink & Wh (1).jpg",
  "/LightBio/Ever seen a flower change its look based on the weather 🌸➡️🤍 If your Light Bio Trial Pink & Wh (2).jpg",
  "/LightBio/Ever seen a flower change its look based on the weather 🌸➡️🤍 If your Light Bio Trial Pink & Wh (3).jpg",
  "/LightBio/The Final Harvest is here. ⏳All good things must come to an end—even the magical ones. Our 2026 .jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties!.jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (1).jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (2).jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (3).jpg",
  "/LightBio/What a difference the day makes! From sunset to dusk, just a few minutes make the difference bet.jpg",
  "/LightBio/What a difference the day makes! From sunset to dusk, just a few minutes make the difference bet (1).jpg",
  "/LightBio/From Day, to Night, the Firefly petunia will light up your life ✨🌱 Pre-order now for a garden t.jpg",
  "/LightBio/Captured by @enchantedluminescence, this stunning image showcases the glowing roots and delicate.jpg",
  "/LightBio/Firefly in a Jar. Firefly in Agar. Firefly in the Night. Firefly Shine so Bright. — A Poem for F.jpg",
  "/LightBio/Firefly in a Jar. Firefly in Agar. Firefly in the Night. Firefly Shine so Bright. — A Poem for F (1).jpg",
  "/LightBio/Day vs. Night. 🌗 Tomorrow, the magic goes to sleep.We are down to our final 24 hours. At midnig.jpg",
  "/LightBio/@light.bioHappy Spooky Season!.jpg",
  "/LightBio/@light.bioHappy Spooky Season! (1).jpg",
  "/LightBio/@light.bioHappy Spooky Season! (2).jpg",
  "/LightBio/@light.bioHappy Spooky Season! (3).jpg",
  "/LightBio/See those two colors That’s the breakthrough. A new study in Nature Plants, led by our co-founde.jpg",
  "/LightBio/See those two colors That’s the breakthrough. A new study in Nature Plants, led by our co-founde (1).jpg",
  "/LightBio/A few photos of the new Trial Varieties of Firefly Petunias from @light.bio The first was taken .jpg",
  "/LightBio/A few photos of the new Trial Varieties of Firefly Petunias from @light.bio The first was taken  (1).jpg",
  "/LightBio/A few photos of the new Trial Varieties of Firefly Petunias from @light.bio The first was taken  (2).jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (4).jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (5).jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (6).jpg",
  "/LightBio/@light.bio Here are the two new Moonlight varieties! (7).jpg",
  "/LightBio/Captured by @enchantedluminescence, this stunning image showcases the glowing roots and delicate (1).jpg",
  "/LightBio/✨🌱A beautiful extended exposure from our friend @cassandra_tiensivu 💚✨It can be difficult to c.jpg",
  "/LightBio/For nearly four decades, scientists have strived to create bioluminescent plants. The breakthrou.jpg",
  "/LightBio/For nearly four decades, scientists have strived to create bioluminescent plants. The breakthrou (1).jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi.jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (1).jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (2).jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (3).jpg",
  "/LightBio/🌸✨ Dreaming of a luminous future with Light Bio! 🔮 Biotechnological advances promise brighter .jpg",
  "/LightBio/Weve reduced our shipping costs! Now, its $24 for one plant, plus $2 for each additional plant.jpg",
  "/LightBio/Petunias as an indoor plant! While traditional petunias are exclusively an outdoor plant, this v.jpg",
  "/LightBio/What a difference the day makes! From sunset to dusk, just a few minutes make the difference bet (2).jpg",
  "/LightBio/What a difference the day makes! From sunset to dusk, just a few minutes make the difference bet (3).jpg",
  "/LightBio/@tgregg0816 “My buddy told me about your flowers last week, I had never heard of them before. H.jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (4).jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (5).jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (6).jpg",
  "/LightBio/In early May solar storms produced some of the strongest northern lights recorded in history, vi (7).jpg",
  "/LightBio/We have a winner! An adorable winner! Congrats to @ryguysofly_ and his crew for each winning one.jpg",
  "/LightBio/Weve reduced our shipping costs! Now, its $24 for one plant, plus $2 for each additional plant (1).jpg",
  "/LightBio/🌸✨ Dreaming of a luminous future with Light Bio! 🔮 Biotechnological advances promise brighter  (1).jpg",
  "/LightBio/Captured by @enchantedluminescence, this stunning image showcases the glowing roots and delicate (2).jpg",
];

// CUSTOMER VIDEOS
const customerVideos = [
  "/LightBioVideo/🎶Flowers Gleam & Glow…🎶Don’t these remind you of the movie Tangled Such a fun addition to my g.mp4",
  "/LightBioVideo/🌌 As the hours fade into the night, the Firefly Petunia glows on—nature’s quiet reminder that b.mp4",
  "/LightBioVideo/🌌 As the hours fade into the night, the Firefly Petunia glows on—nature’s quiet reminder that b (1).mp4",
  "/LightBioVideo/From glowing bud to full bloom—the light never fades! ✨ Watch as this petunia bud slowly opens, .mp4",
  "/LightBioVideo/When science and nature team up… you get something truly magical. The Firefly Petunia by @light..mp4",
  "/LightBioVideo/The plant that made the cover of TIME’s Best Inventions of 2024 is finally here! 🌱Meet the Fire.mp4",
  "/LightBioVideo/🌱 Did you know the roots glow too! ✨ Swipe to see this “test tube baby” firefly petunia from th.mp4",
  "/LightBioVideo/FIREFLY PETUNIAS ALMOST SOLD OUT! ONLY ON SALE THROUGH JUNE!✨ Swipe to journey through each life.mp4",
  "/LightBioVideo/FIREFLY PETUNIAS ALMOST SOLD OUT! ONLY ON SALE THROUGH JUNE!✨ Swipe to journey through each life (1).mp4",
  "/LightBioVideo/FIREFLY PETUNIAS ALMOST SOLD OUT! ONLY ON SALE THROUGH JUNE!✨ Swipe to journey through each life (2).mp4",
  "/LightBioVideo/Step into a dreamlike world where moonlight dances upon petals 🌙✨ The Firefly Petunia casts a s.mp4",
  "/LightBioVideo/FIREFLY PETUNIAS ALMOST SOLD OUT! ONLY ON SALE THROUGH JUNE!✨ Swipe to journey through each life (3).mp4",
  "/LightBioVideo/FIREFLY PETUNIAS ALMOST SOLD OUT! ONLY ON SALE THROUGH JUNE!✨ Swipe to journey through each life (4).mp4",
  "/LightBioVideo/FIREFLY PETUNIAS ALMOST SOLD OUT! ONLY ON SALE THROUGH JUNE!✨ Swipe to journey through each life (5).mp4",
];

const names = [
  "Aarav Sharma", "Priya Mehta", "Rohan Patel", "Ananya Singh",
  "Ishaan Kapoor", "Sneha Desai", "Kabir Khan", "Aisha Verma",
  "Arjun Malhotra", "Diya Shah", "Vivaan Joshi", "Meera Iyer",
  "Aditya Rao", "Kavya Nair", "Reyansh Gupta", "Sana Sheikh",
  "Rahul Kulkarni", "Tanya Roy", "Dev Malhotra", "Nisha Jain",
  "Karan Sethi", "Pooja Mishra", "Yash Thakur", "Ira Banerjee",
  "Manav Bhatia", "Riya Chawla", "Siddharth Bose", "Mira Thomas",
  "Ayaan Qureshi", "Neha Pillai", "Krish Reddy", "Simran Kaur",
  "Atharv Joshi", "Tara Menon", "Dhruv Saxena", "Ishita Das",
  "Veer Prasad", "Anika George", "Omkar Patil", "Zoya Ali",
  "Harsh Vardhan", "Mahi Agarwal", "Neil Fernandes", "Sanya Arora",
  "Ritvik Sen", "Aditi Ghosh", "Parth Shah", "Naina Kapoor",
  "Samar Khan", "Myra Sinha", "Rudra Das", "Lavanya Rao",
  "Aman Choudhary", "Tia Mukherjee", "Sahil Jain", "Kiara Dutta",
  "Raghav Bansal", "Ishani Roy", "Varun Nair", "Alisha Thomas",
  "Aryan Sood", "Navya Reddy", "Shivam Yadav", "Rhea Malhotra",
  "Kunal Mehra", "Avni Shah", "Abhinav Rao", "Esha Kapoor",
  "Pranav Kulkarni", "Misha Sen", "Tanmay Joshi", "Aarohi Patel",
  "Rishabh Verma", "Jhanvi Iyer", "Ansh Gupta", "Sia Mehta",
  "Mohit Sinha", "Nandini Bose", "Tushar Pillai", "Aanya Khan",
  "Saurabh Das", "Ishika Nair", "Gaurav Roy", "Vanya Sharma",
  "Rajat Bhatia", "Ayesha Qureshi", "Nikhil Patil", "Pari Chawla",
  "Akash Menon", "Ritika Jain", "Shaan Fernandes", "Manya Agarwal",
  "Deepak Sethi", "Aaradhya Mishra", "Rohan Bose", "Suhana Ali",
  "Jayant Rao", "Trisha George", "Vihaan Arora", "Zara Sheikh",
];

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

// GENERATE SAMPLE REVIEWS
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
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [visibleGalleryCount, setVisibleGalleryCount] = useState(
    INITIAL_GALLERY_COUNT,
  );

  // COMBINE PHOTOS AND VIDEOS
  const galleryMedia = useMemo(
    () => [
      ...customerImages.map((src, index) => ({
        id: `image-${index}`,
        src,
        type: "image",
      })),
      ...customerVideos.map((src, index) => ({
        id: `video-${index}`,
        src,
        type: "video",
      })),
    ],
    [],
  );

  const visibleGalleryMedia = galleryMedia.slice(0, visibleGalleryCount);

  const handleLoadMore = () => {
    setVisibleGalleryCount((current) =>
      Math.min(current + GALLERY_INCREMENT, galleryMedia.length),
    );
  };

  const handleShowLess = () => {
    setVisibleGalleryCount(INITIAL_GALLERY_COUNT);

    document.querySelector(".cr-gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // LIGHTBOX BODY SCROLL
  useEffect(() => {
    document.body.style.overflow = selectedMedia ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMedia]);

  // ESCAPE KEY
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMedia(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(nextPage);

    document.querySelector(".cr-reviews-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const changeRating = (rating) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  // RATING STATISTICS
  const ratingCounts = {
    5: reviews.filter((review) => review.rating === 5).length,
    4: reviews.filter((review) => review.rating === 4).length,
    3: reviews.filter((review) => review.rating === 3).length,
    2: reviews.filter((review) => review.rating === 2).length,
    1: reviews.filter((review) => review.rating === 1).length,
  };

  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  const galleryProgress =
    (visibleGalleryMedia.length / galleryMedia.length) * 100;

  return (
    <main className="customer-reviews">

      {/* HERO */}
      <section className="cr-hero">
        <div className="cr-hero-content">
          <span className="cr-eyebrow">
            THE LUMIVERA COMMUNITY
          </span>

          <h1>
            Real People.
            <br />
            Real <em>Stories.</em>
          </h1>

          <p>
            Real plants, real homes and real stories. Discover how our
            community brings a little more nature into everyday life.
          </p>

          <a href="#cr-community-gallery" className="cr-hero-link">
            EXPLORE GALLERY <span>↗</span>
          </a>

          <div className="cr-hero-note">
            <span className="cr-note-line" />
            <span>NATURALLY LOVED. GENUINELY GROWN.</span>
          </div>
        </div>

        <div className="cr-hero-image">
          <img
            src={customerImages[0]}
            alt="Beautiful Firefly Petunia"
          />

          <div className="cr-hero-image-label">
            <span>01 / COMMUNITY</span>
            <span>GROW SOMETHING MAGICAL</span>
          </div>
        </div>

        <div className="cr-hero-bottom-text">
          LUMIVERA — CUSTOMER STORIES
        </div>
      </section>

      {/* RATING SUMMARY */}
      <section className="cr-summary">
        <div className="cr-summary-intro">
          <span className="cr-eyebrow">
            A COMMUNITY THAT GROWS
          </span>

          <h2>
            Loved by people. <em>Rooted in nature.</em>
          </h2>

          <p>
            Every plant has a story. Here are a few words from the people
            who made room for a little more green.
          </p>
        </div>

        <div className="cr-rating-main">
          <strong>{averageRating}</strong>
          <Stars rating={5} size={19} />
          <span>OUT OF 5 — CUSTOMER RATING</span>
        </div>

        <div className="cr-rating-breakdown">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div className="cr-rating-row" key={rating}>
              <span className="cr-rating-number">
                {rating}
                <Star size={12} fill="currentColor" />
              </span>

              <div className="cr-rating-track">
                <div
                  style={{
                    width: `${
                      (ratingCounts[rating] / TOTAL_REVIEWS) * 100
                    }%`,
                  }}
                />
              </div>

              <span className="cr-rating-total">
                {ratingCounts[rating]}
              </span>
            </div>
          ))}
        </div>

        <div className="cr-happy-customers">
          <div className="cr-customer-avatars">
            {names.slice(0, 5).map((name, index) => (
              <span
                key={name}
                className={`cr-customer-avatar avatar-${index}`}
              >
                {name.slice(0, 1)}
              </span>
            ))}
          </div>

          <strong>12,500+</strong>
          <span>HAPPY PLANT PEOPLE</span>
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section className="cr-gallery" id="cr-community-gallery">
        <div className="cr-section-heading">
          <div>
            <span className="cr-eyebrow">
              A LOOK INTO OUR WORLD
            </span>

            <h2>
              Our Community <em>Gallery.</em>
            </h2>

            <p>
              Little moments, beautiful spaces and plants that make people
              smile.
            </p>
          </div>

          <div className="cr-gallery-count">
            <span>{customerImages.length} PHOTOS</span>
            <span className="cr-count-divider">/</span>
            <span>{customerVideos.length} VIDEOS</span>
          </div>
        </div>

        <div className="cr-gallery-grid">
          {visibleGalleryMedia.map((media, index) => (
            <button
              type="button"
              className={`cr-gallery-image cr-gallery-item-${index % 8}`}
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              aria-label={
                media.type === "video" ? "Play video" : "View image"
              }
            >
              {media.type === "image" ? (
                <img
                  src={media.src}
                  alt={`Community plant photograph ${index + 1}`}
                  loading="lazy"
                />
              ) : (
                <>
                  <video
                    src={media.src}
                    muted
                    playsInline
                    preload="metadata"
                  />

                  <span className="cr-media-play">
                    <Play size={20} fill="currentColor" />
                  </span>
                </>
              )}

              <span className="cr-gallery-overlay">
                <span className="cr-gallery-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="cr-gallery-action">
                  {media.type === "video" ? "WATCH VIDEO" : "VIEW PHOTO"} ↗
                </span>
              </span>

              {media.type === "video" && (
                <span className="cr-gallery-type">
                  VIDEO
                </span>
              )}
            </button>
          ))}
        </div>

        {/* GALLERY CONTROLS */}
        <div className="cr-gallery-controls">
          <div className="cr-gallery-progress-info">
            <span>
              SHOWING {visibleGalleryMedia.length} OF {galleryMedia.length}
            </span>

            <span>{Math.round(galleryProgress)}% VIEWED</span>
          </div>

          <div
            className="cr-gallery-progress-track"
            role="progressbar"
            aria-valuenow={visibleGalleryMedia.length}
            aria-valuemin={0}
            aria-valuemax={galleryMedia.length}
          >
            <span style={{ width: `${galleryProgress}%` }} />
          </div>

          <div className="cr-gallery-buttons">
            {visibleGalleryCount < galleryMedia.length && (
              <button
                type="button"
                className="cr-gallery-load-more"
                onClick={handleLoadMore}
              >
                LOAD MORE MOMENTS
                <span>＋</span>
              </button>
            )}

            {visibleGalleryCount > INITIAL_GALLERY_COUNT && (
              <button
                type="button"
                className="cr-gallery-show-less"
                onClick={handleShowLess}
              >
                SHOW LESS ↑
              </button>
            )}
          </div>

          {visibleGalleryCount >= galleryMedia.length && (
            <p className="cr-gallery-end-message">
              YOU'VE REACHED THE END OF THE GALLERY
            </p>
          )}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="cr-reviews-section" id="reviews">
        <div className="cr-section-heading cr-reviews-heading">
          <div>
            <span className="cr-eyebrow">
              KIND WORDS, REAL EXPERIENCES
            </span>

            <h2>
              Stories from <em>our customers.</em>
            </h2>

            <p>
              Honest thoughts from people who have welcomed nature into
              their homes.
            </p>
          </div>

          <div className="cr-total-count">
            <strong>{filteredReviews.length}</strong>
            <span>REVIEWS</span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="cr-toolbar">
          <div className="cr-filter-label">
            <SlidersHorizontal size={15} />
            <span>FILTER</span>
          </div>

          <div className="cr-filter-buttons">
            <button
              className={selectedRating === "all" ? "active" : ""}
              onClick={() => changeRating("all")}
            >
              All reviews
            </button>

            {[5, 4].map((rating) => (
              <button
                key={rating}
                className={
                  selectedRating === String(rating) ? "active" : ""
                }
                onClick={() => changeRating(String(rating))}
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

        <div className="cr-showing">
          SHOWING{" "}
          {filteredReviews.length === 0
            ? "0"
            : `${startIndex + 1}–${endIndex}`}{" "}
          OF {filteredReviews.length} REVIEWS
        </div>

        {/* REVIEW CARDS */}
        <div className="cr-review-grid">
          {visibleReviews.map((review) => (
            <article className="cr-review-card" key={review.id}>
              <div className="cr-review-top">
                <div className="cr-reviewer">
                  <div className="cr-avatar">
                    {review.initials}
                  </div>

                  <div>
                    <h3>{review.name}</h3>

                    {review.verified && (
                      <span className="cr-verified">
                        <span>✓</span> VERIFIED CUSTOMER
                      </span>
                    )}
                  </div>
                </div>

                <span className="cr-review-date">
                  {review.date}
                </span>
              </div>

              <Stars rating={review.rating} />

              <h4>{review.title}</h4>

              <p className="cr-review-text">
                {review.text}
              </p>

              <div className="cr-review-footer">
                <span>SHARED WITH LOVE</span>
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>

        {/* EMPTY STATE */}
        {visibleReviews.length === 0 && (
          <div className="cr-empty">
            <h3>No reviews found</h3>
            <p>Try selecting another rating.</p>

            <button onClick={() => changeRating("all")}>
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
          >
            <ChevronLeft size={16} />
            PREV
          </button>

          <div className="cr-page-numbers">
            {Array.from(
              { length: totalPages },
              (_, index) => index + 1,
            ).map((page) => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => goToPage(page)}
                aria-current={
                  currentPage === page ? "page" : undefined
                }
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="cr-page-arrow"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            NEXT
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="cr-page-status">
          PAGE {currentPage} OF {totalPages}
        </div>
      </section>

      {/* IMAGE / VIDEO LIGHTBOX */}
      {selectedMedia && (
        <div
          className="cr-lightbox"
          onClick={() => setSelectedMedia(null)}
          role="presentation"
        >
          <button
            className="cr-lightbox-close"
            onClick={() => setSelectedMedia(null)}
            aria-label="Close preview"
          >
            <X size={25} />
          </button>

          {selectedMedia.type === "image" ? (
            <img
              src={selectedMedia.src}
              alt="Light Bio plant"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <video
              src={selectedMedia.src}
              controls
              autoPlay
              playsInline
              onClick={(event) => event.stopPropagation()}
              className="cr-lightbox-video"
            />
          )}
        </div>
      )}
    </main>
  );
}
