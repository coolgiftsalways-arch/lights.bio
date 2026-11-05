import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { adminFetch, getToken, setToken } from "./api";
import "./admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (getToken()) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminFetch("/login", { method: "POST", body: { email, password } });
      setToken(data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="adm adm-login">
      <div className="adm-login__glow" />
      <form className="adm-login__card" onSubmit={submit}>
        <div className="adm-login__icon"><Lock size={22} /></div>
        <p className="adm-brand">lights.bio</p>
        <h1>Admin sign in</h1>
        <p className="adm-muted">Manage orders, products and subscribers.</p>

        <label className="adm-field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label className="adm-field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        {error && <p className="adm-error">{error}</p>}

        <button className="abtn abtn--primary abtn--block" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
