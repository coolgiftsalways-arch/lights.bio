import { useState } from "react";
import Newsletter from "./Newsletter";

export default function Hero() {
  const [pos, setPos] = useState(50);

  return (
    <section id="top" className="hero">
      <div className="slider">
        <img src="/images/hero-day.jpg" alt="Plant in daylight" />
        <div className="slider__night" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src="/images/hero-night.jpg" alt="Plant glowing in the dark" />
        </div>
        <div className="slider__line" style={{ left: `${pos}%` }}>
          <span>|||</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(+e.target.value)}
          aria-label="Compare day and night"
        />
      </div>

      <div className="container intro">
        <div>
          <p className="intro__eyebrow">The wonder of living light</p>
          <h1>The World's First Naturally Glowing Plants</h1>
        </div>
        <div className="intro__text">
          <p>Write your first intro paragraph here, in your own words.</p>
          <p>Write your second intro paragraph here, in your own words.</p>
        </div>
      </div>

      <div className="container container--wide">
        <div className="banner">
          <div>
            <h2>The Magic is Resting Until Spring 2027</h2>
            <p>Write your short seasonal message here.</p>
          </div>
          <div>
            <p>Write a line about joining the waitlist here.</p>
            <Newsletter variant="banner" />
          </div>
        </div>
      </div>
    </section>
  );
}