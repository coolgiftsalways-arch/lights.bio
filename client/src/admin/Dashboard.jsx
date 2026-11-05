import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IndianRupee, Truck, Wallet, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import { adminFetch, formatDate } from "./api";
import { formatPrice, imageUrl } from "../cart";
import StatusBadge from "./StatusBadge";
import RevenueChart from "./RevenueChart";
import OrderCards from "./OrderCards";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminFetch("/stats").then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="adm-error">{error}</p>;
  if (!stats) return <div className="adm-loading">Loading dashboard…</div>;

  const last14 = stats.days.reduce((s, d) => s + d.revenue, 0);

  const cards = [
    { label: "Revenue collected", value: formatPrice(stats.revenue), note: `${stats.paidOrders} paid orders`, icon: IndianRupee, accent: true },
    { label: "Orders to ship", value: stats.toShip, note: "Paid or COD confirmed", icon: Truck, to: "/admin/orders?status=paid" },
    { label: "COD to collect", value: formatPrice(stats.pendingCod), note: "Confirmed + shipped COD", icon: Wallet },
    { label: "Subscribers", value: stats.subscriberCount, note: `${stats.productCount} products live`, icon: Mail, to: "/admin/subscribers" },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <div>
          <p className="adm-eyebrow">Overview</p>
          <h1>Good to see you 🌱</h1>
        </div>
      </header>

      <div className="stat-grid">
        {cards.map(({ label, value, note, icon: Icon, accent, to }) => {
          const body = (
            <>
              <span className="stat__icon"><Icon size={18} /></span>
              <span className="stat__label">{label}</span>
              <strong className="stat__value">{value}</strong>
              <span className="stat__note">{note}</span>
            </>
          );
          return to ? (
            <Link key={label} to={to} className={`stat ${accent ? "stat--accent" : ""}`}>{body}</Link>
          ) : (
            <div key={label} className={`stat ${accent ? "stat--accent" : ""}`}>{body}</div>
          );
        })}
      </div>

      <div className="dash-grid">
        <section className="panel panel--chart">
          <div className="panel__head">
            <div>
              <h2>Revenue, last 14 days</h2>
              <p className="adm-muted">{formatPrice(last14)} collected</p>
            </div>
          </div>
          <RevenueChart days={stats.days} />
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Low stock</h2>
            <Link to="/admin/products" className="panel__link">Products <ArrowRight size={14} /></Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="adm-muted">Everything is well stocked.</p>
          ) : (
            <ul className="mini-list">
              {stats.lowStock.map((p) => (
                <li key={p._id}>
                  <img src={imageUrl(p.images?.[0])} alt="" />
                  <span className="mini-list__name">{p.name}</span>
                  <span className={`stock-chip ${p.stock === 0 ? "stock-chip--out" : ""}`}>
                    <AlertTriangle size={12} /> {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2>Recent orders</h2>
          <Link to="/admin/orders" className="panel__link">All orders <ArrowRight size={14} /></Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="adm-muted">No orders yet.</p>
        ) : (
          <>
          <OrderCards orders={stats.recent} onOpen={(id) => navigate(`/admin/orders?open=${id}`)} />
          <div className="table-wrap desktop-only">
            <table className="atable">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Date</th><th>Payment</th><th>Status</th><th className="num">Amount</th></tr>
              </thead>
              <tbody>
                {stats.recent.map((o) => (
                  <tr key={o._id}>
                    <td><Link to={`/admin/orders?open=${o._id}`} className="mono">#{o._id.slice(-6).toUpperCase()}</Link></td>
                    <td>{o.customer?.name}</td>
                    <td className="adm-muted">{formatDate(o.createdAt)}</td>
                    <td>{o.paymentMethod === "cod" ? "COD" : "UPI"}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="num">{formatPrice(o.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>
    </div>
  );
}
