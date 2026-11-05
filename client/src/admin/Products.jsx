import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Upload, X, Eye, EyeOff } from "lucide-react";
import { adminFetch } from "./api";
import Portal from "./Portal";
import { formatPrice, imageUrl } from "../cart";

const EMPTY = { name: "", description: "", price: "", stock: "", badge: "", active: true, images: [] };

export default function Products() {
  const [products, setProducts] = useState(null);
  const [editing, setEditing] = useState(null); // product being edited, or EMPTY for new

  const load = () => adminFetch("/products").then(setProducts).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggleActive = async (p) => {
    await adminFetch(`/products/${p._id}`, { method: "PATCH", body: { active: !p.active } });
    load();
  };

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <div>
          <p className="adm-eyebrow">Catalog</p>
          <h1>Products</h1>
        </div>
        <button className="abtn abtn--primary" onClick={() => setEditing(EMPTY)}>
          <Plus size={18} /> Add product
        </button>
      </header>

      {!products ? (
        <div className="adm-loading">Loading products…</div>
      ) : (
        <div className="prod-grid">
          {products.map((p) => (
            <article key={p._id} className={`prod ${p.active ? "" : "prod--hidden"}`}>
              <div className="prod__img">
                {p.images?.[0] ? <img src={imageUrl(p.images[0])} alt="" /> : <span>No photo</span>}
                {!p.active && <span className="prod__flag">Hidden</span>}
              </div>
              <div className="prod__body">
                <h3>{p.name}</h3>
                <div className="prod__meta">
                  <strong>{formatPrice(p.price)}</strong>
                  <span className={`stock-chip ${p.stock === 0 ? "stock-chip--out" : p.stock <= 5 ? "" : "stock-chip--ok"}`}>
                    {p.stock === 0 ? "Sold out" : `${p.stock} in stock`}
                  </span>
                </div>
                <div className="prod__actions">
                  <button className="abtn abtn--ghost" onClick={() => setEditing(p)}><Pencil size={15} /> Edit</button>
                  <button className="abtn abtn--ghost" onClick={() => toggleActive(p)} title={p.active ? "Hide from shop" : "Show in shop"}>
                    {p.active ? <EyeOff size={15} /> : <Eye size={15} />} {p.active ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onClose, onSaved }) {
  const isNew = !product._id;
  const [form, setForm] = useState({
    ...product,
    price: product.price === "" ? "" : product.price / 100, // edit in rupees
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const { url } = await adminFetch("/upload", { method: "POST", body });
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const makeMain = (i) => setForm((f) => ({ ...f, images: [f.images[i], ...f.images.filter((_, idx) => idx !== i)] }));

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const price = Math.round(Number(form.price) * 100);
    const stock = Number(form.stock);
    if (!form.name.trim()) return setError("Name is required.");
    if (!Number.isFinite(price) || price < 100) return setError("Price must be at least ₹1.");
    if (!Number.isInteger(stock) || stock < 0) return setError("Stock must be a whole number (0 or more).");

    setSaving(true);
    try {
      const body = { name: form.name.trim(), description: form.description, price, stock, badge: form.badge, active: form.active, images: form.images };
      await adminFetch(isNew ? "/products" : `/products/${product._id}`, { method: isNew ? "POST" : "PATCH", body });
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Portal>
    <div className="modal" onClick={onClose}>
      <form className="modal__card" onClick={(e) => e.stopPropagation()} onSubmit={save}>
        <div className="modal__head">
          <h2>{isNew ? "Add product" : "Edit product"}</h2>
          <button type="button" className="drawer__close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <div className="img-row">
          {form.images.map((src, i) => (
            <div key={src} className={`img-thumb ${i === 0 ? "img-thumb--main" : ""}`}>
              <img src={imageUrl(src)} alt="" onClick={() => makeMain(i)} title="Click to make main photo" />
              {i === 0 && <span className="img-thumb__tag">Main</span>}
              <button type="button" onClick={() => removeImage(i)} aria-label="Remove photo"><X size={12} /></button>
            </div>
          ))}
          <button type="button" className="img-add" onClick={() => fileRef.current.click()} disabled={uploading}>
            <Upload size={18} />
            <span>{uploading ? "Uploading…" : "Add photo"}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={uploadImage} />
        </div>

        <label className="adm-field">
          <span>Name</span>
          <input value={form.name} onChange={set("name")} required />
        </label>
        <label className="adm-field">
          <span>Description</span>
          <textarea rows={3} value={form.description} onChange={set("description")} />
        </label>
        <div className="adm-row">
          <label className="adm-field">
            <span>Price (₹)</span>
            <input type="number" min="1" step="0.01" value={form.price} onChange={set("price")} required />
          </label>
          <label className="adm-field">
            <span>Stock</span>
            <input type="number" min="0" step="1" value={form.stock} onChange={set("stock")} required />
          </label>
        </div>
        <label className="adm-field">
          <span>Badge (optional)</span>
          <input value={form.badge} onChange={set("badge")} placeholder="e.g. Website Exclusive" />
        </label>
        <label className="adm-switch">
          <input type="checkbox" checked={form.active} onChange={set("active")} />
          <span className="adm-switch__track" />
          Show in shop
        </label>

        {error && <p className="adm-error">{error}</p>}

        <div className="modal__foot">
          <button type="button" className="abtn abtn--ghost" onClick={onClose}>Cancel</button>
          <button className="abtn abtn--primary" disabled={saving || uploading}>{saving ? "Saving…" : isNew ? "Add product" : "Save changes"}</button>
        </div>
      </form>
    </div>
    </Portal>
  );
}
