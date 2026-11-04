import Header from "./components/Header";
import Hero from "./components/Hero";
import Carousel from "./components/Carousel";
import Reviews from "./components/Reviews";
import News from "./components/News";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import { happening, science, myths } from "./data";

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Carousel eyebrow="Our Blogs" title="What's Happening" items={happening} />
      <Carousel title="Science Illuminated" items={science} />
      <Carousel title="Myth vs. Fact" items={myths} />
      <Reviews />
      <News />
      <Faq />
      <Footer />
    </>
  );
}