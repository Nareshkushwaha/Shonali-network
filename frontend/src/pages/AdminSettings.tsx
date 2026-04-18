import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext"; 

const AdminSettings = () => {
  const { currentUser, updateUser, changePassword, searchQuery } = useData();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false); 
  
  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passStatus, setPassStatus] = useState<{type: 'error' | 'success' | null, message: string}>({type: null, message: ""});

  const sQuery = searchQuery.toLowerCase();
  const showUserSection = !searchQuery || "user profile name email identity".includes(sQuery);
  const showSecuritySection = !searchQuery || "security password lock session 2fa key".includes(sQuery);

  useEffect(() => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setAvatarUrl(currentUser?.avatarUrl || "");
  }, [currentUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({ name, email, avatarUrl });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); 
  };

  const handleReset = () => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setAvatarUrl(currentUser?.avatarUrl || "");
    alert("Profile settings reset to last saved state.");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatus({ type: null, message: "Updating..." });
    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      setPassStatus({ type: 'success', message: "Password Updated Successfully!" });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setOldPassword("");
        setNewPassword("");
        setPassStatus({ type: null, message: "" });
      }, 2000);
    } else {
      setPassStatus({ type: 'error', message: result.error || "Update failed." });
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AD";
    const words = nameStr.split(" ");
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      {/* 🔥 FIX: blueprint-grid hata diya aur padding set ki */}
      <main className="pt-10 pb-12 px-4 md:px-8 min-h-screen relative">
        
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">System Hub</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Configuration Studio</h2>
          <p className="text-sm md:text-base text-slate-500 mt-2 font-medium">
            {searchQuery ? `Searching settings for "${searchQuery}"` : "Calibrate your digital infrastructure and identity."}
          </p>
        </div>

        {/* 🔥 FIX: Bekaar ka 12-col grid hata kar ek saaf single column lagaya max-w-4xl */}
        <div className="max-w-4xl space-y-8 relative z-10">
          
          {/* USER ARCHITECTURE SECTION */}
          {showUserSection && (
            <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] md:text-xs font-bold tracking-widest text-slate-400 uppercase">User Architecture</h3>
                  <p className="text-base md:text-lg font-bold text-on-surface">Personal Identity</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">person</span>
              </div>
              <div className="p-6 md:p-8">
                {/* 🔥 FIX: Mobile par photo center me aayegi, PC par side me */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8">
                  <div className="relative group shrink-0 cursor-pointer mx-auto md:mx-0" onClick={() => fileInputRef.current?.click()}>
                    {avatarUrl ? (
                      <img alt="Profile" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-slate-50 transition-all group-hover:brightness-90 bg-slate-200" src={avatarUrl} />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl ring-4 ring-slate-50 bg-blue-600 text-white flex items-center justify-center text-2xl md:text-3xl font-bold transition-all group-hover:brightness-90">
                        {getInitials(name)}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/40 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-white text-2xl md:text-3xl">add_a_photo</span>
                    </div>
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />

                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Architect Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" type="text" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Node</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" type="email" />
                      </div>
                    </div>
                    <div className="pt-2 flex justify-center md:justify-start">
                       <button onClick={() => fileInputRef.current?.click()} className="text-xs md:text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                         <span className="material-symbols-outlined text-[16px] md:text-[18px]">cloud_upload</span>
                         Update Profile Picture
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECURITY PROTOCOLS SECTION */}
          {showSecuritySection && (
            <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] md:text-xs font-bold tracking-widest text-slate-400 uppercase">Security Protocols</h3>
                  <p className="text-base md:text-lg font-bold text-on-surface">Access Control</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">shield</span>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center justify-center gap-2 py-3 md:py-3.5 px-4 md:px-6 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs md:text-sm hover:bg-blue-100 transition-all border border-blue-100">
                    <span className="material-symbols-outlined text-base md:text-lg">password</span>
                    Rotate Key (Change Password)
                  </button>
                  <button onClick={() => setIsSessionModalOpen(true)} className="flex items-center justify-center gap-2 py-3 md:py-3.5 px-4 md:px-6 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs md:text-sm hover:bg-slate-100 transition-all border border-slate-200">
                    <span className="material-symbols-outlined text-base md:text-lg">devices</span>
                    Manage Sessions (Active)
                  </button>
                </div>
              </div>
            </section>
          )}

          {!showUserSection && !showSecuritySection && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">search_off</span>
               <p className="text-slate-400 font-bold">No settings found matching "{searchQuery}"</p>
            </div>
          )}

          {/* ACTION BUTTONS 🔥 FIX: Form ke ekdum niche laga diye taaki layout fit rahe */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
            <button onClick={handleSave} className="flex-1 py-3.5 md:py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base w-full">
              <span className="material-symbols-outlined text-base md:text-lg">save</span>
              Commit Changes
            </button>
            <button onClick={handleReset} className="w-full sm:w-32 py-3.5 md:py-4 bg-white text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all border border-slate-200 text-sm md:text-base">
              Reset
            </button>
          </div>

          {/* Success Message popup */}
          {isSaved && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-4 py-3 rounded-xl text-center animate-in fade-in">
              Profile updated successfully!
            </div>
          )}

        </div>
      </main>

      {/* MODALS (PASSWORD & SESSION) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Change Security Key</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Current Password</label>
                <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 md:py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">New Password</label>
                <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 md:py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              {passStatus.message && <p className={`text-xs font-bold ${passStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{passStatus.message}</p>}
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 mt-2 text-sm">Update Password</button>
            </form>
          </div>
        </div>
      )}

      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Active Sessions</h3>
              <button onClick={() => setIsSessionModalOpen(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="material-symbols-outlined text-blue-600 text-2xl md:text-3xl">computer</span>
                  <div>
                    <p className="text-xs md:text-sm font-bold text-slate-900">Windows PC • Chrome</p>
                    <p className="text-[10px] md:text-xs text-blue-600 font-bold mt-0.5">Current Active Session</p>
                  </div>
                </div>
                <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold rounded-full">ONLINE</span>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-2">
                <button onClick={() => { alert("All other sessions logged out securely!"); setIsSessionModalOpen(false); }} className="w-full py-3 border-2 border-red-100 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors">Revoke All Other Sessions</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;