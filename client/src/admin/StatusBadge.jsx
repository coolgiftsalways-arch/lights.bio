import { STATUS_META } from "./api";

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: "muted" };
  return (
    <span className={`badge badge--${meta.tone}`}>
      <span className="badge__dot" />
      {meta.label}
    </span>
  );
}
