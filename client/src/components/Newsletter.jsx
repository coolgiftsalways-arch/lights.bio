import { useState } from "react";

export default function Newsletter({ variant = "banner" }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg(data.message);
      if (res.ok) setEmail("");
    } catch {
      setMsg("Something went wrong. Try again.");
    }
  };

  const input = (
    <input
      type="email"
      required
      placeholder="Enter Your Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      aria-label="Email address"
    />
  );

  return (
    <form className={`nl nl--${variant}`} onSubmit={submit}>
      {variant === "banner" ? (
        <div className="nl__field">
          {input}
          <button aria-label="Subscribe">→</button>
        </div>
      ) : (
        <>
          {input}
          <button className="pill pill--yellow">Become a Glow-Getter</button>
        </>
      )}
      {msg && <p className="nl__msg">{msg}</p>}
    </form>
  );
}