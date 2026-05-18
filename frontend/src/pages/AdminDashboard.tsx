import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useServiceData } from "../context/ServiceContext";
import { useProjectData } from "../context/ProjectContext";
import { useLeadData } from "../context/LeadContext";
import axios from "axios";
import { API_URL } from "../../config/api";

const AdminDashboard = () => {
  const { services = [] } = useServiceData();
  const { projects = [] } = useProjectData();
  const { leads = [], fetchLeads } = useLeadData();
  
  const [currentDate, setCurrentDate] = useState("");
  const [brochureCount, setBrochureCount] = useState(0);

  useEffect(() => {
    // Current Date Setup
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));

    // Fresh Leads fetch karna
    if (fetchLeads) fetchLeads();

    // NAYA: Brochure Downloads count fetch karna
    const fetchBrochures = async () => {
      try {
        const token = localStorage.getItem("shonali_token");
        const res = await axios.get(`${API_URL}/brochures/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBrochureCount(res.data.length);
      } catch (err) { console.error("Brochure fetch error"); }
    };
    fetchBrochures();

  }, []);

  // --- STATS CALCULATION ---
  const activeMainServicesCount = new Set(services.map((s: any) => s.parentService)).size; 
  const totalSubServices = services.length; // NAYA: Sub-services wapas aa gaye
  const totalProjects = projects.length;
  
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // --- DYNAMIC CHART LOGIC (Leads) ---
  const monthlyLeads = new Array(12).fill(0); 
  
  leads.forEach((lead: any) => {
    let leadDate = new Date(); 
    if (lead.date) {
        const parsedDate = new Date(lead.date);
        if (!isNaN(parsedDate.getTime())) leadDate = parsedDate;
    }
    if (leadDate.getFullYear() === currentYear) {
      monthlyLeads[leadDate.getMonth()]++; 
    }
  });

  const maxLeads = Math.max(...monthlyLeads, 1); 
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // --- RECENT PROJECTS LOGIC (Naya) ---
  const recentProjectsList = [...projects].reverse().slice(0, 5);

  return (
    <AdminLayout>
      <main className="pt-8 pb-12 px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
        
        {/* Sleek Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-widest text-green-600 uppercase">System Online</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Session</p>
            <p className="text-sm font-semibold text-slate-700">{currentDate}</p>
          </div>
        </div>

        {/* 🔥 DIVERSE STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon="category" label="Active Categories" value={activeMainServicesCount} 
            iconBg="bg-blue-50" iconColor="text-blue-600" 
          />
          <StatCard 
            icon="layers" label="Total Sub-services" value={totalSubServices} 
            iconBg="bg-indigo-50" iconColor="text-indigo-600" 
          />
          <StatCard 
            icon="architecture" label="Total Projects" value={totalProjects} 
            iconBg="bg-emerald-50" iconColor="text-emerald-600" 
          />
          <StatCard 
            icon="download" label="Brochures Downloaded" value={brochureCount} 
            iconBg="bg-orange-50" iconColor="text-orange-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* DYNAMIC CHART SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">Lead Acquisition Trend</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Monthly lead generation for {currentYear}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">{monthlyLeads[currentMonthIndex]}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Month</p>
                </div>
              </div>

              <div className="h-56 flex items-end justify-between gap-1.5 md:gap-3 mt-4 pt-6 border-b border-slate-100 pb-2 relative">
                {monthlyLeads.map((count, index) => {
                  const isCurrentMonth = index === currentMonthIndex;
                  const heightPercent = maxLeads > 0 ? (count / maxLeads) * 100 : 0;
                  
                  return (
                    <div key={index} className="w-full flex flex-col items-center group relative">
                      <span className={`absolute -top-6 text-[10px] font-bold ${isCurrentMonth ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        {count > 0 ? count : ''}
                      </span>
                      
                      <div 
                        className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                          isCurrentMonth 
                            ? 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                            : count > 0 ? 'bg-slate-200 group-hover:bg-slate-300' : 'bg-slate-50'
                        }`} 
                        style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '8px' : '4px' }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-3 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                {monthLabels.map((m, i) => (
                  <span key={m} className={`w-full text-center ${i === currentMonthIndex ? "text-blue-600 font-black" : ""}`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 🔥 RECENT PROJECTS SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Recent Projects</h4>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">Portfolio</span>
              </div>
              
              <div className="space-y-5">
                {recentProjectsList.length > 0 ? recentProjectsList.map((project: any) => (
                  <div key={project.id} className="flex gap-4 items-center group">
                    
                    {/* Project Thumbnail Image */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                       {project.image ? (
                          <img src={`${API_URL.replace('/api', '')}${project.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-black text-sm uppercase">
                             {project.title.substring(0, 2)}
                          </div>
                       )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{project.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">{project.category}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">architecture</span>
                    <p className="text-sm font-bold text-slate-400">No recent projects found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </AdminLayout>
  );
};

const StatCard = ({ icon, label, value, iconBg, iconColor, badge }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      {badge && (
        <span className="text-[9px] font-black tracking-widest bg-orange-500 text-white px-2 py-1 rounded-md shadow-sm animate-pulse">
          {badge}
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;