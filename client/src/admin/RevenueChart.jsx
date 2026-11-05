import { useEffect, useRef, useState } from "react";
import { formatPrice } from "../cart";

// Single-series column chart of daily revenue (last 14 days), with hover tooltips.
export default function RevenueChart({ days }) {
  const [hover, setHover] = useState(null);
  const boxRef = useRef(null);
  const [W, setW] = useState(640);

  // draw at the real pixel width, so labels stay the same size on phones
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 220, PAD_L = 48, PAD_B = 28, PAD_T = 12;
  const plotW = W - PAD_L - 8;
  const plotH = H - PAD_B - PAD_T;
  const max = Math.max(...days.map((d) => d.revenue), 0);

  // clean round ticks (in rupees)
  const maxRs = max / 100;
  const step = Math.max(1, niceStep(maxRs / 3 || 1)); // whole rupees, at least ₹1 per tick
  const top = step * 3;
  const ticks = [0, step, step * 2, top];

  const band = plotW / days.length;
  const labelEvery = Math.ceil(52 / band); // keep ~52px between date labels
  const barW = Math.min(24, band - 6);
  const y = (rs) => PAD_T + plotH - (rs / top) * plotH;

  return (
    <div className="chart" ref={boxRef}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Revenue per day, last 14 days">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD_L} x2={W - 8} y1={y(t)} y2={y(t)} className="chart__grid" />
            <text x={PAD_L - 10} y={y(t) + 4} className="chart__tick" textAnchor="end">
              {compactRs(t)}
            </text>
          </g>
        ))}

        {days.map((d, i) => {
          const rs = d.revenue / 100;
          const x = PAD_L + band * i + (band - barW) / 2;
          const h = Math.max(PAD_T + plotH - y(rs), rs > 0 ? 2 : 0);
          const label = new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {/* wide invisible hit area */}
              <rect x={PAD_L + band * i} y={PAD_T} width={band} height={plotH} fill="transparent" />
              {h > 0 && (
                <path
                  d={roundedTop(x, PAD_T + plotH - h, barW, h, Math.min(4, h))}
                  className={`chart__bar ${hover === i ? "chart__bar--hover" : ""}`}
                />
              )}
              {(days.length - 1 - i) % labelEvery === 0 && (
                <text x={x + barW / 2} y={H - 8} className="chart__tick" textAnchor="middle">
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div className="chart__tip" style={{ left: `${((PAD_L + band * hover + band / 2) / W) * 100}%` }}>
          <strong>{formatPrice(days[hover].revenue)}</strong>
          <span>
            {days[hover].orders} order{days[hover].orders === 1 ? "" : "s"} ·{" "}
            {new Date(days[hover].date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>
      )}

      {/* accessible table version of the chart */}
      <table className="sr-only">
        <caption>Revenue per day</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.date}><td>{d.date}</td><td>{formatPrice(d.revenue)}</td><td>{d.orders} orders</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function niceStep(raw) {
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

function compactRs(v) {
  if (v >= 100000) return `₹${+(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${+(v / 1000).toFixed(1)}K`;
  return `₹${Math.round(v)}`;
}

// bar with 4px rounded top corners, square at the baseline
function roundedTop(x, y, w, h, r) {
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}
