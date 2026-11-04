import { useState } from "react";
import { faqs } from "../data";

export default function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="section section--big">
      <div className="container two-col two-col--top">
        <div>
          <h2 className="big">Frequently Asked Questions</h2>
          <p className="sub">Write a short line about your FAQs here.</p>
          <a href="#" className="pill pill--inline">Contact Us</a>
          <a href="#" className="pill pill--inline">View All FAQs</a>
        </div>

        <div className="faq">
          {faqs.map((f, i) => (
            <div key={f.q} className="faq__item">
              <button onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <span className={open === i ? "chev chev--open" : "chev"}>⌄</span>
              </button>
              {open === i && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}