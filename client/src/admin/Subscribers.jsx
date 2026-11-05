import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { adminFetch, formatDate } from "./api";

export default function Subscribers() {
  const [list, setList] = useState(null);

  const load = () => adminFetch("/subscribers").then(setList).catch(() => {});
  useEffect(() => { load(); }, []);

  const remove = async (s) => {
    if (!window.confirm(`Remove ${s.email}?`)) return;
    await adminFetch(`/subscribers/${s._id}`, { method: "DELETE" });
    load();
  };

  const exportCsv = () => {
    const rows = ["email,subscribed_at", ...list.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "subscribers.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <div>
          <p className="adm-eyebrow">Newsletter</p>
          <h1>Subscribers {list && <span className="adm-count">{list.length}</span>}</h1>
        </div>
        <button className="abtn abtn--ghost" onClick={exportCsv} disabled={!list?.length}>
          <Download size={16} /> <span>Export CSV</span>
        </button>
      </header>

      <section className="panel">
        {!list ? (
          <div className="adm-loading">Loading…</div>
        ) : list.length === 0 ? (
          <p className="adm-muted">No subscribers yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="atable atable--subs">
              <thead><tr><th>Email</th><th className="desktop-only">Subscribed</th><th /></tr></thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="cell-main">{s.email}</div>
                      <div className="cell-sub mobile-only">{formatDate(s.createdAt)}</div>
                    </td>
                    <td className="adm-muted desktop-only">{formatDate(s.createdAt)}</td>
                    <td className="num">
                      <button className="icon-btn" onClick={() => remove(s)} aria-label={`Remove ${s.email}`}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
