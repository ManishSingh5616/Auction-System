import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState("bidder");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, role);
      navigate(role === "consignor" ? "/consignor/dashboard" : "/bidder/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#141414", border: "1px solid #2a2a2a",
    borderRadius: "8px", padding: "0.75rem 1rem", color: "#f0ede6",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#f0ede6", padding: "2rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input:focus { border-color: #e8c547 !important; outline: none; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.5rem" }}>Create Account</h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Choose how you want to use Auctioneer</p>
        </div>

        {/* Role selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { value: "bidder", label: "Bidder", icon: "🏷️", desc: "Browse & place bids" },
            { value: "consignor", label: "Consignor", icon: "🏛️", desc: "List & sell items" },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              style={{
                padding: "1.25rem 1rem", borderRadius: "12px", border: "2px solid",
                borderColor: role === r.value ? "#e8c547" : "#2a2a2a",
                background: role === r.value ? "#e8c54711" : "#141414",
                color: "#f0ede6", cursor: "pointer", textAlign: "center", transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{r.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: role === r.value ? "#e8c547" : "#f0ede6" }}>{r.label}</div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.2rem" }}>{r.desc}</div>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "#e5555522", border: "1px solid #e55555", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", color: "#e55555", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputStyle} />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={inputStyle} />

          <button type="submit" disabled={loading} style={{ background: "#e8c547", color: "#0a0a0a", border: "none", borderRadius: "8px", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Creating account..." : `Register as ${role === "bidder" ? "Bidder 🏷️" : "Consignor 🏛️"}`}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.85rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#e8c547", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
