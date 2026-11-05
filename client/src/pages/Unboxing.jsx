import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play, Download, Leaf } from "lucide-react";
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

const guides = [
  {
    number: "01",
    category: "WATCH & LEARN",
    title: "See the unboxing experience",
    description:
      "Watch how your plant arrives, how to unpack it, and what to do when it reaches your home.",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=85",
    button: "Watch on YouTube",
    href: "https://www.youtube.com/",
    type: "youtube",
  },
  {
    number: "02",
    category: "DOWNLOAD THE GUIDE",
    title: "Your plant care handbook",
    description:
      "Keep a simple plant care reference close by with useful guidance for your new green companion.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=85",
    button: "Download PDF",
    href: "/files/plant-care-guide.pdf",
    type: "pdf",
  },
  {
    number: "03",
    category: "FIND YOUR NEXT PLANT",
    title: "Make room for more green",
    description:
      "Explore our collection and discover another plant to make your space feel more alive.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=85",
    button: "Explore plants",
    href: "/products",
    type: "shop",
  },
];

export default function Unboxing() {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      // HERO ENTRANCE
      gsap.from(
        ".unbox-hero__eyebrow, .unbox-hero h1, .unbox-hero h4, .unbox-hero__description",
        {
          y: 45,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        },
      );

      // TEXT CARDS REVEAL
      gsap.from(".unbox-step", {
        y: 65,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".unbox-steps__grid",
          start: "top 82%",
          once: true,
        },
      });

      // VIDEO GROWS FROM SMALL TO LARGE WHILE SCROLLING
      gsap.fromTo(
        ".unbox-video__frame",
        {
          scale: 0.72,
          borderRadius: "28px",
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

      // VIDEO TEXT REVEAL
      gsap.from(".unbox-video__heading", {
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".unbox-video__heading",
          start: "top 88%",
          once: true,
        },
      });

      // GUIDE CARDS
      gsap.from(".unbox-guide", {
        y: 70,
        opacity: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".unbox-guides__grid",
          start: "top 82%",
          once: true,
        },
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <main className="unbox-page" ref={pageRef}>
     
      {/* SIX TEXT CARDS */}

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
            experience.
          </p>
        </div>

        <div className="unbox-steps__grid">
          {unboxingSteps.map((step) => (
            <article className="unbox-step" key={step.number}>
              <div className="unbox-step__top">
                <span>{step.number}</span>
                <Leaf size={18} strokeWidth={1.3} />
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>

              <div className="unbox-step__line" />
            </article>
          ))}
        </div>
      </section>

      {/* SCROLL VIDEO */}

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
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Plant unboxing experience"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <span className="unbox-video__caption">
            LIGHTS.BIO — THE UNBOXING FILM
          </span>
        </div>
      </section>

      {/* THREE IMAGE GUIDES */}

      <section className="unbox-guides">
        <div className="unbox-guides__heading">
          <div>
            <span className="unbox-label">KEEP EXPLORING</span>
            <h2>
              More ways to
              <br />
              <em>grow together.</em>
            </h2>
          </div>

          <p>Helpful resources for every step of your plant journey.</p>
        </div>

        <div className="unbox-guides__grid">
          {guides.map((guide) => (
            <article className="unbox-guide" key={guide.number}>
              <div className="unbox-guide__image">
                <img src={guide.image} alt={guide.title} loading="lazy" />

                <span className="unbox-guide__number">{guide.number}</span>

                {guide.type === "youtube" && (
                  <span className="unbox-guide__play">
                    <Play size={23} fill="currentColor" />
                  </span>
                )}
              </div>

              <div className="unbox-guide__content">
                <span className="unbox-guide__category">{guide.category}</span>

                <h3>{guide.title}</h3>

                <p>{guide.description}</p>

                {guide.type === "pdf" ? (
                  <a className="unbox-guide__button" href={guide.href} download>
                    {guide.button}
                    <Download size={16} />
                  </a>
                ) : guide.type === "shop" ? (
                  <Link className="unbox-guide__button" to={guide.href}>
                    {guide.button}
                    <ArrowUpRight size={16} />
                  </Link>
                ) : (
                  <a
                    className="unbox-guide__button"
                    href={guide.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {guide.button}
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="unbox-final">
        <span className="unbox-label">YOUR NEXT GREEN CHAPTER</span>

        <h2>
          Ready to bring
          <br />
          <em>nature home?</em>
        </h2>

        <Link to="/products" className="unbox-final__button">
          Explore the collection
          <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
