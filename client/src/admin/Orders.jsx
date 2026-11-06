import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Phone, Mail, MapPin, Truck, RefreshCw, FileText, ExternalLink } from "lucide-react";
import { adminFetch, formatDate, STATUS_META } from "./api";
import { formatPrice, imageUrl } from "../cart";
import StatusBadge from "./StatusBadge";
import OrderCards from "./OrderCards";
import Portal from "./Portal";

const TABS = ["all", "paid", "confirmed", "shipped", "delivered", "pending", "cancelled"];
const TAB_LABEL = { all: "All", paid: "Paid", confirmed: "COD", shipped: "Shipped", delivered: "Delivered", pending: "Unpaid", cancelled: "Cancelled" };

export default function Orders() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "all";
  const openId = params.get("open");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page });
    if (status !== "all") qs.set("status", status);
    if (q.trim()) qs.set("q", q.trim());
    adminFetch(`/orders?${qs}`).then(setData).catch(() => {});
  }, [status, q, page]);

  useEffect(() => {
    const t = setTimeout(load, 250); // small debounce while typing
    return () => clearTimeout(t);
  }, [load]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <div>
          <p className="adm-eyebrow">Sales</p>
          <h1>Orders</h1>
        </div>
        <label className="adm-search">
          <Search size={16} />
          <input placeholder="Name, email, phone or order ID" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </label>
      </header>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${status === t ? "tab--active" : ""}`} onClick={() => { setParam("status", t === "all" ? "" : t); setPage(1); }}>
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <section className="panel">
        {!data ? (
          <div className="adm-loading">Loading orders…</div>
        ) : data.items.length === 0 ? (
          <p className="adm-muted">No orders match.</p>
        ) : (
          <>
          <OrderCards orders={data.items} onOpen={(id) => setParam("open", id)} />
          <div className="table-wrap desktop-only">
            <table className="atable atable--click">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Ship to</th><th>Items</th><th>Date</th><th>Payment</th><th>Status</th><th className="num">Amount</th></tr>
              </thead>
              <tbody>
                {data.items.map((o) => (
                  <tr key={o._id} onClick={() => setParam("open", o._id)}>
                    <td className="mono">#{o._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div className="cell-main">{o.customer?.name}</div>
                      <div className="cell-sub">+91 {o.customer?.phone}</div>
                    </td>
                    <td>
                      <div className="cell-main">{o.shippingAddress?.city}</div>
                      <div className="cell-sub">{o.shippingAddress?.state} · {o.shippingAddress?.pincode}</div>
                    </td>
                    <td className="adm-muted">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
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

        {data && data.pages > 1 && (
          <div className="pager">
            <button className="abtn abtn--ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="adm-muted">Page {data.page} of {data.pages}</span>
            <button className="abtn abtn--ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </section>

      {openId && <OrderDrawer id={openId} onClose={() => setParam("open", "")} onChanged={load} />}
    </div>
  );
}

function OrderDrawer({ id, onClose, onChanged }) {
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch(`/orders/${id}`)
      .then((o) => {
        setOrder(o);
        window.dispatchEvent(new Event("adm-notif-refresh")); // opening marks it read
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const changeStatus = async (status) => {
    if (status === "cancelled" && !window.confirm("Cancel this order? Stock will be returned to inventory.")) return;
    setSaving(true);
    setError("");
    try {
      const updated = await adminFetch(`/orders/${id}`, { method: "PATCH", body: { status } });
      setOrder((o) => ({ ...o, status: updated.status }));
      onChanged();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const a = order?.shippingAddress;

  return (
    <Portal>
    <div className="drawer" onClick={onClose}>
      <aside className="drawer__panel" onClick={(e) => e.stopPropagation()}>
        <button className="drawer__close" onClick={onClose} aria-label="Close"><X size={20} /></button>

        {!order ? (
          <div className="adm-loading">{error || "Loading order…"}</div>
        ) : (
          <>
            <p className="adm-eyebrow">Order</p>
            <h2 className="drawer__title">#{order._id.slice(-6).toUpperCase()}</h2>
            <p className="adm-muted">{formatDate(order.createdAt)} · {order.paymentMethod === "cod" ? "Cash on delivery" : "UPI"}</p>

            <div className="drawer__section">
              <label className="adm-field">
                <span>Status</span>
                <select value={order.status} disabled={saving} onChange={(e) => changeStatus(e.target.value)}>
                  {Object.entries(STATUS_META).map(([value, m]) => (
                    <option key={value} value={value}>{m.label}</option>
                  ))}
                </select>
              </label>
              {error && <p className="adm-error">{error}</p>}
              {order.razorpayPaymentId && <p className="cell-sub">Razorpay payment: <span className="mono">{order.razorpayPaymentId}</span></p>}
            </div>

            <ShippingSection order={order} setOrder={setOrder} onChanged={onChanged} />

            <div className="drawer__section">
              <h3>Customer</h3>
              <p className="cell-main">{order.customer.name}</p>
              <p className="contact"><Mail size={14} /> <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a></p>
              <p className="contact"><Phone size={14} /> <a href={`tel:+91${order.customer.phone}`}>+91 {order.customer.phone}</a></p>
            </div>

            <div className="drawer__section">
              <h3>Ship to</h3>
              <p className="contact contact--top">
                <MapPin size={14} />
                <span>
                  {a.line1}{a.line2 && <>, {a.line2}</>}<br />
                  {a.landmark && <>Landmark: {a.landmark}<br /></>}
                  {a.city}, {a.state} – {a.pincode}
                </span>
              </p>
            </div>

            <div className="drawer__section">
              <h3>Items</h3>
              <ul className="mini-list">
                {order.items.map((i, idx) => (
                  <li key={idx}>
                    <img src={imageUrl(i.product?.images?.[0])} alt="" />
                    <span className="mini-list__name">{i.name}<small>Qty {i.quantity} × {formatPrice(i.price)}</small></span>
                    <strong>{formatPrice(i.price * i.quantity)}</strong>
                  </li>
                ))}
              </ul>
              {order.discount > 0 && (
                <div className="drawer__line">
                  <span>Subtotal {formatPrice(order.subtotal)} · UPI discount</span>
                  <span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="drawer__total">
                <span>Total</span>
                <strong>{formatPrice(order.amount)}</strong>
              </div>
              {order.delivery?.minDays && (
                <p className="cell-sub">Promised delivery: {order.delivery.minDays}–{order.delivery.maxDays} days</p>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
    </Portal>
  );
}

// ---------- Shiprocket shipping panel ----------
const SHIPPABLE = ["paid", "confirmed", "shipped"];

function ShippingSection({ order, setOrder, onChanged }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const ship = order.shipping || {};
  const shippable = SHIPPABLE.includes(order.status);
  const isMock = ship.testMode === "mock";
  const isCreateOnly = ship.testMode === "create_only";
  const done = Boolean(ship.awb && ship.pickupDate && !ship.testMode);

  const run = async (kind) => {
    if (kind === "ship" && !window.confirm(
      "Send this order to Shiprocket?\n\nIn LIVE mode this assigns a courier (charges your Shiprocket wallet) and books a pickup.\nIn TEST mode (SHIPROCKET_MODE=mock / create_only) nothing is booked."
    )) return;
    setBusy(kind);
    setError("");
    try {
      const updated = await adminFetch(`/orders/${order._id}/${kind === "ship" ? "ship" : "tracking"}`, { method: "POST" });
      setOrder((o) => ({ ...o, ...updated }));
      onChanged();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="drawer__section ship-panel">
      <h3><Truck size={15} /> Shipping</h3>

      {(isMock || isCreateOnly) && (
        <p className="ship-test">
          {isMock ? "TEST shipment — nothing was sent to Shiprocket." : "TEST — order created in Shiprocket only. No courier or pickup booked."}
        </p>
      )}

      {ship.shipmentId ? (
        <dl className="ship-grid">
          {ship.status && (<><dt>Status</dt><dd>{ship.status}</dd></>)}
          {ship.courier && (<><dt>Courier</dt><dd>{ship.courier}</dd></>)}
          {ship.awb && (<><dt>AWB</dt><dd className="mono">{ship.awb}</dd></>)}
          {ship.pickupDate && (<><dt>Pickup</dt><dd>{ship.pickupDate}</dd></>)}
          {ship.etd && (<><dt>Expected</dt><dd>{ship.etd}</dd></>)}
          {ship.srOrderId && (<><dt>Shiprocket ID</dt><dd className="mono">{ship.srOrderId}</dd></>)}
        </dl>
      ) : (
        <p className="adm-muted">
          {shippable ? "Not sent to Shiprocket yet." : "Only Paid or COD-confirmed orders can be shipped."}
        </p>
      )}

      {ship.lastError && <p className="adm-error">{ship.lastError}</p>}
      {error && <p className="adm-error">{error}</p>}

      <div className="ship-actions">
        {shippable && !done && (
          <button className="abtn abtn--primary" disabled={!!busy} onClick={() => run("ship")}>
            <Truck size={15} />
            {busy === "ship" ? "Sending…" : ship.shipmentId ? "Continue / retry shipping" : "Ship with Shiprocket"}
          </button>
        )}
        {ship.awb && !isMock && (
          <button className="abtn abtn--ghost" disabled={!!busy} onClick={() => run("track")}>
            <RefreshCw size={15} /> {busy === "track" ? "Refreshing…" : "Refresh tracking"}
          </button>
        )}
        {ship.labelUrl && (
          <a className="abtn abtn--ghost" href={ship.labelUrl} target="_blank" rel="noreferrer">
            <FileText size={15} /> Label
          </a>
        )}
        {ship.trackUrl && (
          <a className="abtn abtn--ghost" href={ship.trackUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={15} /> Track
          </a>
        )}
      </div>

      {Array.isArray(ship.events) && ship.events.length > 0 && (
        <ul className="ship-events">
          {ship.events.slice(0, 6).map((e, i) => (
            <li key={i}><strong>{e.status}</strong><small>{[e.location, e.date].filter(Boolean).join(" · ")}</small></li>
          ))}
        </ul>
      )}
    </div>
  );
}