import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";

export default function ConsignorDashboard() {
  const { user } = useContext(AuthContext);
  const [auctions, setAuctions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    api.get("/auctions/user/my-auctions")
      .then((res) => {
        setAuctions(res.data.auctions);
        setTotalEarnings(res.data.totalEarnings || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this auction?")) return;
    try {
      await api.delete(`/auctions/${id}`);
      setAuctions((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete.");
    }
  };

  const activeListings = auctions.filter((a) => a.status === "active");
  const soldListings = auctions.filter((a) => a.status === "ended" && a.winner);
  const unsoldListings = auctions.filter((a) => a.status === "ended" && !a.winner);
  const draftListings = auctions.filter((a) => a.status === "draft");

  const tabMap = { active: activeListings, sold: soldListings, unsold: unsoldListings, all: auctions };
  const displayAuctions = tabMap[tab];

  const totalBidsReceived = auctions.reduce((s, a) => s + (a.totalBids || 0), 0);
  const avgSalePrice = soldListings.length > 0
    ? Math.round(soldListings.reduce((s, a) => s + a.currentPrice, 0) / soldListings.length)
    : 0;

  const statBox = (label, value, color = "#f0ede6", sub = null) => (
    <div style={{ background: "#141414", borderRadius: "12px", padding: "1.5rem", border: "1px solid #1e1e1e" }}>
      <p style={{ color: "#555", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>{label}</p>
      <p style={{ color, fontFamily: "'Syne', sans-serif", fontSize: "1.75rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ color: "#444", fontSize: "0.72rem", margin: "0.3rem 0 0" }}>{sub}</p>}
    </div>
  );

  const statusColor = { active: "#4ade80", ended: "#888", cancelled: "#e55555", draft: "#e8c547" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>
              Seller Dashboard
            </h1>
            <p style={{ color: "#555", fontSize: "0.9rem", margin: 0 }}>Manage your listings and track your sales</p>
          </div>
          <Link to="/auctions/create" style={{ background: "#e8c547", color: "#0a0a0a", padding: "0.6rem 1.25rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}>
            + New Listing
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {statBox("Total Earnings", `$${totalEarnings.toLocaleString()}`, "#4ade80", "from sold items")}
          {statBox("Active Listings", activeListings.length, "#e8c547", "currently live")}
          {statBox("Items Sold", soldListings.length, "#a78bfa", "successfully")}
          {statBox("Bids Received", totalBidsReceived, "#60a5fa", "across all listings")}
        </div>

        {/* Live auctions callout */}
        {activeListings.length > 0 && (
          <div style={{ background: "#141414", border: "1px solid #4ade8033", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
                {activeListings.length} listing{activeListings.length !== 1 ? "s" : ""} currently live
              </p>
              <p style={{ margin: 0, color: "#555", fontSize: "0.8rem" }}>
                — {activeListings.reduce((s, a) => s + a.totalBids, 0)} total bids received
              </p>
            </div>
            <Link to="/auctions" style={{ color: "#4ade80", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
              View live auctions →
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", borderBottom: "1px solid #1e1e1e" }}>
          {[
            ["active", `Live (${activeListings.length})`],
            ["sold", `Sold (${soldListings.length})`],
            ["unsold", `Unsold (${unsoldListings.length})`],
            ["all", `All (${auctions.length})`],
          ].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{ padding: "0.65rem 1.25rem", background: "transparent", border: "none", borderBottom: tab === val ? "2px solid #a78bfa" : "2px solid transparent", color: tab === val ? "#a78bfa" : "#555", cursor: "pointer", fontSize: "0.85rem", fontWeight: tab === val ? 600 : 400, fontFamily: "'DM Sans', sans-serif", marginBottom: "-1px", transition: "color 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Listings */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ height: "88px", background: "#141414", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : displayAuctions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📦</p>
            <p style={{ color: "#444" }}>
              {tab === "active" ? "No live listings." : tab === "sold" ? "No items sold yet." : "No listings found."}
            </p>
            <Link to="/auctions/create" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600, display: "inline-block", marginTop: "1rem", fontSize: "0.9rem" }}>
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {displayAuctions.map((auction) => {
              const img = auction.images?.[0] || "https://placehold.co/72x72/141414/444?text=?";
              const isSold = auction.status === "ended" && auction.winner;
              return (
                <div key={auction._id} style={{ background: "#141414", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "center", border: `1px solid ${isSold ? "#a78bfa33" : "#1e1e1e"}` }}>
                  <img src={img} alt="" onError={(e) => { e.target.src = "https://placehold.co/72x72/141414/444?text=?"; }} style={{ width: "72px", height: "72px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/auctions/${auction._id}`} style={{ textDecoration: "none" }}>
                      <p style={{ fontWeight: 600, margin: "0 0 0.3rem", fontSize: "0.95rem", color: "#f0ede6", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{auction.title}</p>
                    </Link>
                    <p style={{ color: "#555", fontSize: "0.8rem", margin: 0 }}>
                      {isSold ? (
                        <>Sold for <span style={{ color: "#4ade80", fontWeight: 600 }}>${auction.currentPrice?.toLocaleString()}</span></>
                      ) : (
                        <>Current: <span style={{ color: "#e8c547", fontWeight: 600 }}>${auction.currentPrice?.toLocaleString()}</span></>
                      )}
                      {" · "}{auction.totalBids} bids
                      {" · "}Ends {new Date(auction.endTime).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ background: statusColor[auction.status] + "22", color: statusColor[auction.status], padding: "0.2rem 0.7rem", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600 }}>
                      {isSold ? "✓ Sold" : auction.status}
                    </span>
                    {auction.status === "active" && auction.totalBids === 0 && (
                      <>
                        <Link to={`/auctions/${auction._id}/edit`} style={{ background: "#1e1e1e", color: "#888", padding: "0.3rem 0.7rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.78rem" }}>Edit</Link>
                        <button onClick={(e) => handleDelete(auction._id, e)} style={{ background: "#e5555522", color: "#e55555", border: "none", padding: "0.3rem 0.7rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payout summary for sold items */}
        {soldListings.length > 0 && (
          <div style={{ marginTop: "3rem", background: "#141414", borderRadius: "16px", padding: "2rem", border: "1px solid #1e1e1e" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1.5rem", letterSpacing: "-0.01em" }}>
              💰 Payout Records
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {soldListings.map((auction) => (
                <div key={auction._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #1a1a1a" }}>
                  <div>
                    <p style={{ margin: "0 0 0.15rem", fontWeight: 500, fontSize: "0.9rem" }}>{auction.title}</p>
                    <p style={{ margin: 0, color: "#555", fontSize: "0.75rem" }}>
                      {auction.totalBids} bids · Ended {new Date(auction.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#4ade80", fontWeight: 700, margin: "0 0 0.1rem", fontFamily: "'Syne', sans-serif" }}>
                      +${auction.currentPrice?.toLocaleString()}
                    </p>
                    <p style={{ color: "#555", fontSize: "0.72rem", margin: 0 }}>received</p>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem" }}>
                <p style={{ fontWeight: 600, margin: 0 }}>Total</p>
                <p style={{ color: "#4ade80", fontWeight: 800, fontFamily: "'Syne', sans-serif", fontSize: "1.25rem", margin: 0 }}>
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
