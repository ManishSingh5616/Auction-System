import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-indigo-600">AuctionHub</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Hey, <span className="font-medium text-gray-900">{user?.name}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Body */}
            <div className="max-w-4xl mx-auto px-6 py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <span className="text-2xl">🎉</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Week 1 Complete!</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Authentication is working. You're logged in as <strong>{user?.email}</strong>.
                    Week 2 will add auction listings here.
                </p>

                {/* User info card */}
                <div className="mt-8 inline-block bg-white border border-gray-200 rounded-2xl px-8 py-6 text-left min-w-64">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Your account</p>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between gap-8">
                            <span className="text-gray-500">Name</span>
                            <span className="font-medium text-gray-900">{user?.name}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium text-gray-900">{user?.email}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-gray-500">Role</span>
                            <span className="font-medium text-gray-900 capitalize">{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
