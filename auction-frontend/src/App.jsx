import { Routes, Route, Navigate } from "react-router-dom"; 
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Week 1 pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// Week 2 pages
import AuctionsPage from "./pages/AuctionsPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import EditAuctionPage from "./pages/EditAuctionPage";

// Route guard: redirect to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// Route guard: redirect to /auctions if already logged in
function GuestRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return !user ? children : <Navigate to="/auctions" replace />;
}

export default function App() {
  return (
  <Routes>
    <Route path="/" element={<Navigate to="/auctions" replace />} />
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/auctions" element={<AuctionsPage />} />
    <Route path="/auctions/:id" element={<AuctionDetailPage />} />
    <Route path="/auctions/create" element={<ProtectedRoute><CreateAuctionPage /></ProtectedRoute>} />
    <Route path="/auctions/:id/edit" element={<ProtectedRoute><EditAuctionPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/auctions" replace />} />
  </Routes>
  );
}
