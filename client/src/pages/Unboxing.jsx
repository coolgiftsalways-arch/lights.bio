import { useEffect, useRef, useState } from "react";
import { Leaf, Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../Style/Unboxing.css";

gsap.registerPlugin(ScrollTrigger);

const unboxingSteps = [
  {
    number: "01",
    title: "A little excitement",
    text: "Your new plant journey begins the moment your package arrives. Every order is prepared with care and attention.",
  },
  {
    number: "02",
    title: "Carefully packed",
    text: "We protect your plant with thoughtful packaging designed to help it travel safely to your doorstep.",
  },
  {
    number: "03",
    title: "Open with care",
    text: "Remove the outer packaging gently. Take your time and avoid pulling or bending the leaves and stems.",
  },
  {
    number: "04",
    title: "Meet your plant",
    text: "Give your plant a moment to settle. A little patience helps it adjust to its new surroundings.",
  },
  {
    number: "05",
    title: "Find its place",
    text: "Choose a suitable spot with the right light and enough room for your plant to grow beautifully.",
  },
  {
    number: "06",
    title: "Let it grow",
    text: "Follow the care instructions, water when needed, and enjoy bringing a little more nature into your home.",
  },
];

export default function Unboxing() {
  const pageRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Play the video while it's on screen, pause when the user scrolls away.
  // (Browsers only allow autoplay when the video starts muted.)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => video.play().catch(() => {});
    tryPlay(); // start right away when the page opens

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      // HEADING ANIMATION
      gsap.from(".unbox-section-heading .unbox-label", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".unbox-section-heading h2", {
        y: 65,
        opacity: 0,
        duration: 1,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".unbox-section-heading p", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });

      // SIX STEP CARDS
      gsap.from(".unbox-step", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".unbox-steps__grid",
          start: "top 82%",
          once: true,
        },
      });

      // VIDEO HEADING
      gsap.from(".unbox-video__heading > *", {
        y: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".unbox-video__heading",
          start: "top 85%",
          once: true,
        },
      });

      // CINEMATIC VIDEO SCROLL ANIMATION
      gsap.fromTo(
        ".unbox-video__frame",
        {
          scale: 0.85,
          borderRadius: "25px",
        },
        {
          scale: 1,
          borderRadius: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: ".unbox-video",
            start: "top 85%",
            end: "center center",
            scrub: 1,
          },
        },
      );
    }, page);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className="unbox-page" ref={pageRef}>
      {/* SIX UNBOXING STEPS */}

      <section className="unbox-steps" id="unboxing-steps">
        <div className="unbox-section-heading">
          <span className="unbox-label">A SIMPLE LITTLE GUIDE</span>

          <h2>
            From our hands
            <br />
            <em>to your home.</em>
          </h2>

          <p>
            Six little steps to make your plant's arrival a beautiful
            experience. Unwrap, discover, and let something beautiful grow.
          </p>
        </div>

        <div className="unbox-steps__grid">
          {unboxingSteps.map((step) => (
            <article className="unbox-step" key={step.number}>
              <div className="unbox-step__top">
                <span>{step.number}</span>
                <Leaf size={20} strokeWidth={1.3} />
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>

              <div className="unbox-step__line" />
            </article>
          ))}
        </div>
      </section>

      {/* UNBOXING VIDEO */}

      <section className="unbox-video">
        <div className="unbox-video__heading">
          <span className="unbox-label">SEE IT FOR YOURSELF</span>

          <h2>
            Unbox the
            <em> happiness.</em>
          </h2>

          <p>
            A closer look at how your new favourite green companion arrives.
          </p>
        </div>

        <div className="unbox-video__frame">
          <video
            ref={videoRef}
            className="unbox-video__player"
            src="/unboxingvideo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Plant unboxing experience"
          />

          <button
            type="button"
            className="unbox-video__sound"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{muted ? "Tap for sound" : "Sound on"}</span>
          </button>

          <span className="unbox-video__caption">
            PLANT COLLECTION — THE UNBOXING FILM
          </span>
        </div>
      </section>
    </main>
  );
}
