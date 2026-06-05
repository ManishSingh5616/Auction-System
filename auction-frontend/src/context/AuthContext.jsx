import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while checking session

    // On app load: check if a valid session cookie exists
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await api.get("/auth/me");
                setUser(data.user);
            } catch {
                setUser(null); // no valid session — that's fine
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    // ── Register ────────────────────────────────────────
    const register = async (name, email, password) => {
        const { data } = await api.post("/auth/register", { name, email, password });
        setUser(data.user);
        return data;
    };

    // ── Login ───────────────────────────────────────────
    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        setUser(data.user);
        return data;
    };

    // ── Logout ──────────────────────────────────────────
    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy consumption
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
