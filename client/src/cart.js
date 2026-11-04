// Tiny cart stored in the browser (localStorage), shared by every component.
// Each item: { productId, name, price, image, quantity }

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
  window.dispatchEvent(new Event(EVENT)); // tell components the cart changed
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === product._id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 10, product.stock);
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: Math.min(quantity, product.stock),
    });
  }
  save(cart);
}

export function setQuantity(productId, quantity) {
  const cart = getCart()
    .map((i) => (i.productId === productId ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  save(cart);
}

export function clearCart() {
  save([]);
}

export function onCartChange(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // other tabs
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export const cartCount = (cart) => cart.reduce((n, i) => n + i.quantity, 0);
export const cartTotal = (cart) => cart.reduce((n, i) => n + i.price * i.quantity, 0);

// 49900 paise -> "₹499"
export const formatPrice = (paise) =>
  (paise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// Backend address, from client/.env: VITE_API_URL=http://localhost:5000/api
export const API = import.meta.env.VITE_API_URL;
const SERVER = new URL(API).origin; // http://localhost:5000 — product images are served from here

// "/images/products/x/1.jpg" -> "http://localhost:5000/images/products/x/1.jpg"
export const imageUrl = (path) => (!path || path.startsWith("http") ? path : `${SERVER}${path}`);