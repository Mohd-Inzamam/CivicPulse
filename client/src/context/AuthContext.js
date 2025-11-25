// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify authentication on mount
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");

                if (!token) {
                    setLoading(false);
                    return;
                }

                // Parse stored user
                let userData = null;
                if (storedUser) {
                    try {
                        userData = JSON.parse(storedUser);
                    } catch (e) {
                        console.error("Failed to parse user data:", e);
                    }
                }

                // Verify token with backend
                const res = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });

                if (!res.ok) {
                    console.log("AuthContext: Token invalid — clearing storage");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("userRole");
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                const verifiedUser = data.data?.user || data.user || userData;

                setUser(verifiedUser);
                setLoading(false);
            } catch (error) {
                console.error("AuthContext: Verification error:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("userRole");
                setUser(null);
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

