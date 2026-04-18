import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext";

const AdminBrochures = () => {
  const { brochureRequests, searchQuery } = useData();
  
  const [activeBrochure, setActiveBrochure] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeRequests = brochureRequests || [];
  
  const filteredRequests = safeRequests.filter(req => {
    const searchLower = searchQuery.toLowerCase();
    return (
      req.email?.toLowerCase().includes(searchLower) ||
      req.name?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const savedBrochure = localStorage.getItem("activeBrochure");
    if (savedBrochure) setActiveBrochure(savedBrochure);
  }, []);

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
      {/* 🔥 Mobile par px-4, Desktop par px-8 */}
      <main className="pt-10 pb-12 px-4 md:px-8 min-h-screen max-w-7xl mx-auto">
        
        {/* Header & Actions */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {/* 🔥 Mobile ke liye text thoda chota (text-xl) aur flex-wrap lagaya */}
            <h2 className="text-xl md:text-3xl font-extrabold text-blue-700 font-headline flex flex-wrap items-center gap-2 md:gap-3">
              Brochure Requests
              {activeBrochure ? (
                <span className="px-2 md:px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] md:text-[10px] uppercase tracking-widest font-black rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="truncate max-w-[150px] md:max-w-none">Active: {activeBrochure}</span>
                </span>
              ) : (
                <span className="px-2 md:px-3 py-1 bg-amber-100 text-amber-700 text-[8px] md:text-[10px] uppercase tracking-widest font-black rounded-full border border-amber-200 shrink-0">
                  No Brochure Uploaded
                </span>
              )}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Track who downloaded your blueprints and when.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <input 
              type="file" 
              accept=".pdf" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleFileUpload} 
            />

            {activeBrochure ? (
              <button 
                onClick={handleRemoveBrochure} 
                className="flex items-center justify-center w-full md:w-auto gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition-colors shadow-sm whitespace-nowrap text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center justify-center w-full md:w-auto gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload PDF
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          {/* 🔥 FIX: table-fixed aur column widths daal di taaki mobile par na kate */}
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 text-[8px] md:text-[11px] font-black text-slate-500 uppercase tracking-wider border-b">
                <th className="w-[10%] px-2 md:px-6 py-3 md:py-4 truncate">ID</th>
                <th className="w-[20%] px-2 md:px-6 py-3 md:py-4 truncate">Name</th>
                <th className="w-[25%] px-2 md:px-6 py-3 md:py-4 truncate">Email</th>
                <th className="w-[15%] px-2 md:px-6 py-3 md:py-4 truncate">Company</th>
                {/* 🔥 Mobile par sirf "Date" dikhega, PC par "Date Downloaded" */}
                <th className="w-[15%] px-2 md:px-6 py-3 md:py-4 truncate">Date<span className="hidden md:inline"> Downloaded</span></th>
                <th className="w-[15%] px-2 md:px-6 py-3 md:py-4 text-center truncate">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs md:text-sm text-slate-400">
                    {searchQuery ? `No requests found matching "${searchQuery}"` : "No matching requests found."}
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                    {/* 🔥 Mobile par font size text-[8px] ya [9px] hoga taaki fit ho jaye */}
                    <td className="px-2 md:px-6 py-3 md:py-4 font-mono text-[8px] md:text-xs text-slate-400 truncate">#{req.id}</td>
                    <td className="px-2 md:px-6 py-3 md:py-4 font-bold text-slate-900 text-[9px] md:text-sm truncate">{req.name}</td>
                    <td className="px-2 md:px-6 py-3 md:py-4 text-blue-600 italic text-[9px] md:text-sm truncate">{req.email}</td>
                    <td className="px-2 md:px-6 py-3 md:py-4 text-slate-500 text-[9px] md:text-sm truncate">{req.company || "N/A"}</td>
                    <td className="px-2 md:px-6 py-3 md:py-4 text-slate-500 font-medium text-[9px] md:text-sm truncate">
                      {req.date ? new Date(req.date).toLocaleDateString('en-GB') : "18/04/2026"} 
                    </td>
                    <td className="px-2 md:px-6 py-3 md:py-4 text-center">
                      <span className="flex items-center justify-center gap-0.5 md:gap-1 text-emerald-600 font-bold bg-emerald-50 px-1 md:px-2 py-0.5 md:py-1 rounded-md text-[7px] md:text-[10px] w-fit mx-auto border border-emerald-100 truncate max-w-full">
                        <span className="material-symbols-outlined text-[9px] md:text-sm">check_circle</span> 
                        <span className="hidden sm:inline">DOWNLOADED</span>
                        <span className="sm:hidden">DONE</span>
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