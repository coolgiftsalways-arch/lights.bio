import { API } from "../cart";

const KEY = "adminToken";

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t) => localStorage.setItem(KEY, t);
export const logout = () => {
  localStorage.removeItem(KEY);
  window.location.href = "/admin/login";
};

// fetch wrapper for /api/admin/* — adds the token, logs out on 401
export async function adminFetch(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${API}/admin${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    body: options.body && !isForm && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body,
  });
  if (res.status === 401 && !path.startsWith("/login")) {
    logout();
    throw new Error("Session expired");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// Shared bits
export const STATUS_META = {
  pending: { label: "Awaiting payment", tone: "muted" },
  paid: { label: "Paid", tone: "lime" },
  confirmed: { label: "COD confirmed", tone: "amber" },
  shipped: { label: "Shipped", tone: "blue" },
  delivered: { label: "Delivered", tone: "green" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
