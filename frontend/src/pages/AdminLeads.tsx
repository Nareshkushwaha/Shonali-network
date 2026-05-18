import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useLeadData } from "../context/LeadContext"; 

const AdminLeads = () => {
  // ✅ FIX: Ab update aur delete asali context se aayenge
  const { leads = [], loading, updateLeadStatus, deleteLead } = useLeadData();
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [filterService, setFilterService] = useState<string>("All");

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchLower) || 
      lead.email.toLowerCase().includes(searchLower);
    
    const matchesService = filterService === "All" || lead.serviceInterest === filterService;
    
    return matchesSearch && matchesService;
  });

  const newLeadsCount = leads.filter(l => l.status === "New").length;
  const contactedLeadsCount = leads.filter(l => l.status === "Contacted").length;
  const qualifiedLeadsCount = leads.filter(l => l.status === "Qualified").length;
  
  // Revenue Logic
  const wonLeads = leads.filter(l => l.status === "Won");
  const totalRevenue = wonLeads.reduce((total, lead) => {
    if(!lead.budget) return total;
    const match = lead.budget.match(/\d+/); 
    let amount = match ? parseInt(match[0]) : 0;
    if (lead.budget.toLowerCase().includes('k')) amount *= 1000;
    else if (lead.budget.toLowerCase().includes('l')) amount *= 100000;
    return total + amount;
  }, 0);
  
  const formattedRevenue = totalRevenue >= 100000 ? `₹${(totalRevenue / 100000).toFixed(1)}L` : `₹${(totalRevenue / 1000).toFixed(1)}k`;
  const uniqueServices = ["All", ...Array.from(new Set(leads.map(l => l.serviceInterest)))];

  const handleExport = () => {
    if (leads.length === 0) return alert("No leads to export!");
    const headers = ["ID", "Name", "Email", "Requirement", "Budget", "Status"];
    const csvContent = [headers.join(","), ...leads.map(l => `${l.id},"${l.name}","${l.email}","${l.serviceInterest}","${l.budget}","${l.status}"`)].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Shonali_Leads.csv";
    link.click();
  };

  if (loading) return <AdminLayout><div className="flex h-screen items-center justify-center font-bold text-blue-600">Loading Ecosystem...</div></AdminLayout>;

  return (
    <AdminLayout>
      <main className="pt-6 pb-12 px-4 md:px-8 min-h-screen bg-slate-50/50">
        
        {/* Sleek Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-blue-600 text-[10px] tracking-widest uppercase mb-1 block font-black">Workspace // Lead Matrix</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Digital Leads</h1>
          </div>
          <button onClick={handleExport} className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export CSV
          </button>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox label="New Acquisition" value={newLeadsCount} color="#f97316" />
          <StatBox label="In Dialogue" value={contactedLeadsCount} color="#3b82f6" />
          <StatBox label="Qualified" value={qualifiedLeadsCount} color="#22c55e" />
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-center">
            <p className="text-blue-600 text-[10px] font-extrabold uppercase tracking-wider mb-1">Conversion Total</p>
            <h3 className="text-2xl font-black text-blue-600">{formattedRevenue}</h3>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Search Bar */}
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
               <span className="material-symbols-outlined text-slate-400 pl-2">search</span>
               <input 
                 type="text" 
                 placeholder="Search leads by name or email..." 
                 className="w-full bg-transparent outline-none text-sm p-2"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            {/* Responsive Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Info</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requirement</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Budget</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                            {lead.name.substring(0,2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{lead.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold rounded flex inline-block w-fit">{lead.serviceInterest}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-xs text-slate-700">{lead.budget}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-[9px] font-bold rounded-full uppercase ${
                          lead.status === 'New' ? 'bg-orange-100 text-orange-600' : 
                          lead.status === 'Won' ? 'bg-green-100 text-green-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-sm">No leads found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Filter Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider mb-3">Filter by Service</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueServices.map(service => (
                  <button 
                    key={service} 
                    onClick={() => setFilterService(service)} 
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filterService === service ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Lead Details Card */}
            {selectedLead && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 sticky top-24">
                <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-black text-lg text-slate-900">{selectedLead.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{selectedLead.email}</p>
                  </div>
                  <button onClick={() => deleteLead(selectedLead.id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors">
                     <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
                
                <div className="mb-5">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message / Requirement</p>
                   <div className="bg-slate-50 p-3 rounded-lg text-xs leading-relaxed text-slate-700 border border-slate-100">
                     "{selectedLead.message}"
                   </div>
                </div>

                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</p>
                   <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => updateLeadStatus(selectedLead.id, "Contacted")} className="py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-100 text-[10px] font-bold rounded-lg transition-all">Mark Contacted</button>
                     <button onClick={() => updateLeadStatus(selectedLead.id, "Qualified")} className="py-2 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 border border-purple-100 text-[10px] font-bold rounded-lg transition-all">Qualified</button>
                     <button onClick={() => updateLeadStatus(selectedLead.id, "Won")} className="py-2 col-span-2 bg-green-500 hover:bg-green-600 text-white shadow-sm text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">emoji_events</span> Project Won!
                     </button>
                   </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </AdminLayout>
  );
};

const StatBox = ({ label, value, color }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
    <h3 className="text-2xl font-black text-slate-800">{value}</h3>
    <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
      <div className="h-full" style={{ width: '60%', backgroundColor: color }}></div>
    </div>
  </div>
);

export default AdminLeads;