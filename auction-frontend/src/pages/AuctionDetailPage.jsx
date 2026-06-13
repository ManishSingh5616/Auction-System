import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Countdown from "../components/auction/Countdown";

const SOCKET_URL = "http://localhost:5000";

export default function AuctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Bidding state
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Fetch auction
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        setAuction(res.data.auction);
      } catch {
        setError("Auction not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  // Socket.IO connection
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_auction", id);
    });

    socket.on("disconnect", () => setConnected(false));

    // Receive bid history on join
    socket.on("bid_history", (history) => {
      setBids(history);
    });

    // New real-time bid
    socket.on("new_bid", (bidData) => {
      setBids((prev) => [bidData, ...prev]);
      setAuction((prev) => prev ? ({
        ...prev,
        currentPrice: bidData.currentPrice,
        totalBids: bidData.totalBids,
      }) : prev);
      setBidLoading(false);
      if (user && bidData.bidder._id === user._id) {
        setBidSuccess(`✅ Your bid of $${bidData.amount.toLocaleString()} was placed!`);
        setBidAmount("");
        setTimeout(() => setBidSuccess(""), 4000);
      }
    });

    socket.on("bid_error", ({ message }) => {
      setBidError(message);
      setBidLoading(false);
      setTimeout(() => setBidError(""), 5000);
    });

    return () => {
      socket.emit("leave_auction", id);
      socket.disconnect();
    };
  }, [id, user]);

  const handleBid = () => {
    const amount = Number(bidAmount);
    if (!amount || isNaN(amount)) { setBidError("Enter a valid bid amount."); return; }
    setBidError("");
    setBidSuccess("");
    setBidLoading(true);
    socketRef.current?.emit("place_bid", { auctionId: id, amount });
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this auction?")) return;
    setDeleting(true);
    try {
      await api.delete(`/auctions/${id}`);
      navigate("/auctions");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
      setDeleting(false);
    }
  };

  const isOwner = user && auction && auction.seller?._id === user._id;
  const isBidder = user?.role === "bidder";
  const minBid = auction ? auction.currentPrice + auction.bidIncrement : 0;

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontFamily: "'DM Sans', sans-serif" }}>Loading...</div>;
  if (error || !auction) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#e55", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>;

  const images = auction.images?.length > 0 ? auction.images : ["https://placehold.co/600x400/141414/666?text=No+Image"];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>

      <nav style={{ borderBottom: "1px solid #1e1e1e", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/auctions" style={{ textDecoration: "none", color: "#666", fontSize: "0.85rem" }}>← Back to Auctions</Link>
        <Link to="/" style={{ textDecoration: "none", color: "#f0ede6", fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>AUCTIONEER</Link>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: connected ? "#4ade80" : "#666", display: "inline-block" }} />
          <span style={{ color: "#555", fontSize: "0.75rem" }}>{connected ? "Live" : "Connecting..."}</span>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
        {/* Left: Images */}
        <div>
          <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "1rem", background: "#141414", aspectRatio: "4/3" }}>
            <img src={images[activeImg]} alt={auction.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = "https://placehold.co/600x400/141414/666?text=No+Image"; }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: "70px", height: "70px", borderRadius: "8px", overflow: "hidden", border: i === activeImg ? "2px solid #e8c547" : "2px solid transparent", padding: 0, cursor: "pointer", background: "#141414" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Bid history */}
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "1rem" }}>Bid History ({bids.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "300px", overflowY: "auto" }}>
              {bids.length === 0 ? (
                <p style={{ color: "#444", fontSize: "0.85rem" }}>No bids yet. Be the first!</p>
              ) : bids.map((bid, i) => (
                <div key={bid._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "#141414", borderRadius: "8px", border: i === 0 ? "1px solid #e8c54744" : "1px solid transparent" }}>
                  <div>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{bid.bidder?.name}</span>
                    {i === 0 && <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "#e8c547" }}>↑ Winning</span>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#e8c547", fontWeight: 700, margin: 0 }}>${bid.amount?.toLocaleString()}</p>
                    <p style={{ color: "#555", fontSize: "0.7rem", margin: 0 }}>{new Date(bid.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details + Bidding */}
        <div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, background: auction.status === "active" ? "#4ade8022" : "#88888822", color: auction.status === "active" ? "#4ade80" : "#888" }}>
              {auction.status.toUpperCase()}
            </span>
            <span style={{ padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", background: "#1e1e1e", color: "#888" }}>{auction.category}</span>
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, margin: "0 0 1rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{auction.title}</h1>
          <p style={{ color: "#999", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>{auction.description}</p>

          {auction.status === "active" && (
            <div style={{ background: "#141414", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#666", fontSize: "0.75rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Time Remaining</p>
              <Countdown endTime={auction.endTime} />
            </div>
          )}

          {/* Price */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#141414", borderRadius: "12px", padding: "1.25rem" }}>
              <p style={{ color: "#666", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current Bid</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e8c547", fontFamily: "'Syne', sans-serif", margin: 0 }}>${auction.currentPrice?.toLocaleString()}</p>
            </div>
            <div style={{ background: "#141414", borderRadius: "12px", padding: "1.25rem" }}>
              <p style={{ color: "#666", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Bids</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>{auction.totalBids}</p>
            </div>
          </div>

          {/* ── Bid section ─────────────────────────────────────── */}
          {auction.status === "active" && isBidder && !isOwner && (
            <div style={{ background: "#141414", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                Place Your Bid — Min: <span style={{ color: "#e8c547" }}>${minBid.toLocaleString()}</span>
              </p>

              {bidError && <div style={{ background: "#e5555522", border: "1px solid #e55555", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1rem", color: "#e55555", fontSize: "0.85rem" }}>{bidError}</div>}
              {bidSuccess && <div style={{ background: "#4ade8022", border: "1px solid #4ade80", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1rem", color: "#4ade80", fontSize: "0.85rem" }}>{bidSuccess}</div>}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#666", fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={minBid.toString()}
                    min={minBid}
                    style={{ width: "100%", background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "0.75rem 1rem 0.75rem 2rem", color: "#f0ede6", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
                    onKeyDown={(e) => e.key === "Enter" && handleBid()}
                  />
                </div>
                <button
                  onClick={handleBid}
                  disabled={bidLoading || !connected}
                  style={{ background: "#e8c547", color: "#0a0a0a", border: "none", borderRadius: "8px", padding: "0.75rem 1.5rem", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", opacity: bidLoading ? 0.7 : 1 }}
                >
                  {bidLoading ? "Placing..." : "Bid Now"}
                </button>
              </div>

              <p style={{ color: "#444", fontSize: "0.75rem", marginTop: "0.75rem" }}>
                Bid increment: ${auction.bidIncrement} · Current winner takes the item if no higher bid is placed
              </p>
            </div>
          )}

          {auction.status === "active" && user?.role === "consignor" && !isOwner && (
            <div style={{ background: "#1e1e1e", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>Consignors cannot place bids. Switch to a bidder account to bid.</p>
            </div>
          )}

          {!user && (
            <Link to="/login" style={{ display: "block", background: "#e8c547", color: "#0a0a0a", padding: "1rem", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: 700, marginBottom: "1.5rem" }}>
              Login to Place a Bid
            </Link>
          )}

          {/* Seller info */}
          <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "1.5rem" }}>
            <p style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Listed by</p>
            <p style={{ fontWeight: 500, margin: "0 0 0.25rem" }}>{auction.seller?.name}</p>
            <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>{auction.seller?.email}</p>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <Link to={`/auctions/${auction._id}/edit`} style={{ flex: 1, background: "#1e1e1e", color: "#f0ede6", padding: "0.75rem", borderRadius: "8px", textAlign: "center", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Edit</Link>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, background: "#e55555", color: "#fff", padding: "0.75rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "0.9rem" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
