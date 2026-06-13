import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AuctionCard from "../components/auction/AuctionCard";
import AuctionFilters from "../components/auction/AuctionFilters";
import Navbar from "../components/layout/Navbar";

export default function AuctionsPage() {
  const { user } = useContext(AuthContext);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: "", category: "All", sort: "createdAt", page: 1 });

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.sort) params.set("sort", filters.sort);
      params.set("page", filters.page);
      params.set("limit", 12);
      const res = await api.get(`/auctions?${params.toString()}`);
      setAuctions(res.data.auctions);
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
    } catch {
      setError("Failed to load auctions.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchAuctions(); }, [fetchAuctions]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <Navbar />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 0.5rem" }}>
            Live Auctions
          </h1>
          <p style={{ color: "#555", fontSize: "0.9rem", margin: 0 }}>
            {pagination.total} items available — bid before time runs out
          </p>
        </div>

        <AuctionFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.5rem" }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ background: "#141414", borderRadius: "12px", height: "340px", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#e55" }}>{error}</div>
        ) : auctions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</p>
            <p style={{ color: "#555" }}>No auctions found. Try different filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.5rem" }}>
            {auctions.map((auction) => <AuctionCard key={auction._id} auction={auction} />)}
          </div>
        )}

        {pagination.pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))} style={{ width: "40px", height: "40px", borderRadius: "8px", background: pagination.page === i + 1 ? "#e8c547" : "#1a1a1a", color: pagination.page === i + 1 ? "#0a0a0a" : "#666", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
