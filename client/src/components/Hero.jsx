import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import {
  Sun,
  Moon,
  ArrowRight,
  Play,
  Leaf,
  Sparkles,
  FlaskConical,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../Style/Hero.css";

// Ready-to-use online images
const DAY_IMAGE =
  "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2400&q=90";

const NIGHT_IMAGE =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=2400&q=90";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${10 + ((index * 37) % 85)}%`,
  top: `${10 + ((index * 23) % 80)}%`,
}));

const features = [
  { icon: <Leaf size={25} />, title: "Real, Living Plant" },
  { icon: <Sparkles size={25} />, title: "Naturally Glows at Night" },
  { icon: <FlaskConical size={25} />, title: "No Electricity Required" },
  { icon: <Heart size={25} />, title: "Easy to Grow at Home" },
];

export default function Hero() {
  const heroRef = useRef(null);
  const sliderTween = useRef(null);
  const textRef = useRef(null);

  const [sliderValue, setSliderValue] = useState(100);
  const [mode, setMode] = useState("day");

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(".hero-eyebrow", {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-title span",
          {
            y: 70,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
          },
          "-=0.4",
        )
        .from(
          ".hero-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5",
        )
        .from(
          ".hero-buttons",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5",
        )
        .from(
          ".hero-feature",
          {
            x: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
          },
          "-=0.5",
        )
        .from(
          ".hero-award, .hero-scroll",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.4",
        );

      gsap.to(".slider__day img", {
        scale: 1.08,
        duration: 18,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".slider__night img", {
        scale: 1.08,
        duration: 18,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".glow-particle", {
        y: -25,
        opacity: 0.3,
        duration: 2.5,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => {
      sliderTween.current?.kill();
      ctx.revert();
    };
  }, []);

  // Animate text when mode changes
  useEffect(() => {
    if (!textRef.current) return;

    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      },
    );
  }, [mode]);

  // Drag image comparison
  const updateSlider = (value) => {
    sliderTween.current?.kill();

    const newValue = Number(value);

    setSliderValue(newValue);
    setMode(newValue >= 50 ? "day" : "night");
  };

  // Day / Night switch
  const changeMode = (selectedMode) => {
    sliderTween.current?.kill();

    setMode(selectedMode);

    const targetValue = selectedMode === "day" ? 100 : 0;

    const animation = {
      value: sliderValue,
    };

    sliderTween.current = gsap.to(animation, {
      value: targetValue,
      duration: 1.2,
      ease: "power3.inOut",

      onUpdate: () => {
        setSliderValue(animation.value);
      },
    });
  };

  const isDay = mode === "day";

  return (
    <section className="hero" ref={heroRef}>
      {/* DAY AND NIGHT BACKGROUND */}

      <div className="slider">
        <div className="slider__day">
          <img src={DAY_IMAGE} alt="Beautiful green plants in daylight" />
        </div>

        <div
          className="slider__night"
          style={{
            clipPath: `inset(0 0 0 ${sliderValue}%)`,
          }}
        >
          <img src={NIGHT_IMAGE} alt="Botanical plants at night" />
        </div>

        {/* NIGHT GLOW PARTICLES */}

        <div className="hero-particles">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="glow-particle"
              style={{
                left: particle.left,
                top: particle.top,
              }}
            />
          ))}
        </div>
      </div>

      {/* DAY NIGHT BUTTONS */}

      <div className="day-night">
        <button
          type="button"
          className={isDay ? "active" : ""}
          onClick={() => changeMode("day")}
        >
          <Sun size={19} />
          Day
        </button>

        <button
          type="button"
          className={!isDay ? "active" : ""}
          onClick={() => changeMode("night")}
        >
          <Moon size={19} />
          Night
        </button>
      </div>

      {/* IMAGE COMPARISON LINE */}

      <div className="slider__line" style={{ left: `${sliderValue}%` }}>
        <span>
          <ChevronLeft size={17} />
          <ChevronRight size={17} />
        </span>
      </div>

      {/* SLIDER INPUT */}

      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => updateSlider(e.target.value)}
        className="hero-comparison-input"
        aria-label="Compare day and night plants"
      />

      {/* HERO TEXT */}

      <div className="hero-content">
        <div className="hero-left" ref={textRef}>
          <p className="hero-eyebrow">
            {isDay
              ? "THE BEAUTY OF LIVING NATURE"
              : "WHEN NATURE MEETS THE NIGHT"}
          </p>

          <h1 className="hero-title">
            {isDay ? (
              <>
                <span>Naturally</span>
                <span>
                  <i>Alive</i> Plants
                </span>
              </>
            ) : (
              <>
                <span>Magically</span>
                <span>
                  <i>Glowing</i> Plants
                </span>
              </>
            )}
          </h1>

          <p className="hero-description">
            {isDay
              ? "Bring nature closer to home. Discover beautiful living plants that fill your space with freshness, colour and life."
              : "When darkness falls, nature awakens. Discover the extraordinary beauty of luminous plants and experience a magical glow."}
          </p>

          <div className="hero-buttons">
            <a href="/shop" className="hero-primary-btn">
              {isDay ? "Explore Plants" : "Discover the Glow"}
              <ArrowRight size={19} />
            </a>

            <a href="#how-it-works" className="hero-secondary-btn">
              <Play size={17} />
              {isDay ? "Explore Nature" : "Watch the Magic"}
            </a>
          </div>
        </div>
      </div>

      {/* FEATURES */}

      <div className="hero-features">
        {features.map((feature, index) => (
          <div className="hero-feature" key={index}>
            <div className="hero-feature-icon">{feature.icon}</div>

            <p>{feature.title}</p>
          </div>
        ))}
      </div>

      {/* AWARD */}

      <div className="hero-award">
        <Leaf size={28} />

        <p>
          AWARD INSPIRED
          <br />
          EXPERIENCE
        </p>
      </div>

      {/* SCROLL INDICATOR */}

      <a href="#happening" className="hero-scroll">
        SCROLL TO EXPLORE
        <span />
      </a>
    </section>
  );
}
