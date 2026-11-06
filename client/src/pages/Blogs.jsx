import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "../Style/Home.css";
import "../Style/Blogs.css";
const homeImage = (filename) => `/Home/${encodeURIComponent(filename)}`;

const blogs = [
  {
    slug: "indoor-plants",
    title: "Glow Getter Mailbag",
    subtitle: "Your Top Autumn Indoor Care Questions, Answered!",
    image: homeImage("GlowGetterMailbag.png"),
    intro:
      "As the seasons change, caring for your plants indoors becomes important. Here are answers to some of the most common questions about keeping your Firefly Petunia healthy and glowing.",
    sections: [
      {
        heading: "1. Why are my leaves turning yellow?",
        text: "A few yellow leaves are normal when a plant adjusts to a new environment. When moving your plant indoors, changes in temperature, humidity and sunlight can cause some older leaves to drop. Remove damaged leaves and give your plant time to adjust.",
      },
      {
        heading: "2. How close should my grow light be?",
        text: "Position a suitable grow light approximately 6–12 inches above your plant, adjusting according to the light's intensity and the plant's response.",
      },
      {
        heading: "3. How often should I water indoor plants?",
        text: "Check the soil before watering. Water when the upper layer of soil begins to dry. Avoid leaving the roots sitting in excess water.",
      },
      {
        heading: "4. What about dry air from heaters?",
        text: "Heating systems can reduce indoor humidity. Keep plants away from direct hot airflow and maintain a comfortable growing environment.",
      },
      {
        heading: "5. Should I continue fertilizing?",
        text: "Reduce feeding during slower growth periods. If your plant is actively growing, use a balanced fertilizer at an appropriately reduced strength.",
      },
    ],
  },

  {
    slug: "photograph-the-glow",
    title: "How to Photograph the Bioluminescent Glow of Your Firefly Petunia",
    subtitle: "A photography masterclass for capturing the magic.",
    image: homeImage("HowtoPhotographthe.png"),
    intro:
      "The Firefly Petunia has a remarkable nighttime glow. Photographing it requires a little patience and the right camera settings. Here is how to capture its beauty.",
    sections: [
      {
        heading: "Find a dark environment",
        text: "Turn off nearby lights and allow your eyes and camera to adjust to the darkness. Artificial light can overpower the subtle glow.",
      },
      {
        heading: "Turn off your flash",
        text: "A camera flash can wash out the natural appearance of the glowing flower. Keep your flash turned off.",
      },
      {
        heading: "Use Night Mode",
        text: "Many modern smartphones have a Night Mode. Use it to capture more light while keeping your camera steady.",
      },
      {
        heading: "Try manual camera settings",
        text: "As a starting point, experiment with ISO 800–1600, an aperture around f/1.8–f/2.8, and shutter speeds of 2–8 seconds, depending on your camera and available light.",
      },
      {
        heading: "Keep your camera steady",
        text: "Use a tripod or stable surface to avoid blurry photographs during long exposures. Focus carefully on the flower.",
      },
    ],
  },

  {
    slug: "cozy-indoor-styling",
    title: "Cozy Indoor Styling Ideas for Your Firefly Petunia",
    subtitle: "Bring a little natural magic into your home.",
    image: homeImage("Cozy Indoor StylingIdeasforYourFirefly.png"),
    intro:
      "Plants can transform the feeling of a room. With thoughtful placement and beautiful containers, you can create a cozy indoor environment for your favourite greenery.",
    sections: [
      {
        heading: "Choose a beautiful location",
        text: "Place your plants where they receive suitable natural light during the day. A bright window can make a lovely location.",
      },
      {
        heading: "Select complementary pots",
        text: "Neutral ceramic pots, textured planters and natural materials can complement the beauty of your plants.",
      },
      {
        heading: "Create a plant corner",
        text: "Combine different plant heights and textures to create an interesting indoor display. Keep enough space for every plant to receive light.",
      },
      {
        heading: "Enjoy the nighttime atmosphere",
        text: "Reduce unnecessary room lighting in the evening and enjoy the natural nighttime appearance of your plants.",
      },
    ],
  },

  {
    slug: "bringing-the-glow-indoors",
    title: "Bringing the Glow Indoors",
    subtitle: "A guide to helping your plants through colder weather.",
    image: homeImage("BingingtheGlowIndoors.png"),
    intro:
      "When temperatures begin to fall, it may be time to think about protecting your plants. A little preparation can help them adjust to an indoor environment.",
    sections: [
      {
        heading: "Know when to bring plants indoors",
        text: "Consider moving sensitive plants inside as nighttime temperatures approach 50°F (10°C). Avoid exposing them to cold conditions.",
      },
      {
        heading: "Prepare your plant",
        text: "Remove damaged leaves and dead growth. Inspect the foliage, stems and soil for pests before bringing the plant indoors.",
      },
      {
        heading: "Check for insects",
        text: "Rinse the foliage gently and inspect the plant carefully. Keep newly introduced plants separate for 7–10 days when possible.",
      },
      {
        heading: "Provide suitable lighting",
        text: "Use an appropriate LED grow light if natural sunlight is insufficient. A suitable light schedule of around 12–14 hours may help support growth.",
      },
      {
        heading: "Water carefully",
        text: "Indoor plants may use water more slowly. Check the soil before watering and keep the plant away from heaters and cold drafts.",
      },
    ],
  },

  {
    slug: "jim-devereux-interview",
    title: "A Conversation with Green Fuse Botanicals Co-Owner Jim Devereux",
    subtitle: "Discover the people and passion behind the plants.",
    image: homeImage(
      "ToAllBlogPostsAConversationwithGreenFuseBotanicalsCo-OwnerJimDevereux.png",
    ),
    intro:
      "Behind every extraordinary plant is a story of curiosity, experimentation and dedication. We explore the work and ideas behind new botanical varieties.",
    sections: [
      {
        heading: "The inspiration behind new varieties",
        text: "Plant development involves combining horticultural knowledge with careful selection. The goal is to create varieties with distinctive characteristics and strong garden performance.",
      },
      {
        heading: "The beauty of pink petunias",
        text: "Pink varieties bring colour and personality to a garden. Different shades and patterns can create a unique visual experience.",
      },
      {
        heading: "Looking toward the future",
        text: "New plant collections offer opportunities to explore fresh colours, forms and growing characteristics.",
      },
      {
        heading: "Why plant development matters",
        text: "Developing plants takes patience, testing and a commitment to healthy growth. Every new variety begins with curiosity.",
      },
    ],
  },

  {
    slug: "newest-buds-glow",
    title: "Why the Newest Buds Glow the Brightest",
    subtitle: "Discover the science behind the beautiful glow.",
    image: homeImage("WhytheNewestBudsGlowtheBrightest.png"),
    intro:
      "Have you noticed that the newest flowers sometimes appear brighter than older blooms? Plant development and biological activity help explain why different parts of a plant can display different levels of glow.",
    sections: [
      {
        heading: "Growing tissues and energy",
        text: "New growth is metabolically active. Differences in tissue development and biological activity can influence the appearance of the glow.",
      },
      {
        heading: "The role of plant chemistry",
        text: "The bioluminescent process involves a series of chemical reactions. Plant compounds and the activity of biological pathways contribute to the visible effect.",
      },
      {
        heading: "How to encourage healthy growth",
        text: "Provide suitable light, water and nutrients. Healthy growing conditions help your plant produce fresh leaves and flowers.",
      },
      {
        heading: "Remove old flowers",
        text: "Deadheading spent flowers can help maintain a neat appearance and support continued flowering, depending on the plant's growth stage.",
      },
    ],
  },

  {
    slug: "science-of-spooky-season",
    title: "The Science of Spooky Season",
    subtitle: "Exploring the fascinating world of bioluminescence.",
    image: homeImage("TheScienceofSpookySeason.png"),
    intro:
      "Nature has some incredible ways of producing light. From glowing fungi to ocean organisms, bioluminescence is one of the most fascinating natural phenomena.",
    sections: [
      {
        heading: "What is bioluminescence?",
        text: "Bioluminescence is light produced by a living organism through a chemical reaction.",
      },
      {
        heading: "How does it work?",
        text: "Many bioluminescent systems involve a light-producing molecule called luciferin, an enzyme called luciferase and oxygen. The exact process varies between organisms.",
      },
      {
        heading: "Where can we find it?",
        text: "Bioluminescence appears in marine organisms, fireflies and certain fungi. It is found in different environments around the world.",
      },
      {
        heading: "Why do organisms glow?",
        text: "Living organisms can use bioluminescence for communication, attracting prey, camouflage and other ecological purposes.",
      },
    ],
  },

  {
    slug: "glow-day-to-night",
    title: "Why the Glow Transforms from Day to Night",
    subtitle: "Discover how our eyes experience light differently.",
    image: homeImage("WhytheGlowTransformsfromDaytoNight.png"),
    intro:
      "A glowing plant can look very different during the day and at night. The surrounding light and the way our eyes adjust to darkness both affect what we see.",
    sections: [
      {
        heading: "Daylight changes what we see",
        text: "Bright sunlight is much stronger than the subtle glow produced by a plant. This makes the glow difficult to notice during the day.",
      },
      {
        heading: "Darkness reveals the glow",
        text: "When the surroundings become darker, the contrast increases and the glowing flowers become easier to see.",
      },
      {
        heading: "How our eyes adapt",
        text: "Our eyes use different light-sensitive cells. Cones help us see colours in brighter conditions, while rods become more important in low light.",
      },
      {
        heading: "Enjoy the changing atmosphere",
        text: "Observe your plant at different times of the day to appreciate how its appearance changes with the surrounding environment.",
      },
    ],
  },

  {
    slug: "outdoor-plant-myth",
    title: "The Firefly Petunia Is Strictly an Outdoor Plant",
    subtitle: "Understanding where your glowing plant can grow.",
    image: homeImage("TheFireflyPetuniaIsStrictlyanOutdoorPlant.png"),
    intro:
      "There are many questions about whether a Firefly Petunia can grow indoors. The answer depends on the environment, available light and proper care.",
    sections: [
      {
        heading: "Can it grow indoors?",
        text: "Indoor growing may be possible when the plant receives sufficient suitable light, good airflow and appropriate care.",
      },
      {
        heading: "Why sunlight matters",
        text: "Like other plants, petunias need light to support photosynthesis and healthy development.",
      },
      {
        heading: "Choose the right temperature",
        text: "Avoid extreme temperatures and keep the plant away from heating vents and cold drafts.",
      },
      {
        heading: "Give your plant room to grow",
        text: "Choose a suitable container and provide enough space for healthy roots and foliage.",
      },
    ],
  },

  {
    slug: "glow-photos-enhanced",
    title: "The Glow in the Official Firefly Petunia Photos Is Enhanced",
    subtitle: "Understanding photography and the natural glow.",
    image: homeImage("TheGlowintheOfficialFirefly.png"),
    intro:
      "Photographs of glowing plants can look different from what our eyes see. Camera settings, long exposures and surrounding darkness all affect the final image.",
    sections: [
      {
        heading: "Why photographs look brighter",
        text: "Long exposure photography allows a camera sensor to collect light over a longer period. This can make subtle light sources appear more visible.",
      },
      {
        heading: "How our eyes see the glow",
        text: "Our vision adapts to darker surroundings over time. This changes how clearly we notice low levels of light.",
      },
      {
        heading: "Understanding the difference",
        text: "A photograph and a direct visual experience are not identical. Camera settings can change the appearance of brightness and colour.",
      },
      {
        heading: "The importance of healthy plants",
        text: "Proper growing conditions, including suitable light and watering, are essential for maintaining healthy plants.",
      },
    ],
  },

  {
    slug: "glow-power",
    title: "The Glow Runs Out of Power After an Hour or Two",
    subtitle: "Understanding the continuous biological glow.",
    image: homeImage("TheGlowRunsOutofPowerAfteranHourorTwo.png"),
    intro:
      "Some people believe that glowing plants stop producing light after a short time. Understanding the biology behind bioluminescence helps explain why this is a misconception.",
    sections: [
      {
        heading: "Is the glow powered by a battery?",
        text: "No. Bioluminescence is a biological process rather than an electronic light source.",
      },
      {
        heading: "How does the plant produce light?",
        text: "Bioluminescent organisms produce light through chemical reactions within living tissues.",
      },
      {
        heading: "Does the glow change?",
        text: "The visibility of the glow can vary with environmental lighting, plant condition and the way the glow is observed.",
      },
      {
        heading: "Keep your plant healthy",
        text: "Suitable light, water, nutrients and growing conditions help support the plant's overall health.",
      },
    ],
  },

  {
    slug: "blacklights-and-sprays",
    title: "Glowing Petunias Rely on Special Blacklights and Chemical Sprays",
    subtitle: "Separating facts from myths about glowing plants.",
    image: homeImage(
      "GlowingPetuniasRelyonSpecialBlacklightsandChemicalSprays.png",
    ),
    intro:
      "A naturally glowing plant sounds almost impossible. It is no surprise that people wonder whether special blacklights or chemical sprays are required.",
    sections: [
      {
        heading: "Do glowing petunias need blacklights?",
        text: "The bioluminescent effect is based on biological processes in the plant. It is not simply fluorescence caused by shining a blacklight on the flowers.",
      },
      {
        heading: "Are chemical sprays required?",
        text: "The biological light-producing system does not work like an ordinary glow-in-the-dark coating that needs to be sprayed onto the plant.",
      },
      {
        heading: "The science of living light",
        text: "Bioluminescence involves biological pathways that produce visible light through chemical reactions.",
      },
      {
        heading: "What care does the plant need?",
        text: "Like other petunias, it needs appropriate growing conditions, suitable light, watering and regular attention.",
      },
    ],
  },
];

function BlogListing() {
  return (
    <main className="blog-page">
      <section className="blog-listing">
        <div className="blog-listing-header">
          <span className="eyebrow">THE JOURNAL / OUR STORIES</span>
          <h1>
            What's <span>Happening.</span>
          </h1>
          <p>
            Stories, discoveries and inspiration from the wonderful world of
            glowing plants.
          </p>
        </div>

        <div className="blog-grid">
          {blogs.map((blog, index) => (
            <Link
              to={`/blogs/${blog.slug}`}
              className="blog-card"
              key={blog.slug}
            >
              <div className="blog-card-image">
                <img src={blog.image} alt={blog.title} loading="lazy" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="blog-card-arrow">
                  <ArrowUpRight size={22} />
                </div>
              </div>

              <div className="blog-card-content">
                <span>THE LIGHT BIO JOURNAL</span>
                <h2>{blog.title}</h2>
                <p>{blog.subtitle}</p>
                <div className="blog-read-more">
                  READ ARTICLE <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function BlogArticle({ blog }) {
  return (
    <main className="blog-page">
      <article className="blog-article">
        <Link to="/blogs" className="blog-back">
          <ArrowLeft size={17} />
          ALL STORIES
        </Link>

        <header className="blog-article-header">
          <span className="eyebrow">THE LIGHT BIO JOURNAL</span>
          <h1>{blog.title}</h1>
          <p>{blog.subtitle}</p>
        </header>

        <div className="blog-hero-image">
          <img src={blog.image} alt={blog.title} />
        </div>

        <div className="blog-article-content">
          <p className="blog-intro">{blog.intro}</p>

          {blog.sections.map((section, index) => (
            <section className="blog-content-section" key={index}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}

          <div className="blog-article-footer">
            <p>Thank you for exploring the world of living light.</p>
            <Link to="/blogs">
              EXPLORE MORE STORIES <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

export default function Blogs() {
  const { slug } = useParams();

  if (!slug) {
    return <BlogListing />;
  }

  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <main className="blog-page">
        <div className="blog-not-found">
          <h1>Story not found.</h1>
          <p>The article you are looking for does not exist.</p>
          <Link to="/blogs">
            <ArrowLeft size={17} /> BACK TO ALL STORIES
          </Link>
        </div>
      </main>
    );
  }

  return <BlogArticle blog={blog} />;
}
