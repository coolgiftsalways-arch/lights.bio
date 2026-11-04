import { useRef } from "react";
import { reviews } from "../data";

export default function Reviews() {
  const row = useRef(null);
  const scroll = (dir) =>
    row.current.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section id="reviews" className="section section--big">
      <div className="container">
        <div className="two-col">
          <div>
            <p className="eyebrow">Loved by Plant Enthusiasts</p>
            <h2 className="big">What Our Customers Are Saying</h2>
          </div>
          <p className="lead">Write a short paragraph about your customers here, in your own words.</p>
        </div>

        <div className="reviews-row" ref={row}>
          {reviews.map((r, i) => (
            <figure key={i} className="review">
              <blockquote>{r.text}</blockquote>
              <div className="stars">★★★★★</div>
              <figcaption>{r.name} ✔</figcaption>
            </figure>
          ))}
        </div>

        <div className="arrows">
          <button onClick={() => scroll(-1)} aria-label="Previous">‹</button>
          <button onClick={() => scroll(1)} aria-label="Next">›</button>
        </div>
      </div>
    </section>
  );
}