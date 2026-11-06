import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Leaf,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";
import "../Style/FAQSection.css";

const faqGroups = [
  {
    category: "PLANTS & SELECTION",
    number: "01",
    questions: [
      {
        question: "How do I choose the right plant for my home?",
        answer:
          "Consider the sunlight, available space, temperature and time you can spend caring for your plant. Our plant collection includes options for different homes and lifestyles.",
      },
      {
        question: "Which plants are best for beginners?",
        answer:
          "Snake plants, pothos, ZZ plants and some succulents are popular beginner-friendly choices. They are generally forgiving when it comes to everyday care.",
      },
      {
        question: "Can I keep plants indoors?",
        answer:
          "Absolutely. Many plants grow beautifully indoors. Choose varieties that suit the natural light and conditions in your room.",
      },
      {
        question: "Do you sell indoor and outdoor plants?",
        answer:
          "Our collection includes different plant categories. Check the individual product description to understand where each plant grows best.",
      },
    ],
  },
  {
    category: "PLANT CARE",
    number: "02",
    questions: [
      {
        question: "How often should I water my plants?",
        answer:
          "Watering frequency depends on the plant, season, pot and environment. Check the soil before watering instead of following a fixed daily schedule.",
      },
      {
        question: "How much sunlight do plants need?",
        answer:
          "Different plants need different light conditions. Some prefer bright indirect light, while others tolerate lower-light environments.",
      },
      {
        question: "Why are my plant leaves turning yellow?",
        answer:
          "Yellow leaves can be caused by overwatering, underwatering, poor drainage, insufficient light or natural ageing. Check the soil and growing conditions first.",
      },
      {
        question: "Do plants need fertiliser?",
        answer:
          "Many plants benefit from suitable fertiliser during their active growing season. Follow the product instructions and avoid over-fertilising.",
      },
    ],
  },
  {
    category: "ORDERS & DELIVERY",
    number: "03",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse the collection, select the products you like, add them to your cart and follow the checkout instructions.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times depend on your location and the product. Check the delivery information during checkout for the available estimate.",
      },
      {
        question: "Can I track my order?",
        answer:
          "If tracking is available for your order, use the tracking information shared with your order confirmation or account.",
      },
      {
        question: "What if my plant arrives damaged?",
        answer:
          "Please contact customer support with your order details and clear photographs of the package and plant so the issue can be reviewed.",
      },
    ],
  },
  {
    category: "PAYMENTS & SUPPORT",
    number: "04",
    questions: [
      {
        question: "Which payment methods are accepted?",
        answer:
          "Available payment methods are displayed during checkout. Select the payment option that works best for you.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Cancellation depends on the order's processing and shipping status. Contact support as soon as possible if you need help.",
      },
      {
        question: "Do you provide plant care instructions?",
        answer:
          "Yes. Check the product details and plant care information on our website for guidance about sunlight, watering and maintenance.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "Use the Contact Us page on our website to reach the support team with your questions.",
      },
    ],
  },
];

export default function FAQSection() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(0);

  const currentGroup = faqGroups[activeGroup];

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <div className="faq-topbar">
          <Link to="/" className="faq-back">
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>

          <span className="faq-brand">
            <Leaf size={17} /> lights.bio
          </span>

          <span className="faq-top-number">HELP CENTRE / 2026</span>
        </div>

        <div className="faq-hero-content">
          <span className="faq-eyebrow">
            <span /> HERE TO HELP YOU GROW
          </span>

          <h1>
            Questions?
            <br />
            <span>We've got you.</span>
          </h1>

          <p>
            Everything you need to know about choosing plants, caring for them
            and shopping with us.
          </p>

          <div className="faq-hero-bottom">
            <span>16 ANSWERS TO EXPLORE</span>
            <span>SCROLL TO DISCOVER ↓</span>
          </div>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-content-heading">
          <div>
            <span className="faq-dark-eyebrow">YOUR QUESTIONS, ANSWERED</span>
            <h2>
              A little more
              <br />
              <em>clarity.</em>
            </h2>
          </div>

          <p>
            New to plants or already growing your own little jungle? Find useful
            answers right here.
          </p>
        </div>

        <div className="faq-main-layout">
          <aside className="faq-categories">
            <span className="faq-category-label">EXPLORE TOPICS</span>

            {faqGroups.map((group, index) => (
              <button
                key={group.number}
                className={activeGroup === index ? "active" : ""}
                onClick={() => {
                  setActiveGroup(index);
                  setOpenQuestion(0);
                }}
              >
                <span>{group.number}</span>
                {group.category}
                <ArrowUpRight size={16} />
              </button>
            ))}

            <div className="faq-help-card">
              <MessageCircle size={23} />
              <h3>Still curious?</h3>
              <p>
                Can't find the answer you're looking for? We'd love to help.
              </p>
              <Link to="/contact">
                CONTACT US <ArrowUpRight size={15} />
              </Link>
            </div>
          </aside>

          <div className="faq-questions">
            <div className="faq-group-heading">
              <span>{currentGroup.number} / 04</span>
              <h3>{currentGroup.category}</h3>
            </div>

            {currentGroup.questions.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <article
                  className={`faq-full-item ${isOpen ? "is-open" : ""}`}
                  key={item.question}
                >
                  <button
                    className="faq-full-question"
                    onClick={() => setOpenQuestion(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-full-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="faq-full-title">{item.question}</span>

                    <span className="faq-full-icon">
                      {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                    </span>
                  </button>

                  <div className="faq-full-answer">
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="faq-bottom-note">
              <Leaf size={18} />
              <span>GOOD THINGS GROW WITH A LITTLE KNOWLEDGE.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-footer-cta">
        <span>LET'S KEEP THINGS GROWING</span>
        <h2>
          Still have
          <br />
          <em>questions?</em>
        </h2>
        <p>We're always happy to help you find your way.</p>
        <Link to="/contact">
          GET IN TOUCH <ArrowUpRight size={17} />
        </Link>
      </section>
    </main>
  );
}
