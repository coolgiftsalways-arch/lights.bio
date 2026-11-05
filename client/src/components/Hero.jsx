import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sun, Moon, ArrowDownRight, Leaf } from "lucide-react";
import "../Style/Hero.css";

export default function Hero() {
  const [split, setSplit] = useState(50);
  const heroRef = useRef(null);
  const manualRef = useRef(false);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        ".hero-eyebrow, .hero-title, .hero-description, .hero-actions",
        {
          y: 20,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
      );

      gsap.from(".hero-switch, .hero-bottom", {
        opacity: 0,
        y: 12,
        duration: 0.8,
        delay: 0.6,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mobile automatic Day/Night transition
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    let timer;

    const handleScreen = () => {
      clearInterval(timer);

      if (media.matches) {
        setSplit(100);

        timer = setInterval(() => {
          if (!manualRef.current) {
            setSplit((current) => (current === 100 ? 0 : 100));
          }
        }, 2000);
      } else {
        setSplit(50);
      }
    };

    handleScreen();
    media.addEventListener("change", handleScreen);

    return () => {
      clearInterval(timer);
      media.removeEventListener("change", handleScreen);
    };
  }, []);

  const changeScene = (value) => {
    manualRef.current = true;
    setSplit(value);

    if (window.matchMedia("(max-width: 768px)").matches) {
      setTimeout(() => {
        manualRef.current = false;
      }, 5000);
    }
  };

  return (
    <main className="hero" ref={heroRef} style={{ "--split": `${split}%` }}>
      {/* DAY BACKGROUND */}
      <div className="hero-day">
        <img
          src="/Hero/Day.png"
          className="hero-background"
          alt="Daytime garden"
        />
        <div className="day-light-glow" />
      </div>

      {/* NIGHT BACKGROUND */}
      <div className="hero-night">
        <img
          src="/Hero/Night.png"
          className="hero-background"
          alt="Nighttime garden"
        />

        {/* Moonlight PNG appears ONLY on Night */}
        <img
          src="/Hero/moonlight.png"
          className="moonlight-overlay"
          alt=""
          aria-hidden="true"
        />

        <div className="night-light-glow" />
      </div>

      {/* TEXT CONTRAST */}
      <div className="hero-shade" />

      {/* MAIN CONTENT */}
      <section className="hero-copy">
        <div className="hero-eyebrow">
          <span />
          BRING NATURE CLOSER
          <span />
        </div>

        <h1 className="hero-title">
          A little more
          <br />
          <em>life.</em> A little
          <br />
          more green.
        </h1>

        <p className="hero-description">
          Bring home the beauty of nature.
          <br />
          Discover plants that make every space feel alive.
        </p>

        <div className="hero-actions">
          <a href="/shop" className="hero-primary-btn">
            Discover the collection
            <ArrowDownRight size={15} />
          </a>

          <a href="#story" className="hero-secondary-btn">
            Our philosophy
          </a>
        </div>
      </section>

      {/* DAY LABEL */}
      <div
        className="hero-side-label hero-day-label"
        style={{ opacity: split / 100 }}
      >
        <Sun size={15} />
        <span>DAYLIGHT</span>
        <small>GROW WITH THE SUN</small>
      </div>

      {/* NIGHT LABEL */}
      <div
        className="hero-side-label hero-night-label"
        style={{ opacity: (100 - split) / 100 }}
      >
        <Moon size={15} />
        <span>MOONLIGHT</span>
        <small>REST WITH THE NIGHT</small>
      </div>

      {/* BOTTOM INFORMATION */}
      <div className="hero-bottom">
        <div className="hero-bottom-left">
          <span className="hero-scroll-line" />
          SCROLL TO EXPLORE
        </div>

        <div className="hero-bottom-right">
          <Leaf size={12} />
          DESIGNED BY NATURE
        </div>
      </div>

      {/* DAY / NIGHT SWITCH */}
      <div className="hero-switch">
        <button
          type="button"
          className={split === 100 ? "active" : ""}
          onClick={() => changeScene(100)}
        >
          <Sun size={14} />
          Day
        </button>

        <button
          type="button"
          className={split === 0 ? "active" : ""}
          onClick={() => changeScene(0)}
        >
          <Moon size={14} />
          Night
        </button>
      </div>

      {/* CENTRE DIVIDER */}
      <div className="hero-divider">
        <div className="divider-line" />

        <div className="divider-handle">
          <Leaf size={18} />
        </div>
      </div>

      {/* DESKTOP DRAG CONTROL */}
      <input
        className="hero-range"
        type="range"
        min="0"
        max="100"
        value={split}
        onChange={(e) => changeScene(Number(e.target.value))}
        aria-label="Compare Day and Night"
      />
    </main>
  );
}
