import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const role = data.user.role;
      if (role === "consignor") navigate("/consignor/dashboard");
      else if (role === "admin") navigate("/admin");
      else navigate("/bidder/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
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

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.5rem" }}>
            AUCTIONEER
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Sign in to continue</p>
        </div>

        {error && (
          <div style={{ background: "#e5555522", border: "1px solid #e55555", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", color: "#e55555", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputStyle} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={inputStyle} />

          <button type="submit" disabled={loading} style={{ background: "#e8c547", color: "#0a0a0a", border: "none", borderRadius: "8px", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.85rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e8c547", textDecoration: "none", fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
