import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";

export default function ConsignorProfile() {
  const { user } = useContext(AuthContext);

  const row = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 0", borderBottom: "1px solid #1a1a1a" }}>
      <span style={{ color: "#555", fontSize: "0.85rem" }}>{label}</span>
      <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "3rem auto", padding: "0 2rem" }}>
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "3rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#1e1e1e", border: "2px solid #a78bfa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: "1rem", color: "#f0ede6" }}>
            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.25rem" }}>{user?.name}</h1>
          <span style={{ background: "#a78bfa22", color: "#a78bfa", padding: "0.2rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600 }}>🏛️ Consignor</span>
        </div>

        {/* Info */}
        <div style={{ background: "#141414", borderRadius: "16px", padding: "1.5rem 2rem", border: "1px solid #1e1e1e" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Account Info</h2>
          {row("Name", user?.name)}
          {row("Email", user?.email)}
          {row("Role", "Consignor / Seller")}
          {row("Permissions", "List items, track sales")}
          {row("Member since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—")}
        </div>

        <p style={{ color: "#333", fontSize: "0.8rem", textAlign: "center", marginTop: "2rem" }}>Profile editing coming in a future update.</p>
      </div>
    </div>
  );
}
