import { news } from "../data";

export default function News() {
  return (
    <section className="section section--big">
      <div className="container">
        <h2 className="big">Light Bio in the News</h2>
        <p className="sub">Write a short line about your press coverage here.</p>

        <div className="news-grid">
          {news.map((n) => (
            <article key={n.title} className="news-card">
              <h3>{n.title}</h3>
              <p className="news-card__outlet">{n.outlet}</p>
              <p>{n.text}</p>
              <a href={n.link} className="pill pill--outline">Read</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}