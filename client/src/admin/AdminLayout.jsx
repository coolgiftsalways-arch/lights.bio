import { Navigate, NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Mail, LogOut, ExternalLink } from "lucide-react";
import { getToken, logout } from "./api";
import "./admin.css";

const NAV = [
  { to: "/admin", label: "Dashboard", short: "Home", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", short: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", short: "Products", icon: Package },
  { to: "/admin/subscribers", label: "Subscribers", short: "Emails", icon: Mail },
];

export default function AdminLayout() {
  if (!getToken()) return <Navigate to="/admin/login" replace />;

  return (
    <div className="adm adm-shell">
      {/* Desktop sidebar */}
      <aside className="adm-side">
        <div className="adm-side__top">
          <Link to="/admin" className="adm-brand">lights.bio</Link>
          <span className="adm-side__tag">Admin</span>
        </div>

        <nav className="adm-side__nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="adm-side__link">
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="adm-side__bottom">
          <a href="/" target="_blank" rel="noreferrer" className="adm-side__link">
            <ExternalLink size={18} /> View store
          </a>
          <button className="adm-side__link" onClick={logout}>
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>

      <div className="adm-main">
        {/* Phone top bar */}
        <header className="adm-topbar">
          <Link to="/admin" className="adm-brand adm-topbar__brand">lights.bio</Link>
          <span className="adm-side__tag">Admin</span>
          <div className="adm-topbar__actions">
            <a href="/" target="_blank" rel="noreferrer" className="adm-topbar__icon" aria-label="View store">
              <ExternalLink size={18} />
            </a>
            <button className="adm-topbar__icon" onClick={logout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="adm-content">
          <Outlet />
        </main>
      </div>

      {/* Phone bottom tab bar */}
      <nav className="adm-tabbar">
        {NAV.map(({ to, short, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="adm-tabbar__link">
            <Icon size={21} />
            <span>{short}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
