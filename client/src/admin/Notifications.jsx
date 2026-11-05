import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, CheckCheck, BellRing, ShoppingBag, ArrowRight } from "lucide-react";
import { adminFetch } from "./api";
import { formatPrice } from "../cart";
import Portal from "./Portal";

const POLL_MS = 20000; // check for new orders every 20 seconds
const NotifContext = createContext(null);
export const useNotifications = () => useContext(NotifContext);

// "2 min ago"
function timeAgo(date) {
  const s = Math.max(1, Math.round((Date.now() - new Date(date)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

// Short two-note chime made in the browser (no sound file needed)
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1318.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    /* sound is optional */
  }
}

const orderLabel = (o) => `#${o._id.slice(-6).toUpperCase()}`;

// Wrap the admin panel with this: it polls for new orders and alerts you.
export function NotificationsProvider({ children }) {
  const [data, setData] = useState({ unread: 0, items: [] });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const known = useRef(null); // ids we've already seen this session
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const next = await adminFetch("/notifications");
      const unreadNew = next.items.filter((o) => o.seenByAdmin === false);

      // First load: just remember what's there. Later loads: alert for anything new.
      if (known.current) {
        const fresh = unreadNew.filter((o) => !known.current.has(o._id));
        if (fresh.length) {
          playChime();
          setToasts((t) => [...fresh.map((o) => ({ ...o, toastId: `${o._id}-${Date.now()}` })), ...t].slice(0, 3));
          if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
            fresh.forEach((o) => {
              const n = new Notification(`New order ${orderLabel(o)} · ${formatPrice(o.amount)}`, {
                body: `${o.customer?.name} · ${o.paymentMethod === "cod" ? "Cash on delivery" : "Paid via UPI"}`,
                tag: o._id,
              });
              n.onclick = () => {
                window.focus();
                navigate(`/admin/orders?open=${o._id}`);
              };
            });
          }
        }
      }
      known.current = new Set(next.items.map((o) => o._id));
      setData(next);
      setError("");
    } catch (err) {
      setError(err.message || "Couldn't load notifications"); // tries again next tick
    }
  }, [navigate]);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    const refresh = () => load();
    const onFocus = () => document.visibilityState === "visible" && load();
    window.addEventListener("adm-notif-refresh", refresh);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("adm-notif-refresh", refresh);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [load]);

  // "(2) New orders · lights.bio admin" in the browser tab
  useEffect(() => {
    const base = "lights.bio admin";
    document.title = data.unread ? `(${data.unread}) New order${data.unread > 1 ? "s" : ""} · ${base}` : base;
    return () => {
      document.title = "lights.bio";
    };
  }, [data.unread]);

  // toasts disappear after 8 seconds
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((list) => list.slice(0, -1)), 8000);
    return () => clearTimeout(t);
  }, [toasts]);

  const markAllRead = async () => {
    await adminFetch("/notifications/read-all", { method: "POST" }).catch(() => {});
    load();
  };

  // Closing the panel means you've seen everything in it -> they disappear
  const closePanel = () => {
    setOpen(false);
    if (data.unread > 0) markAllRead();
  };

  const openOrder = (id) => {
    closePanel();
    setToasts((t) => t.filter((x) => x._id !== id));
    navigate(`/admin/orders?open=${id}`);
  };

  return (
    <NotifContext.Provider value={{ ...data, error, open, setOpen, closePanel, markAllRead, openOrder }}>
      {children}
      {open && <NotificationPanel />}
      {toasts.length > 0 && !open && (
        <Portal lock={false}>
          <div className="toasts" role="status" aria-live="polite">
            {toasts.map((o) => (
              <div key={o.toastId} className="toast">
                <span className="toast__icon"><ShoppingBag size={18} /></span>
                <button className="toast__body" onClick={() => openOrder(o._id)}>
                  <strong>New order {orderLabel(o)} · {formatPrice(o.amount)}</strong>
                  <span>{o.customer?.name} · {o.paymentMethod === "cod" ? "COD" : "UPI paid"}</span>
                </button>
                <button className="toast__close" aria-label="Dismiss" onClick={() => setToasts((t) => t.filter((x) => x.toastId !== o.toastId))}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </Portal>
      )}
    </NotifContext.Provider>
  );
}

// Bell button with unread badge (used in the sidebar and the phone top bar)
export function NotificationBell({ variant = "side" }) {
  const { unread, setOpen } = useNotifications();
  if (variant === "top") {
    return (
      <button className="adm-topbar__icon notif-bell" onClick={() => setOpen(true)} aria-label={`Notifications, ${unread} new`}>
        <Bell size={18} />
        {unread > 0 && <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>
    );
  }
  return (
    <button className={`adm-side__link notif-side ${unread ? "notif-side--new" : ""}`} onClick={() => setOpen(true)}>
      <Bell size={18} /> Notifications
      {unread > 0 && <span className="notif-count">{unread}</span>}
    </button>
  );
}

function NotificationPanel() {
  const { items, unread, error, closePanel, markAllRead, openOrder } = useNotifications();
  const navigate = useNavigate();
  const fresh = items.filter((o) => o.seenByAdmin === false); // only new orders are shown
  const [perm, setPerm] = useState(() => ("Notification" in window ? Notification.permission : "unsupported"));

  const enableDesktop = async () => {
    const result = await Notification.requestPermission();
    setPerm(result);
  };

  return (
    <Portal>
      <div className="drawer" onClick={closePanel}>
        <aside className="drawer__panel notif-panel" onClick={(e) => e.stopPropagation()}>
          <button className="drawer__close" onClick={closePanel} aria-label="Close"><X size={20} /></button>

          <p className="adm-eyebrow">Notifications</p>
          <h2 className="drawer__title notif-panel__title">New orders</h2>
          <p className="adm-muted">{unread ? `${unread} new — they clear once you've seen them` : "No new orders"}</p>

          <div className="notif-actions">
            {unread > 0 && (
              <button className="abtn abtn--ghost" onClick={markAllRead}><CheckCheck size={16} /> Clear all</button>
            )}
            {perm === "default" && (
              <button className="abtn abtn--ghost" onClick={enableDesktop}><BellRing size={16} /> Desktop alerts</button>
            )}
          </div>
          {perm === "denied" && (
            <p className="cell-sub">Desktop alerts are blocked in your browser settings for this site.</p>
          )}

          {error && fresh.length === 0 ? (
            <p className="adm-error notif-empty">Couldn't load notifications: {error}. Is the server updated and restarted?</p>
          ) : fresh.length === 0 ? (
            <div className="notif-caught">
              <span className="notif-caught__icon"><CheckCheck size={26} /></span>
              <strong>You're all caught up 🌱</strong>
              <span className="adm-muted">New orders will pop up here.</span>
              <button
                className="abtn abtn--ghost"
                onClick={() => {
                  closePanel();
                  navigate("/admin/orders");
                }}
              >
                View all orders <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <ul className="notif-list">
              {fresh.map((o) => {
                const isNew = o.seenByAdmin === false;
                const qty = o.items?.reduce((n, i) => n + (i.quantity || 0), 0) || 0;
                return (
                  <li key={o._id}>
                    <button className={`notif-item ${isNew ? "notif-item--new" : ""}`} onClick={() => openOrder(o._id)}>
                      <span className="notif-item__dot" />
                      <span className="notif-item__main">
                        <span className="notif-item__title">
                          {isNew ? "New order" : "Order"} <span className="mono">{orderLabel(o)}</span>
                        </span>
                        <span className="notif-item__sub">
                          {o.customer?.name}{o.shippingAddress?.city ? ` · ${o.shippingAddress.city}` : ""} · {qty} item{qty === 1 ? "" : "s"}
                        </span>
                        <span className="notif-item__meta">
                          {o.paymentMethod === "cod" ? "Cash on delivery" : "Paid via UPI"} · {timeAgo(o.placedAt)}
                        </span>
                      </span>
                      <strong className="notif-item__amount">{formatPrice(o.amount)}</strong>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </Portal>
  );
}