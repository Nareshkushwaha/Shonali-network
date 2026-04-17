import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext";

const AdminDashboard = () => {
  // 🔥 DYNAMIC SEARCH: searchQuery import kiya
  const { services, projects, leads, searchQuery } = useData();

  // 🔥 FILTER LOGIC: Search query ke hisaab se data filter karna
  const searchLower = searchQuery.toLowerCase();

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchLower) || 
    s.parentService.toLowerCase().includes(searchLower)
  );

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchLower) || 
    p.category.toLowerCase().includes(searchLower)
  );

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchLower) || 
    l.email.toLowerCase().includes(searchLower) ||
    l.serviceInterest.toLowerCase().includes(searchLower)
  );

  // --- DYNAMIC CALCULATIONS (Ab filtered data se chalenge) ---
  const totalSubServices = filteredServices.length;
  const activeMainServicesCount = new Set(filteredServices.map(s => s.parentService)).size; 
  
  const totalProjects = filteredProjects.length;
  const totalLeads = filteredLeads.length;
  const newLeadsCount = filteredLeads.filter(l => l.status === "New").length;
  const highValueLeadsCount = filteredLeads.filter(l => l.budget.includes("10k") || l.budget.includes("25k")).length;

  const latestProjects = [...filteredProjects].reverse().slice(0, 2);
  const recentActivities = [...filteredLeads].reverse().slice(0, 3);
  const recentClients = [...filteredLeads].reverse().slice(0, 5);

  // ==========================================
  // 🚀 DYNAMIC CHART LOGIC (Month by Month)
  // ==========================================
  const monthlyLeads = new Array(12).fill(0); 
  
  // Chart bhi search ke hisaab se update hoga
  filteredLeads.forEach(lead => {
    const date = new Date(lead.date);
    if (!isNaN(date.getTime())) {
      const month = date.getMonth(); 
      monthlyLeads[month]++; 
    }
  });

  const maxLeads = Math.max(...monthlyLeads, 1); 
  const currentMonth = new Date().getMonth(); 
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <AdminLayout>
      <main className="pt-12 pb-12 px-8 max-w-7xl mx-auto">
        
        {/* Dashboard Welcome Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-2">Welcome Back, Architect</h2>
          <p className="text-slate-500 font-body">
            {searchQuery ? `Showing dashboard results for "${searchQuery}"` : "Here is the real-time overview of Shonali Network today."}
          </p>
        </div>

        {/* DYNAMIC Bento Grid Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <span className="material-symbols-outlined text-2xl">account_tree</span>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-slate-500 text-sm font-label mb-1">Active Categories</p>
            <h3 className="text-2xl font-extrabold font-headline">{activeMainServicesCount}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <span className="material-symbols-outlined text-2xl">layers</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-label mb-1">Total Sub-services</p>
            <h3 className="text-2xl font-extrabold font-headline">{totalSubServices}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                <span className="material-symbols-outlined text-2xl">architecture</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-label mb-1">Total Projects</p>
            <h3 className="text-2xl font-extrabold font-headline">{totalProjects}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                <span className="material-symbols-outlined text-2xl">leaderboard</span>
              </div>
              {newLeadsCount > 0 && (
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{newLeadsCount} New</span>
              )}
            </div>
            <p className="text-slate-500 text-sm font-label mb-1">Total Leads</p>
            <h3 className="text-2xl font-extrabold font-headline">{totalLeads}</h3>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* 🚀 DYNAMIC PROJECT GROWTH CHART AREA */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h4 className="text-lg font-bold font-headline text-slate-900">Lead Acquisition & Growth</h4>
                  <p className="text-xs text-slate-400">Real-time monthly overview of project inquiries</p>
                </div>
              </div>
              
              {/* Dynamic Bars Container */}
              <div className="h-48 flex items-end justify-between gap-1 sm:gap-3 group mt-8">
                {monthlyLeads.map((count, index) => {
                  const heightPercent = Math.max((count / maxLeads) * 100, 2); 
                  const isCurrentMonth = index === currentMonth;

                  return (
                    <div 
                      key={index} 
                      className={`w-full rounded-t-lg relative group/bar transition-all duration-700 ease-out 
                        ${isCurrentMonth ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-md' : count > 0 ? 'bg-blue-200 hover:bg-blue-300' : 'bg-slate-50 hover:bg-slate-200'}
                      `} 
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                        {count} Leads
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Month Labels */}
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                {monthLabels.map((m, i) => (
                  <span key={m} className={i === currentMonth ? "text-blue-600" : ""}>{m}</span>
                ))}
              </div>
            </div>

            {/* DYNAMIC Featured Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestProjects.length === 0 ? (
                <div className="col-span-full h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white">
                  <span className="material-symbols-outlined text-4xl mb-2">architecture</span>
                  <p className="text-sm font-medium">No projects found.</p>
                </div>
              ) : (
                latestProjects.map((project, index) => (
                  <div key={project.id} className="group relative overflow-hidden rounded-xl h-64 shadow-sm">
                    <img alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={project.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-0 p-6">
                      <span className={`${index === 0 ? 'bg-blue-500' : 'bg-teal-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block uppercase tracking-wider`}>
                        {index === 0 ? 'Latest' : 'Featured'}
                      </span>
                      <h5 className="text-white font-bold text-lg leading-tight line-clamp-1">{project.title}</h5>
                      <p className="text-slate-300 text-xs mt-1">{project.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* DYNAMIC Recent Activity Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Recent Lead Activity</h4>
                <Link to="/admin-leads" className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
              </div>
              <div className="space-y-6">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No recent activity.</p>
                ) : (
                  recentActivities.map((lead) => (
                    <div key={lead.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">mail</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">New inquiry from {lead.name.split(' ')[0]}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">Interested in "{lead.serviceInterest}"</p>
                        <p className="text-[10px] text-blue-600 font-bold mt-1">{lead.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DYNAMIC High-Value Leads Sidebar Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white shadow-md relative overflow-hidden">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl rotate-12">trending_up</span>
              <h4 className="text-lg font-bold mb-2">High-Value Leads</h4>
              <p className="text-blue-100 text-sm mb-6">There are <strong>{highValueLeadsCount}</strong> high-value inquiries awaiting your review.</p>
              <Link to="/admin-leads">
                <button className="w-full bg-white text-blue-700 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">Review Leads</button>
              </Link>
            </div>

            {/* DYNAMIC Recent Clients */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6">Recent Clients</h4>
              <div className="flex -space-x-2">
                {recentClients.length === 0 ? (
                  <p className="text-xs text-slate-400">No clients found.</p>
                ) : (
                  recentClients.map((client, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shadow-sm" title={client.name}>
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                  ))
                )}
                {filteredLeads.length > 5 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shadow-sm">
                    +{filteredLeads.length - 5}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Floating Action Button */}
      <Link to="/admin-projects">
        <button className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform group z-50">
          <span className="material-symbols-outlined text-2xl">add</span>
          <div className="absolute right-16 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Create New Project</div>
        </button>
      </Link>

    </AdminLayout>
  );
};

export default AdminDashboard;