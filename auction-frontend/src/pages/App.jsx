import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Auction pages
import AuctionsPage from "./pages/AuctionsPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import EditAuctionPage from "./pages/EditAuctionPage";

// Role dashboards
import BidderDashboard from "./pages/bidder/BidderDashboard";
import ConsignorDashboard from "./pages/consignor/ConsignorDashboard";

// ── Route guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard
    if (user.role === "consignor") return <Navigate to="/consignor/dashboard" replace />;
    return <Navigate to="/bidder/dashboard" replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return children;
  if (user.role === "consignor") return <Navigate to="/consignor/dashboard" replace />;
  return <Navigate to="/bidder/dashboard" replace />;
}

// ── Smart root redirect ───────────────────────────────────────────────────────
function RootRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/auctions" replace />;
  if (user.role === "consignor") return <Navigate to="/consignor/dashboard" replace />;
  return <Navigate to="/bidder/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Public auction browsing */}
      <Route path="/auctions" element={<AuctionsPage />} />
      <Route path="/auctions/:id" element={<AuctionDetailPage />} />

      {/* Consignor only */}
      <Route path="/auctions/create" element={<ProtectedRoute allowedRoles={["consignor", "admin"]}><CreateAuctionPage /></ProtectedRoute>} />
      <Route path="/auctions/:id/edit" element={<ProtectedRoute allowedRoles={["consignor", "admin"]}><EditAuctionPage /></ProtectedRoute>} />
      <Route path="/consignor/dashboard" element={<ProtectedRoute allowedRoles={["consignor", "admin"]}><ConsignorDashboard /></ProtectedRoute>} />

      {/* Bidder only */}
      <Route path="/bidder/dashboard" element={<ProtectedRoute allowedRoles={["bidder"]}><BidderDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/auctions" replace />} />
    </Routes>
  );
}
