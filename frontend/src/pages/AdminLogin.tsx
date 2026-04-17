import { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const forceClearData = () => {
    localStorage.removeItem("token");
    setErrorMsg("✅ Old data cleared! You can login fresh now.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMsg(""); 

    if (!email || !password) {
      return setErrorMsg("Please fill in both email and password.");
    }

    try {
      setLoading(true);
      const res = await axios.post("https://shonalinetworks.com/api/admin/login", {
        email,
        password,
      });

      // Naya token save hoga (purana apne aap hat jayega)
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin-dashboard";

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Server not responding. Is Backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container: Ab left-right nahi, seedha center me form aayega
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4">
      
      {/* Login Form Card */}
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        
        {/* Chota Icon (Kyunki left branding hata di) */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-4xl text-white">campaign</span>
          </div>
        </div>
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Please enter your admin credentials.</p>
        </div>

        {errorMsg && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center justify-center gap-2 ${errorMsg.includes('✅') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            <span className="material-symbols-outlined text-lg">{errorMsg.includes('✅') ? 'check_circle' : 'error'}</span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Admin Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              <input
                type="email"
                placeholder="admin@shonalinetwork.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Security Key</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:bg-slate-300 disabled:shadow-none flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">sync</span>
            ) : (
              <>
                Authenticate <span className="material-symbols-outlined text-sm">login</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Troubleshooting Button (Ab card ke theek neeche center me) */}
      <button 
        onClick={forceClearData}
        className="mt-8 text-xs text-slate-400 hover:text-red-500 underline flex items-center gap-1 transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">delete_history</span>
        Force Logout / Clear Data
      </button>

    </div>
  );
};

export default AdminLogin;