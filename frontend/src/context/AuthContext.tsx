import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";

interface User {
  id: string;
  username: string; // Database mein name hai toh isko name bhi kar sakte ho, par abhi yahi theek hai
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("shonali_token");
    const storedUser = localStorage.getItem("shonali_user");

    // 🔥 FIX: Safety Lock Lagaya Hai (Crash hone se bachane ke liye)
    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Local storage error, clearing data...");
        localStorage.removeItem("shonali_token");
        localStorage.removeItem("shonali_user");
      }
    } else if (storedUser === "undefined") {
        // Agar pehle se kachra hai, toh delete kar do
        localStorage.removeItem("shonali_token");
        localStorage.removeItem("shonali_user");
    }
    
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("shonali_token", newToken);
    localStorage.setItem("shonali_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("shonali_token");
    localStorage.removeItem("shonali_user");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/admin-login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};