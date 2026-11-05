import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Leaf,
  Sun,
  Droplets,
  Sprout,
  Scissors,
  FlaskConical,
  Ruler,
  ThermometerSun,
  ShieldCheck,
  Wind,
  Download,
  Play,
  Flower2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../Style/CareInstructions.css";

gsap.registerPlugin(ScrollTrigger);

const careItems = [
  {
    number: "01",
    title: "When Your Plants Arrive",
    icon: Sprout,
    description:
      "Give your new plant a gentle welcome. Starter plants should be planted soon after arrival, up to three in an 8-to-12-inch container. Keep the compostable paper lining around the roots during transplanting to help protect and aerate them.",
    extra:
      "Potted plants arrive ready for display in their pot. Remove any protective shipping paper covering the soil. If the glow of a Firefly Petunia appears faint, give it several days of sunlight to support its natural glow.",
  },
  {
    number: "02",
    title: "Fertilizer",
    icon: FlaskConical,
    description:
      "Petunias are heavy feeders and benefit from regular fertilization. Use a petunia-specific plant food with essential micronutrients to support healthy leaves and continuous flowering.",
    extra:
      "If using an alternative fertilizer, choose a petunia-specific formula containing chelated iron. Always follow the product's recommended dilution and feeding instructions.",
  },
  {
    number: "03",
    title: "Deadheading & Pruning",
    icon: Scissors,
    description:
      "Remove faded flowers to keep your plant looking tidy and encourage fresh growth. Trim leggy or browning stems to help your plant develop a fuller, bushier shape.",
    extra:
      "For Firefly Petunias, removing older blooms can also help keep newer, brighter glowing flowers visible.",
  },
  {
    number: "04",
    title: "Spacing",
    icon: Ruler,
    description:
      "Give each plant enough room to breathe. Space Firefly Petunias around 6 to 8 inches apart and trial varieties around 8 to 10 inches apart.",
    extra:
      "Good spacing improves air circulation and gives each plant room to develop its natural shape.",
  },
  {
    number: "05",
    title: "Soil",
    icon: Sprout,
    description:
      "Choose a well-draining potting mix with a neutral to slightly acidic pH. For containers and hanging baskets, use a quality potting mix containing materials such as peat moss and perlite or vermiculite.",
    extra:
      "Avoid compacted soil and containers without drainage holes. Healthy roots need both moisture and access to air.",
  },
  {
    number: "06",
    title: "Sunlight",
    icon: Sun,
    description:
      "Firefly Petunias thrive in full sun and generally need around 6 to 12 hours of direct sunlight daily for optimal growth and glow.",
    extra:
      "They can tolerate partial shade, but reduced sunlight may affect flowering and the intensity of their bioluminescence.",
  },
  {
    number: "07",
    title: "Watering",
    icon: Droplets,
    description:
      "Keep the soil consistently moist without making it waterlogged. Check the soil regularly, especially when plants are in containers or during hot, dry weather.",
    extra:
      "Water the soil rather than repeatedly soaking the flowers and leaves. Make sure excess water can drain away freely.",
  },
  {
    number: "08",
    title: "Temperature & Humidity",
    icon: ThermometerSun,
    description:
      "Petunias are suited to spring and summer growing conditions. They generally grow best in cool-to-warm temperatures with suitable airflow.",
    extra:
      "Protect plants from excessive heat and freezing temperatures. Check your local growing conditions when choosing an outdoor location.",
  },
  {
    number: "09",
    title: "Pests & Disease",
    icon: ShieldCheck,
    description:
      "Keep an eye out for common pests such as aphids, whiteflies and spider mites. Inspect leaves and stems regularly so you can spot problems early.",
    extra:
      "Avoid overly wet conditions, provide good air circulation and avoid frequent overhead watering to help reduce the risk of fungal disease.",
  },
];

const resources = [
  {
    number: "01",
    image:
      "https://light.bio/cdn/shop/files/Light_Bio_Care_Videos_png_c59b16d5-4792-47b1-b0cb-880daad78da9.jpg?v=1776858263&width=1200",
    icon: Play,
    category: "WATCH & LEARN",
    title: "Learn with our care videos",
    description:
      "Watch helpful videos and discover simple ways to keep your plants happy and healthy.",
    button: "Watch on YouTube",
    url: "https://www.youtube.com/@light-bio/videos",
    external: true,
  },
  {
    number: "02",
    image:
      "https://light.bio/cdn/shop/files/Light_Bio_Firefly_Petunia_Care_Instructions_99e9aa7b-b88b-40f5-9efd-851cdf22e1ff.png?v=1772458478&width=1200",
    icon: Download,
    category: "CARE HANDBOOK",
    title: "Firefly Petunia instructions",
    description:
      "Keep the detailed Firefly Petunia care guide nearby for easy reference.",
    button: "View PDF guide",
    url: "https://drive.google.com/file/d/1bydK9xtT6Qb4VRDiclHhKhbPYdS_Aatf/view?usp=sharing",
    external: true,
  },
  {
    number: "03",
    image:
      "https://light.bio/cdn/shop/files/Light_Bio_Trial_Varieties_Info.png?v=1772458405&width=1200",
    icon: Flower2,
    category: "PLANT INFORMATION",
    title: "Trial varieties information",
    description:
      "Explore the trial varieties information card and learn more about their growing needs.",
    button: "View information",
    url: "https://drive.google.com/file/d/1pe0LDAD95EciExktqKB37yY0Nl2FRA1E/view?usp=sharing",
    external: true,
  },
];

function CarePlant({ className = "" }) {
  return (
    <svg
      className={`care-plant ${className}`}
      viewBox="0 0 340 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        className="care-plant__stem"
        d="M170 455 C160 360 185 290 165 205 C150 135 170 70 170 12"
        stroke="#8EAD6B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="care-plant__stem"
        d="M165 340 C120 295 85 280 35 270"
        stroke="#8EAD6B"
        strokeWidth="2.5"
      />
      <path
        className="care-plant__stem"
        d="M170 270 C220 230 260 215 310 210"
        stroke="#8EAD6B"
        strokeWidth="2.5"
      />
      <path
        className="care-plant__stem"
        d="M160 190 C115 155 90 125 75 85"
        stroke="#8EAD6B"
        strokeWidth="2.5"
      />
      <path
        className="care-plant__stem"
        d="M170 120 C215 90 240 60 255 30"
        stroke="#8EAD6B"
        strokeWidth="2.5"
      />

      <g className="care-plant__leaf">
        <path
          d="M35 270 C-15 220 5 170 65 195 C100 220 80 255 35 270Z"
          fill="#789B60"
        />
        <path d="M35 270 Q35 225 65 195" stroke="#B7CE91" strokeWidth="1.5" />
      </g>

      <g className="care-plant__leaf">
        <path
          d="M310 210 C355 160 340 115 280 145 C250 175 270 200 310 210Z"
          fill="#91AD72"
        />
        <path
          d="M310 210 Q310 170 280 145"
          stroke="#C5D6A5"
          strokeWidth="1.5"
        />
      </g>

      <g className="care-plant__leaf">
        <path
          d="M75 85 C20 55 25 10 95 25 C125 50 105 75 75 85Z"
          fill="#A6C583"
        />
        <path d="M75 85 Q75 50 95 25" stroke="#D0E1B1" strokeWidth="1.5" />
      </g>

      <g className="care-plant__leaf">
        <path
          d="M255 30 C300 -15 335 10 300 65 C275 85 255 60 255 30Z"
          fill="#6F9658"
        />
        <path d="M255 30 Q285 25 300 65" stroke="#B7CE91" strokeWidth="1.5" />
      </g>

      <g className="care-plant__leaf">
        <path
          d="M170 12 C120 -25 100 10 135 55 C160 75 175 45 170 12Z"
          fill="#B4CC8D"
        />
        <path d="M170 12 Q140 25 135 55" stroke="#D0E1B1" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function CareInstructions() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      // HERO TEXT
      gsap.from(".care-hero__eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".care-hero__title span", {
        y: 90,
        opacity: 0,
        stagger: 0.16,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.from(".care-hero__description", {
        y: 25,
        opacity: 0,
        delay: 0.4,
        duration: 0.9,
      });

      // DRAW SVG STEMS
      gsap.utils.toArray(".care-plant__stem").forEach((stem, index) => {
        const length = stem.getTotalLength();

        gsap.set(stem, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(stem, {
          strokeDashoffset: 0,
          duration: 2.1,
          delay: index * 0.13,
          ease: "power2.out",
        });
      });

      // UNFOLD SVG LEAVES
      gsap.set(".care-plant__leaf", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center bottom",
      });

      gsap.to(".care-plant__leaf", {
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        delay: 0.7,
        duration: 1,
        ease: "back.out(1.6)",
      });

      // GENTLE PLANT SWAY
      gsap.to(".care-plant", {
        rotation: 2.5,
        transformOrigin: "50% 100%",
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // FLOATING LEAVES IN BACKGROUND
      gsap.utils.toArray(".care-floating-leaf").forEach((leaf, index) => {
        gsap.to(leaf, {
          y: index % 2 === 0 ? -35 : 35,
          x: index % 2 === 0 ? 18 : -18,
          rotation: index % 2 === 0 ? 35 : -35,
          duration: 4 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        });
      });

      // SECTION REVEALS
      gsap.utils.toArray(".care-reveal").forEach((element) => {
        gsap.from(element, {
          y: 45,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      // CARE CARDS
      gsap.from(".care-card", {
        y: 45,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".care-grid",
          start: "top 85%",
          once: true,
        },
      });

      // RESOURCE CARDS
      gsap.from(".care-resource", {
        y: 55,
        opacity: 0,
        stagger: 0.18,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".care-resources__grid",
          start: "top 85%",
          once: true,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="care-page" ref={pageRef}>
      {/* HERO */}
      <section className="care-hero">
        <div className="care-hero__background" aria-hidden="true">
          <span className="care-floating-leaf care-floating-leaf--one" />
          <span className="care-floating-leaf care-floating-leaf--two" />
          <span className="care-floating-leaf care-floating-leaf--three" />
          <span className="care-floating-leaf care-floating-leaf--four" />
          <span className="care-floating-leaf care-floating-leaf--five" />
        </div>

        <div className="care-hero__content">
          <div className="care-hero__eyebrow">
            <Leaf size={15} />
            <span>THE ART OF PLANT CARE</span>
          </div>

          <h1 className="care-hero__title">
            <span>Grow with</span>
            <span className="care-hero__italic">a little care.</span>
          </h1>

          <p className="care-hero__description">
            Beautiful plants begin with thoughtful care. Discover simple ways to
            help your green companions flourish, bloom and become part of your
            everyday life.
          </p>

          <a href="#care-guide" className="care-hero__button">
            EXPLORE THE CARE GUIDE
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="care-hero__plant">
          <CarePlant />
        </div>

        <div className="care-hero__side-label">
          A GUIDE TO GROWING BEAUTIFULLY
        </div>

        <div className="care-hero__footer">
          <span>PLANT CARE / 001</span>
          <span>GROW SOMETHING BEAUTIFUL</span>
        </div>
      </section>

      {/* INTRO */}
      <section className="care-intro care-reveal" id="care-guide">
        <span className="care-kicker">A LITTLE KNOWLEDGE GOES A LONG WAY</span>
        <h2>
          Happy plants.
          <br />
          <em>Happier spaces.</em>
        </h2>
        <p>
          From the first day at home to the first new bloom, a few thoughtful
          habits can make all the difference. Here's everything you need to know
          about caring for your Firefly Petunias.
        </p>
      </section>

      {/* CARE INSTRUCTIONS */}
      <section className="care-instructions">
        <div className="care-section-heading care-reveal">
          <div>
            <span className="care-kicker">THE ESSENTIALS</span>
            <h2>Everything your plant needs.</h2>
          </div>
          <span className="care-section-count">09 / CARE NOTES</span>
        </div>

        <div className="care-grid">
          {careItems.map((item) => {
            const Icon = item.icon;

            return (
              <article className="care-card" key={item.number}>
                <div className="care-card__top">
                  <span className="care-card__number">{item.number}</span>
                  <span className="care-card__icon">
                    <Icon size={23} strokeWidth={1.5} />
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="care-card__extra">{item.extra}</p>

                <div className="care-card__bottom">
                  <span>PLANT CARE GUIDE</span>
                  <Leaf size={15} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* RESOURCE CARDS */}
      <section className="care-resources">
        <div className="care-resources__heading care-reveal">
          <span className="care-kicker">KEEP LEARNING</span>
          <h2>
            A little more
            <br />
            <em>plant knowledge.</em>
          </h2>
          <p>
            Explore our videos and helpful guides. Everything you need to keep
            growing with confidence.
          </p>
        </div>

        <div className="care-resources__grid">
          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <article className="care-resource" key={resource.number}>
                <div className="care-resource__image">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    loading="lazy"
                  />
                  <span className="care-resource__number">
                    {resource.number}
                  </span>
                  <span className="care-resource__icon">
                    <Icon size={21} strokeWidth={1.6} />
                  </span>
                </div>

                <div className="care-resource__content">
                  <span className="care-kicker">{resource.category}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="care-resource__button"
                  >
                    {resource.button}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="care-cta">
        <div className="care-cta__plant">
          <CarePlant />
        </div>

        <span className="care-kicker">GROW AT YOUR OWN PACE</span>
        <h2>
          Good things
          <br />
          <em>take time to grow.</em>
        </h2>
        <p>
          Find your next favourite plant and make room for a little more green.
        </p>

        <a href="/products" className="care-cta__button">
          EXPLORE OUR PLANTS
          <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}
