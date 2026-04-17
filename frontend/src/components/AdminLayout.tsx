import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { useData } from "../context/DataContext"; 

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // 🔥 DYNAMIC STATES
  const { currentUser, leads, searchQuery, setSearchQuery } = useData(); 
  
  // Notification Logic: Kitni New Leads hain
  const newLeadsCount = leads.filter(lead => lead.status === "New").length;
  const hasNewNotifications = newLeadsCount > 0;

  const closeSidebar = () => setIsSidebarOpen(false);

  // Initials generator
  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AD";
    const words = nameStr.split(" ");
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased flex min-h-screen relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside 
        className={`h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col py-6 z-50 shadow-xl md:shadow-sm transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-6 mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-blue-800 font-headline">Shonali Network</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">The Digital Architect</p>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-700" onClick={closeSidebar}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto no-scrollbar">
          <Link to="/admin-dashboard" onClick={closeSidebar} className={`px-4 py-3 rounded-r-xl flex items-center gap-3 transition-transform ${location.pathname === "/admin-dashboard" ? "bg-white shadow-sm border-l-4 border-blue-600 text-blue-700 scale-[1.02]" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === "/admin-dashboard" ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
            <span className="font-headline tracking-tight font-medium">Dashboard</span>
          </Link>
          <Link to="/admin-sub-services" onClick={closeSidebar} className={`px-4 py-3 rounded-r-xl flex items-center gap-3 transition-transform ${location.pathname === "/admin-sub-services" ? "bg-white shadow-sm border-l-4 border-blue-600 text-blue-700 scale-[1.02]" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === "/admin-sub-services" ? "'FILL' 1" : "'FILL' 0" }}>layers</span>
            <span className="font-headline tracking-tight font-medium">Sub Services</span>
          </Link>
          <Link to="/admin-projects" onClick={closeSidebar} className={`px-4 py-3 rounded-r-xl flex items-center gap-3 transition-transform ${location.pathname === "/admin-projects" ? "bg-white shadow-sm border-l-4 border-blue-600 text-blue-700 scale-[1.02]" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === "/admin-projects" ? "'FILL' 1" : "'FILL' 0" }}>architecture</span>
            <span className="font-headline tracking-tight font-medium">Projects</span>
          </Link>
          <Link to="/admin-leads" onClick={closeSidebar} className={`px-4 py-3 rounded-r-xl flex items-center gap-3 transition-transform ${location.pathname === "/admin-leads" ? "bg-white shadow-sm border-l-4 border-blue-600 text-blue-700 scale-[1.02]" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === "/admin-leads" ? "'FILL' 1" : "'FILL' 0" }}>leaderboard</span>
            <span className="font-headline tracking-tight font-medium">Leads</span>
          </Link>
          <Link to="/admin-brochures" onClick={closeSidebar} className={`px-4 py-3 rounded-r-xl flex items-center gap-3 transition-transform ${location.pathname === "/admin-brochures" ? "bg-white shadow-sm border-l-4 border-blue-600 text-blue-700 scale-[1.02]" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === "/admin-brochures" ? "'FILL' 1" : "'FILL' 0" }}>menu_book</span>
            <span className="font-headline tracking-tight font-medium">Brochure Requests</span>
          </Link>
          <Link to="/admin-settings" onClick={closeSidebar} className={`px-4 py-3 rounded-r-xl flex items-center gap-3 transition-transform mt-auto ${location.pathname === "/admin-settings" ? "bg-white shadow-sm border-l-4 border-blue-600 text-blue-700 scale-[1.02]" : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === "/admin-settings" ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
            <span className="font-headline tracking-tight font-medium">Settings</span>
          </Link>
        </nav>

        {/* SIDEBAR BOTTOM PROFILE */}
        <div className="mt-auto px-6 pt-6 border-t border-slate-200">
          <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                {getInitials(currentUser?.name)}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-800">{currentUser?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser?.email || "admin@shonali.com"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 w-full z-30 bg-white/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-8 h-16 shadow-sm border-b border-slate-100">
          
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button className="md:hidden text-slate-600 hover:text-blue-600 transition-colors p-1 flex items-center justify-center" onClick={() => setIsSidebarOpen(true)}>
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* 🔥 DYNAMIC SEARCH BAR */}
            <div className="relative w-full max-w-xs md:max-w-sm lg:w-96 group hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-[20px]">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all outline-none placeholder:text-slate-400" 
                placeholder="Global Search (Leads, Projects, Services)..." 
                type="text" 
              />
              {/* Clear search button */}
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 flex items-center">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* 🔥 FIXED DESIGN & ALIGNMENT FOR RIGHT SIDE ICONS */}
          <div className="flex items-center gap-3 md:gap-5">
            <button className="sm:hidden text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* DYNAMIC NOTIFICATION BELL */}
            <div className="relative group flex items-center justify-center">
              <Link to="/admin-leads" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 relative">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {hasNewNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </Link>
              {/* Notification Tooltip on Hover */}
              {hasNewNotifications && (
                <div className="absolute top-10 right-0 w-32 bg-slate-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-lg">
                  {newLeadsCount} New Lead(s)
                </div>
              )}
            </div>
            
            {/* HELP ICON */}
            <button className="text-slate-500 hover:text-blue-600 transition-colors hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50">
              <span className="material-symbols-outlined text-[22px]">help_outline</span>
            </button>
            
            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
            
            {/* TOP NAVBAR PROFILE */}
            <Link to="/admin-settings" className="flex items-center gap-3 cursor-pointer group p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors hidden md:block">
                {currentUser?.name ? currentUser.name.split(' ')[0] : "Admin"}
              </span>
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-blue-400 transition-all object-cover shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-blue-400 transition-all bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shadow-sm">
                  {getInitials(currentUser?.name)}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 w-full overflow-x-hidden">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;