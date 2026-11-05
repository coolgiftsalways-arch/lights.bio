import { MapPin } from "lucide-react";
import { formatDate } from "./api";
import { formatPrice } from "../cart";
import StatusBadge from "./StatusBadge";

// Phone-friendly list of orders (shown instead of the table on small screens)
export default function OrderCards({ orders, onOpen }) {
  return (
    <ul className="ocards">
      {orders.map((o) => (
        <li key={o._id}>
          <button className="ocard" onClick={() => onOpen(o._id)}>
            <div className="ocard__row">
              <span className="mono ocard__id">#{o._id.slice(-6).toUpperCase()}</span>
              <StatusBadge status={o.status} />
            </div>
            <div className="ocard__row">
              <span className="ocard__name">{o.customer?.name}</span>
              <strong className="ocard__amount">{formatPrice(o.amount)}</strong>
            </div>
            {o.shippingAddress && (
              <div className="ocard__place">
                <MapPin size={13} />
                {o.shippingAddress.city}, {o.shippingAddress.state}
              </div>
            )}
            <div className="ocard__meta">
              {formatDate(o.createdAt)} · {o.paymentMethod === "cod" ? "COD" : "UPI"}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
