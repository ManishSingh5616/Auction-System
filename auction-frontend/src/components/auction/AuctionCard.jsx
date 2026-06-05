import { Link } from "react-router-dom";
import Countdown from "./Countdown";

export default function AuctionCard({ auction }) {
  const img = auction.images?.[0] || "https://placehold.co/400x300/141414/555?text=No+Image";

  return (
    <Link to={`/auctions/${auction._id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{
        background: "#141414", borderRadius: "12px", overflow: "hidden",
        border: "1px solid #1e1e1e", transition: "border-color 0.2s, transform 0.2s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {/* Image */}
        <div style={{ position: "relative", paddingTop: "66%", background: "#1a1a1a" }}>
          <img
            src={img}
            alt={auction.title}
            onError={(e) => { e.target.src = "https://placehold.co/400x300/1a1a1a/555?text=No+Image"; }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Category badge */}
          <span style={{ position: "absolute", top: "10px", left: "10px", background: "#0a0a0acc", color: "#aaa", padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.7rem", backdropFilter: "blur(4px)" }}>
            {auction.category}
          </span>
          {/* Status badge */}
          {auction.status !== "active" && (
            <span style={{ position: "absolute", top: "10px", right: "10px", background: "#e5555588", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.7rem" }}>
              {auction.status}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {auction.title}
          </h3>

          {/* Countdown */}
          {auction.status === "active" && (
            <div style={{ marginBottom: "0.75rem" }}>
              <Countdown endTime={auction.endTime} compact />
            </div>
          )}

          {/* Price + bids */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.15rem" }}>Current Bid</p>
              <p style={{ color: "#e8c547", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>
                ${auction.currentPrice?.toLocaleString()}
              </p>
            </div>
            <p style={{ color: "#555", fontSize: "0.8rem", margin: 0 }}>
              {auction.totalBids} bid{auction.totalBids !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
