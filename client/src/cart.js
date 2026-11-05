// Tiny cart stored in the browser (localStorage)
const KEY = "cart";
const EVENT = "cart-change";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function save(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(EVENT));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const stock = Number(product.stock) || 0;
  const existing = cart.find((i) => i.productId === product._id);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 10, stock);
  } else if (stock > 0) {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: Math.min(quantity, 10, stock),
    });
  }

  save(cart);
}

export function setQuantity(productId, quantity) {
  const cart = getCart()
    .map((i) =>
      i.productId === productId
        ? { ...i, quantity: Math.max(0, Math.min(10, quantity)) }
        : i,
    )
    .filter((i) => i.quantity > 0);

  save(cart);
}

export function clearCart() {
  save([]);
}

export function onCartChange(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export const cartCount = (cart) => cart.reduce((n, i) => n + i.quantity, 0);

export const cartTotal = (cart) =>
  cart.reduce((n, i) => n + i.price * i.quantity, 0);

export const formatPrice = (paise) =>
  (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

// Backend API address
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let SERVER;

try {
  SERVER = new URL(API, window.location.origin).origin;
} catch {
  SERVER = window.location.origin;
}

// Convert backend image paths into full URLs
export const imageUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  return new URL(path.startsWith("/") ? path : `/${path}`, SERVER).href;
};
