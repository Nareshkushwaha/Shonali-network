import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../config/api";

const AdminSettings = () => {
  const { user: currentUser, logout } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null); 
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passStatus, setPassStatus] = useState<{type: 'error' | 'success' | null, message: string}>({type: null, message: ""});

  useEffect(() => {
    // 🔥 FIX: TypeScript ko shant karne ke liye (as any) lagaya
    setName((currentUser as any)?.name || (currentUser as any)?.username || "Administrator");
    setEmail((currentUser as any)?.email || "admin@shonalinetwork.com");
    if ((currentUser as any)?.avatar) {
      const baseUrl = API_URL.replace('/api', '');
      setAvatarUrl(`${baseUrl}${(currentUser as any).avatar}`);
    }
  }, [currentUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string); 
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("shonali_token");
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile);

      await axios.put(`${API_URL}/admin/profile`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); 
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if(!window.confirm("Are you sure you want to reset changes?")) return;
    // 🔥 FIX: Yahan bhi (as any) lagaya
    setName((currentUser as any)?.name || (currentUser as any)?.username || "Administrator");
    setAvatarFile(null);
    if ((currentUser as any)?.avatar) {
        const baseUrl = API_URL.replace('/api', '');
        setAvatarUrl(`${baseUrl}${(currentUser as any).avatar}`);
    } else {
        setAvatarUrl("");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatus({ type: null, message: "Updating..." });
    
    try {
      const token = localStorage.getItem("shonali_token");
      await axios.put(`${API_URL}/admin/password`, { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPassStatus({ type: 'success', message: "Security Key Updated Successfully!" });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setOldPassword("");
        setNewPassword("");
        setPassStatus({ type: null, message: "" });
      }, 2000);
    } catch (error: any) {
      setPassStatus({ type: 'error', message: error.response?.data?.message || "Failed to update password" });
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AD";
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <main className="pt-8 pb-12 px-6 min-h-screen relative max-w-4xl mx-auto bg-slate-50/50">
        
        <div className="mb-8 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
            <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase">System Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Configuration Studio</h2>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Personal Identity</h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Manage your admin profile</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">badge</span>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                  {avatarUrl ? (
                    <img alt="Profile" className="w-20 h-20 rounded-xl object-cover ring-2 ring-slate-100 shadow-sm" src={avatarUrl} />
                  ) : (
                    <div className="w-20 h-20 rounded-xl ring-2 ring-slate-100 bg-slate-900 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                      {getInitials(name)}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-white text-[20px]">add_a_photo</span>
                  </div>
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />

                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                      <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Email</label>
                      <input 
                        value={email} 
                        disabled 
                        className="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg px-3 text-sm text-slate-500 cursor-not-allowed" 
                        type="email" 
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Security & Access</h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Manage credentials</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">security</span>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-white text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">password</span>
                  Change Password
                </button>
                <button onClick={logout} className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-red-50 text-red-600 font-bold text-xs border border-red-100 hover:bg-red-100 transition-all">
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out Securely
                </button>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="text-green-600 text-xs font-bold mr-auto flex items-center gap-1 animate-in fade-in">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Preferences Saved
              </span>
            )}
            <button onClick={handleReset} className="h-10 px-6 bg-white text-slate-600 font-bold text-xs rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
              Reset
            </button>
            <button onClick={handleSave} disabled={loading} className="h-10 px-8 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
              {loading ? "Saving..." : <><span className="material-symbols-outlined text-[16px]">save</span> Save Configuration</>}
            </button>
          </div>
        </div>
      </main>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800">Change Security Key</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm outline-none focus:border-blue-500" />
              </div>
              {passStatus.message && (
                <p className={`text-[11px] font-bold ${passStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {passStatus.message}
                </p>
              )}
              <button type="submit" className="w-full h-10 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-all mt-2">
                Update Protocol
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;