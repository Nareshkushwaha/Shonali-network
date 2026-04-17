import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext";

const AdminBrochures = () => {
  // 🔥 DYNAMIC SEARCH: context se searchQuery nikal li
  const { brochureRequests, searchQuery } = useData();
  
  // Uploaded File ka status track karne ke liye
  const [activeBrochure, setActiveBrochure] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeRequests = brochureRequests || [];
  
  // 🔥 FILTER LOGIC UPDATED: Ab top search bar se filter hoga (Name ya Email se)
  const filteredRequests = safeRequests.filter(req => {
    const searchLower = searchQuery.toLowerCase();
    return (
      req.email?.toLowerCase().includes(searchLower) ||
      req.name?.toLowerCase().includes(searchLower)
    );
  });

  // Load status on mount
  useEffect(() => {
    const savedBrochure = localStorage.getItem("activeBrochure");
    if (savedBrochure) setActiveBrochure(savedBrochure);
  }, []);

  // --- FILE UPLOAD LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveBrochure(file.name);
      localStorage.setItem("activeBrochure", file.name);
      alert(`✅ Brochure "${file.name}" is now LIVE! Users can download it.`);
    }
  };

  const handleRemoveBrochure = () => {
    setActiveBrochure(null);
    localStorage.removeItem("activeBrochure");
    alert("Brochure removed. Users can no longer download it.");
  };

  return (
    <AdminLayout>
      <main className="pt-10 pb-12 px-8 min-h-screen max-w-7xl mx-auto">
        
        {/* Header & Actions */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-700 font-headline flex items-center gap-3">
              Brochure Requests
              {/* LIVE STATUS BADGE */}
              {activeBrochure ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-black rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active: {activeBrochure}
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] uppercase tracking-widest font-black rounded-full border border-amber-200">
                  No Brochure Uploaded
                </span>
              )}
            </h2>
            <p className="text-slate-500 mt-1">Track who downloaded your blueprints and when.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* HIDDEN FILE INPUT */}
            <input 
              type="file" 
              accept=".pdf" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleFileUpload} 
            />

            {/* UPLOAD / REMOVE BUTTON */}
            {activeBrochure ? (
              <button 
                onClick={handleRemoveBrochure} 
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition-colors shadow-sm whitespace-nowrap text-sm"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap text-sm"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload PDF
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Date Downloaded</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    {searchQuery ? `No requests found matching "${searchQuery}"` : "No matching requests found."}
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{req.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{req.name}</td>
                    <td className="px-6 py-4 text-blue-600 italic">{req.email}</td>
                    <td className="px-6 py-4 text-slate-500">{req.company || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {req.date ? new Date(req.date).toLocaleDateString('en-GB') : "11/04/2026"} 
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md text-[10px] w-fit mx-auto border border-emerald-100">
                        <span className="material-symbols-outlined text-sm">check_circle</span> DOWNLOADED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminBrochures;