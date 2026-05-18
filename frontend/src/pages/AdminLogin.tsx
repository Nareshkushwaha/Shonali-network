import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login: authLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMsg(""); 

    if (!email || !password) return setErrorMsg("Please fill in both email and password.");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/admin/login`, { email, password });
      
      // 🔥 FIX: 'res.data.user' ki jagah 'res.data.admin' aayega kyunki backend yahi bhej raha hai!
      // Sath hi hum check kar lenge ki token aaya bhi hai ya nahi
      if (res.data.token && res.data.admin) {
        authLogin(res.data.token, res.data.admin);
        window.location.href = "/admin-dashboard";
      } else {
        setErrorMsg("Server se sahi data nahi aaya.");
      }
      
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-center mb-8">Admin Login</h2>
        {errorMsg && <p className="text-red-500 text-center font-semibold mb-4">{errorMsg}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg">
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;