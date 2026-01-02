import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.auth.me();
                setUser(res);
                setError(null);
            } catch (err) {
                console.error("ME failed:", err.response?.status, err.message);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
                setError("Session expired. Please login again.");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
        setError(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                isAuthenticated: !!user?.id,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
