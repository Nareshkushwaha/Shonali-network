import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// ✅ FIX: Purana DataContext hata kar naye contexts import kiye
import { useAuth } from "../context/AuthContext";
import { useLeadData } from "../context/LeadContext";
import { useServiceData } from "../context/ServiceContext";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ FIX: Alag-alag context se zaroori data nikala
  const { user: currentUser } = useAuth();
  const { leads } = useLeadData();
  
  // SearchQuery filhal hum local state ya ServiceContext se manage kar sakte hain
  const [searchQuery, setSearchQuery] = useState(""); 

  const newLeadsCount = leads.filter(lead => lead.status === "New").length;
  const hasNewNotifications = newLeadsCount > 0;

  const closeSidebar = () => setIsSidebarOpen(false);

  const getInitials = (nameStr: string | undefined) => {
    if (!nameStr) return "AD";
    const words = nameStr.split(" ");
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-slate-50 font-body text-slate-900 antialiased flex min-h-screen relative">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar Area */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 bg-white flex flex-col py-6 z-50 shadow-2xl md:shadow-sm transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="px-6 mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-blue-800 font-headline">Shonali Network</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">The Digital Architect</p>
          </div>
          <button className="md:hidden text-slate-400 hover:text-red-500 transition-colors" onClick={closeSidebar}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 overflow-y-auto no-scrollbar">
          {/* Navigation Links (Sahi tarike se path match ho raha hai) */}
          {[
            { to: "/admin-dashboard", icon: "dashboard", label: "Dashboard" },
            { to: "/admin-sub-services", icon: "layers", label: "Sub Services" },
            { to: "/admin-projects", icon: "architecture", label: "Projects" },
            { to: "/admin-leads", icon: "leaderboard", label: "Leads" },
            { to: "/admin-brochures", icon: "menu_book", label: "Brochures" },
            { to: "/admin-settings", icon: "settings", label: "Settings" },
          ].map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              onClick={closeSidebar} 
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${location.pathname === item.to ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-sm" : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-headline tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Profile */}
        <div className="mt-auto px-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {getInitials(currentUser?.username)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-800">{currentUser?.username || "Admin"}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser?.role || "Administrator"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full">
        {/* Top Header */}
        <header className="sticky top-0 w-full z-30 bg-white/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-8 h-16 shadow-sm border-b border-slate-100">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button className="md:hidden text-slate-600 p-1" onClick={() => setIsSidebarOpen(true)}>
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Search Bar */}
            <div className="relative w-full max-w-xs group hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin-leads" className="text-slate-500 hover:text-blue-600 w-9 h-9 rounded-full flex items-center justify-center relative">
              <span className="material-symbols-outlined">notifications</span>
              {hasNewNotifications && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

            <Link to="/admin-settings" className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
              <span className="text-sm font-bold text-slate-700 hidden md:block">
                {currentUser?.username || "Admin"}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                {getInitials(currentUser?.username)}
              </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 w-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;