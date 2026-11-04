// export default function Carousel({ eyebrow, title, items }) {
//   return (
//     <section className="section">
//       <div className="container">
//         {eyebrow && <p className="eyebrow">{eyebrow}</p>}
//         <h2>{title}</h2>

//         <div className="cards">
//           {items.map((c) => (
//             <a key={c.title} href={c.link} className="card">
//               <img src={c.image} alt={c.title} loading="lazy" />
//               <div className="card__body">
//                 <h3>{c.title}</h3>
//                 <p>{c.text}</p>
//               </div>
//             </a>
//           ))}
//         </div>

//         <a href="#" className="pill">View All</a>
//       </div>
//     </section>
//   );
// }
