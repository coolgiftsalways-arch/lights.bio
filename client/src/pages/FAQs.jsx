import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Plus,
  Search,
  Sparkles,
  Leaf,
} from "lucide-react";
import "../Style/FAQs.css";

const faqCategories = [
  {
    id: "glow",
    number: "01",
    name: "Glow & Brightness",
    description: "Everything about the living light.",
    questions: [
      {
        q: "Why is the glow faint upon arrival?",
        a: "It is normal for a plant to look dim immediately after unboxing. During shipping, it spends several days in darkness and may experience temporary shipping stress. Give it time to settle into its new environment, provide suitable sunlight, and follow its regular watering and feeding routine. Its glow may gradually become more noticeable as the plant recovers.",
      },
      {
        q: "Do bioluminescent petunias need special treatment to glow?",
        a: "No special sprays, chemicals or blacklights are needed. The plant produces its own light through bioluminescence. Your job is to keep it healthy with suitable sunlight, consistent watering, good drainage and regular nutrition. A healthier plant generally supports stronger visible glow.",
      },
      {
        q: "Which parts of the plant glow?",
        a: "The whole plant is bioluminescent, including its leaves, stems, buds and flowers. However, the newest growth and developing flower buds are usually the brightest. Older flowers may appear less luminous as they mature.",
      },
      {
        q: "How bright are they?",
        a: "The glow is soft and gentle, more like a subtle moonlit shimmer than a bright lamp. It is a natural living light, so it will not illuminate an entire room. The newest buds and flowers are often the best places to look.",
      },
      {
        q: "When do they glow?",
        a: "The plant produces light continuously, day and night. However, the glow is easiest for human eyes to notice in a very dark environment. Give your eyes around 5–10 minutes to adjust before deciding how bright the plant looks.",
      },
      {
        q: "What is the difference between bioluminescence and fluorescence?",
        a: "Bioluminescence is light produced by a living organism through an internal biological process. Fluorescence is different: it absorbs light from an external source and then emits light back. A bioluminescent plant creates its own light, while a fluorescent object needs an external light source.",
      },
      {
        q: "Is the glow chargeable paint or a chemical spray?",
        a: "No. The glow is biological, not paint, glitter, a surface coating or a chemical spray. It is produced within the plant itself. You do not need to apply anything to the leaves or flowers to make them glow.",
      },
      {
        q: "Does the glow ever run out?",
        a: "The bioluminescent trait is part of the plant's biology. It does not work like a glow-in-the-dark sticker that uses up a stored charge. The visible glow can still vary with the plant's health, age and growing conditions.",
      },
      {
        q: "What is the best way to experience the glow?",
        a: "Place the plant in a genuinely dark room or outdoor space away from streetlights and bright lamps. Switch off nearby lights and phone screens, then allow your eyes 5–10 minutes to adjust. Look closely at the newest buds and flowers for the most noticeable glow.",
      },
      {
        q: "What if my plant stops glowing?",
        a: "First, check the plant's overall health. Make sure it receives enough suitable sunlight, the soil stays lightly moist without becoming waterlogged, and it receives appropriate plant nutrition. Remove faded flowers and unhealthy growth when needed. If the plant is deteriorating, check for pests, root problems or environmental stress.",
      },
      {
        q: "Why does the glow look pale in person but vivid green in photos?",
        a: "Human eyes behave differently in very low light. They become more sensitive to brightness but less sensitive to colour, so a soft green glow may look pale or almost white. A camera can collect light over a longer exposure, making the green colour appear more vivid than it does to your eyes.",
      },
      {
        q: "How do I take a photo of the glow?",
        a: "Turn off the flash and remove nearby light sources. Use your phone's Night Mode, keep the camera completely still, and rest it on a stable surface or tripod. Focus on the newest glowing buds. If your camera has manual controls, experiment with a longer exposure and adjust ISO carefully. Every phone and environment is different, so take a few test shots.",
      },
    ],
  },
  {
    id: "varieties",
    number: "02",
    name: "Variety Characteristics",
    description: "Discover what makes every variety unique.",
    questions: [
      {
        q: "How do growth habits compare across Firefly Petunia varieties?",
        a: "Different varieties can have different shapes and growth habits. Some grow wider and spread across larger planters or hanging baskets, while others stay more compact and rounded. Check the individual product description for the expected mature size and recommended container.",
      },
      {
        q: "Why does my pink petunia glow differently than the white petunia?",
        a: "Petal colour can affect how the glow appears. Pink pigments may absorb some of the emitted light, making a pink variety appear softer or less bright than a white variety. Differences in flower age and growing conditions can also affect what you see.",
      },
      {
        q: "Why does my Pink Surprise change colour or look solid pink or white?",
        a: "Some patterned petunia varieties naturally produce flowers with different colour patterns. Sunlight, temperature and other growing conditions can influence the appearance of new blooms. A flower may appear mostly pink, mostly white or patterned.",
      },
      {
        q: "Is my Pink Surprise defective if one bloom is solid-coloured?",
        a: "Not necessarily. Individual flowers can vary in colour and pattern, even on the same plant. Watch the new blooms as they open. If the plant also shows signs of damage or poor health, contact the seller with clear photographs.",
      },
    ],
  },
  {
    id: "care",
    number: "03",
    name: "Care & Growing",
    description: "Simple habits for healthier plants.",
    questions: [
      {
        q: "Should I remove the compostable liner before planting?",
        a: "If your starter plant arrives in a compostable Ellepot-style liner, check the instructions supplied with your order. For the Light Bio starter plants, the liner is designed to be planted directly into the soil. Removing it unnecessarily can disturb delicate roots.",
      },
      {
        q: "Can I grow these plants indoors?",
        a: "Yes, if you can provide enough light. Place the plant near a bright window with suitable direct sunlight or use a suitable grow light. Indoor plants may grow more slowly or produce fewer flowers if their light requirements are not met.",
      },
      {
        q: "I live in a very hot climate. Can I still grow these?",
        a: "You may be able to grow them, but extreme heat can stress petunias. During very hot periods, consider growing them in containers so you can move them, providing morning sun and filtered light during the hottest hours. Check soil moisture more frequently in hot weather.",
      },
      {
        q: "Do I have to buy a specific fertilizer to make the plant glow?",
        a: "Not necessarily. Use a suitable fertilizer formulated for petunias and follow its label instructions. Light Bio recommends nutrition containing chelated iron for its Firefly Petunias. Fertilizer supports plant health; it is not a glow spray or a way to charge the plant.",
      },
      {
        q: "How often should I water?",
        a: "Check the soil regularly rather than following a rigid calendar. A useful starting point is to water when the top inch of soil feels dry. Water thoroughly, allow excess water to drain, and avoid leaving the roots sitting in water. Pots may dry out faster than garden beds.",
      },
      {
        q: "When should I repot the plant?",
        a: "Repot when roots begin emerging from the drainage holes, the plant becomes crowded, or the container dries out unusually quickly. Choose a pot with drainage holes and fresh, well-draining potting mix. Avoid disturbing the roots more than necessary.",
      },
      {
        q: "What is the ideal temperature?",
        a: "Light Bio lists approximately 65–75°F (18–24°C) as a preferred range for its Firefly Petunias. Protect plants from freezing temperatures, extreme heat and sudden temperature changes. Check the care guidance for your specific variety.",
      },
    ],
  },
  {
    id: "safety",
    number: "04",
    name: "Safety & Ecology",
    description: "Important information about responsible growing.",
    notice:
      "Authenticity notice: Light Bio states that its bioluminescent technology is offered in live plant form, not as authorized seeds. Check the original seller's terms and local regulations before purchasing or propagating any patented variety.",
    questions: [
      {
        q: "Are these plants safe for pets and children?",
        a: "Do not allow children or pets to eat the plant. Light Bio states that its petunias, like other petunias, are not intended for consumption. Keep plants out of reach of curious pets and young children, and contact a medical or veterinary professional if ingestion occurs.",
      },
      {
        q: "Can I propagate or breed these plants?",
        a: "Propagation and breeding rights depend on the variety's intellectual property rights and the seller's terms. Light Bio states that unauthorized propagation or breeding of its patented Firefly Petunias is prohibited. Always check the applicable licence and local rules.",
      },
      {
        q: "Why doesn't Light Bio sell seeds?",
        a: "Light Bio says it supplies established, rooted plants rather than seeds to maintain product quality and the consistency of its bioluminescent trait. Be cautious of third-party seed listings claiming to be genuine Firefly Petunia seeds.",
      },
      {
        q: "Are these plants safe for the environment and bees?",
        a: "Environmental and pollinator assessments are specific to the plant variety and the country where it is approved. Light Bio describes its Firefly Petunia as having undergone regulatory review in the United States. Do not assume that approval automatically applies in every country.",
      },
      {
        q: "Will glowing plants harm local firefly populations?",
        a: "Light Bio says the soft biological glow of its Firefly Petunia is not the same as bright artificial outdoor lighting. However, avoid making broad claims about all ecosystems or species. Follow local growing guidance and avoid releasing plants into natural habitats.",
      },
      {
        q: "Will other glowing plants like Pothos, Mums or Lilies be available?",
        a: "New bioluminescent plant varieties require research, development and testing. Availability depends on the breeder and the product release schedule. Follow the official seller's announcements for confirmed launches rather than relying on rumours.",
      },
    ],
  },
  {
    id: "shipping",
    number: "05",
    name: "Shipping & Delivery",
    description: "What to expect when your plant travels to you.",
    questions: [
      {
        q: "How can I order a plant as a gift?",
        a: "Enter the recipient's name and delivery address during checkout, if the store supports gift delivery. Double-check the address and contact details before placing the order. If you want the parcel to arrive on a particular date, confirm that option with the seller before ordering.",
      },
      {
        q: "What countries do you ship to?",
        a: "Shipping availability depends on the seller, plant variety and destination country's live-plant import rules. Light Bio's published FAQ currently describes shipping within the 48 contiguous United States. This does not mean the same plant can automatically be shipped internationally.",
      },
      {
        q: "When can I expect my order?",
        a: "Delivery time depends on stock, growing season, weather, location and the courier. Live plants may be dispatched according to suitable planting conditions. Check your order confirmation and tracking link for the most accurate estimate.",
      },
      {
        q: "Why are people in other states receiving their plants before me?",
        a: "Some live-plant sellers schedule dispatch according to regional weather and planting zones. Areas with warmer conditions may be served earlier, while colder areas may need to wait until the risk of freezing has passed.",
      },
      {
        q: "Why does my plant look tired when it arrives?",
        a: "Travel can temporarily stress a living plant. A little drooping, minor leaf damage or a temporary reduction in glow may happen during transit. Unpack it carefully, check the roots and soil, give it the care described in your instructions, and monitor its recovery. Contact the seller promptly if there is serious damage.",
      },
      {
        q: "How big will the delivered plant be, and how many flowers will it have?",
        a: "The delivered size depends on the product and growing stage shown on its product page. A young starter plant may arrive with few or no open flowers. With suitable care, it can develop more foliage and blooms over time. Check the product listing for the exact pot size and plant dimensions.",
      },
    ],
  },
];

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState("glow");
  const [openQuestion, setOpenQuestion] = useState("glow-0");
  const [search, setSearch] = useState("");

  const activeData = faqCategories.find(
    (category) => category.id === activeCategory,
  );

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return activeData?.questions || [];

    return activeData.questions.filter((item) =>
      `${item.q} ${item.a}`.toLowerCase().includes(term),
    );
  }, [activeData, search]);

  const totalQuestions = faqCategories.reduce(
    (total, category) => total + category.questions.length,
    0,
  );

  const selectCategory = (id) => {
    setActiveCategory(id);
    setOpenQuestion(`${id}-0`);
    setSearch("");
  };

  const toggleQuestion = (key) => {
    setOpenQuestion((current) => (current === key ? null : key));
  };

  return (
    <section className="faq-section" id="faq">
      {/* Decorative background */}
      <div className="faq-bg-orb faq-bg-orb--one" />
      <div className="faq-bg-orb faq-bg-orb--two" />
      <div className="faq-grain" />

      {/* HERO */}
      <div className="faq-container">
        <div className="faq-hero">
          <div className="faq-hero__left">
            <div className="faq-eyebrow">
              <span className="faq-eyebrow__line" />
              <span>THE KNOWLEDGE GARDEN</span>
              <Sparkles size={14} />
            </div>

            <h1 className="faq-hero__title">
              Questions?
              <br />
              <span>Let's grow</span>
              <br />
              together<span className="faq-title-dot">.</span>
            </h1>
          </div>

          <div className="faq-hero__right">
            <div className="faq-hero__icon">
              <Leaf size={34} strokeWidth={1.2} />
            </div>

            <p>
              Curious minds grow beautiful things. Find thoughtful answers about
              your plants, their care, their glow and everything in between.
            </p>

            <div className="faq-hero__meta">
              <span>{totalQuestions} QUESTIONS</span>
              <span className="faq-meta-dot" />
              <span>5 COLLECTIONS</span>
            </div>
          </div>

          <div className="faq-hero__index">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={16} />
          </div>
        </div>

        {/* FAQ CONTENT */}
        <div className="faq-content">
          {/* CATEGORY SIDEBAR */}
          <aside className="faq-sidebar">
            <div className="faq-sidebar__heading">
              <span>EXPLORE BY TOPIC</span>
              <span>05</span>
            </div>

            <div className="faq-category-list">
              {faqCategories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`faq-category ${
                    activeCategory === category.id ? "faq-category--active" : ""
                  }`}
                  onClick={() => selectCategory(category.id)}
                >
                  <span className="faq-category__number">
                    {category.number}
                  </span>

                  <span className="faq-category__text">
                    <strong>{category.name}</strong>
                    <small>{category.description}</small>
                  </span>

                  <ArrowUpRight className="faq-category__arrow" size={17} />
                </button>
              ))}
            </div>

            <div className="faq-sidebar__note">
              <Sparkles size={17} />
              <p>Every great plant journey begins with a little curiosity.</p>
            </div>
          </aside>

          {/* QUESTIONS */}
          <div className="faq-main">
            <div className="faq-main__top">
              <div>
                <span className="faq-main__eyebrow">
                  COLLECTION / {activeData.number}
                </span>

                <h2>{activeData.name}</h2>

                <p>{activeData.description}</p>
              </div>

              <div className="faq-main__count">
                <strong>
                  {String(filteredQuestions.length).padStart(2, "0")}
                </strong>
                <span>ANSWERS</span>
              </div>
            </div>

            {/* SEARCH */}
            <div className="faq-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search a question..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search frequently asked questions"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            {/* CATEGORY NOTICE */}
            {activeData.notice && (
              <div className="faq-notice">
                <span className="faq-notice__icon">
                  <Leaf size={18} />
                </span>
                <p>{activeData.notice}</p>
              </div>
            )}

            {/* ACCORDION */}
            <div className="faq-accordion">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((item, index) => {
                  const questionKey = `${activeCategory}-${index}`;
                  const isOpen = openQuestion === questionKey;

                  return (
                    <article
                      className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                      key={`${activeCategory}-${item.q}`}
                    >
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => toggleQuestion(questionKey)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-question__number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="faq-question__text">{item.q}</span>

                        <span className="faq-question__toggle">
                          <Plus size={19} />
                        </span>
                      </button>

                      <div className="faq-answer-wrap" aria-hidden={!isOpen}>
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="faq-empty">
                  <Search size={26} />
                  <h3>No questions found</h3>
                  <p>
                    Try another search term or choose a different collection.
                  </p>
                  <button type="button" onClick={() => setSearch("")}>
                    Clear search
                  </button>
                </div>
              )}
            </div>

            <div className="faq-main__bottom">
              <span>END OF COLLECTION</span>
              <span className="faq-main__bottom-line" />
              <span>{activeData.number} / 05</span>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="faq-contact">
          <div className="faq-contact__left">
            <span className="faq-contact__eyebrow">STILL CURIOUS?</span>

            <h2>
              Your question
              <br />
              matters<span>.</span>
            </h2>

            <p>
              Couldn't find what you were looking for? We're always happy to
              help you grow with confidence.
            </p>
          </div>

          <a
            className="faq-contact__button"
            href="mailto:hello@yourwebsite.com"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight size={20} />
          </a>

          <div className="faq-contact__decoration">
            <Leaf size={130} strokeWidth={0.65} />
          </div>
        </div>

        <div className="faq-footer-line">
          <span>GROW WITH CURIOSITY.</span>
          <span>ROOTED IN NATURE · MADE TO INSPIRE</span>
        </div>
      </div>
    </section>
  );
}
