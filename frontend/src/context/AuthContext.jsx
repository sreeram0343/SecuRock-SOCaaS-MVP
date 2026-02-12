import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // Verify token/fetch user logic here if needed, or just assume logged in for MVP
            // For MVP, we decode or fetch simple user info
            setUser({ username: "admin" }); // Mock
            setLoading(false);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            // Using port 8000 for backend and /login endpoint
            const res = await axios.post("http://localhost:8000/api/auth/login", formData);
            const access_token = res.data.access_token;
            localStorage.setItem("access_token", access_token);
            setToken(access_token);
            return true;
        } catch (e) {
            console.error("Login failed:", e.response?.data?.detail || e.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
