import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext"; 

const AdminLeads = () => {
  const { leads, updateLeadStatus, deleteLead, searchQuery } = useData();
  
  const [selectedLeadId, setSelectedLeadId] = useState<string | number | null>(null);
  const [filterService, setFilterService] = useState<string>("All");

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchLower) || 
      lead.email.toLowerCase().includes(searchLower) ||
      lead.id.toString().includes(searchLower);
    
    const matchesService = filterService === "All" || lead.serviceInterest === filterService;
    
    return matchesSearch && matchesService;
  });

  const newLeadsCount = leads.filter(l => l.status === "New").length;
  const contactedLeadsCount = leads.filter(l => l.status === "Contacted").length;
  const qualifiedLeadsCount = leads.filter(l => l.status === "Qualified").length;
  
  const wonLeads = leads.filter(l => l.status === "Won");
  
  // 🔥 FIX: 10 Lakh wala calculation bug theek kiya. Ab sirf pehla number uthayega.
  const totalRevenue = wonLeads.reduce((total, lead) => {
    const match = lead.budget.match(/\d+/); // Extract only the first number
    let amount = match ? parseInt(match[0]) : 0;
    
    if (lead.budget.toLowerCase().includes('k')) {
        amount = amount * 1000;
    } else if (lead.budget.toLowerCase().includes('lakh') || lead.budget.toLowerCase().includes('l')) {
        amount = amount * 100000;
    }
    return total + amount;
  }, 0);
  
  let formattedRevenue = `₹${totalRevenue}`;
  if (totalRevenue >= 100000) {
    formattedRevenue = `₹${(totalRevenue / 100000).toFixed(1)}L`;
  } else if (totalRevenue >= 1000) {
    formattedRevenue = `₹${(totalRevenue / 1000).toFixed(1)}k`;
  } else if (totalRevenue === 0) {
    formattedRevenue = "₹0";
  }

  const uniqueServices = ["All", ...Array.from(new Set(leads.map(l => l.serviceInterest)))];

  const handleExport = () => {
    if (leads.length === 0) {
      alert("No leads available to export!");
      return;
    }
    const headers = ["ID", "Client Name", "Email", "Service Interest", "Budget", "Status", "Message", "Date Received"];
    const csvRows = leads.map(lead => {
      const escapedMessage = lead.message.replace(/"/g, '""'); 
      return `${lead.id},"${lead.name}","${lead.email}","${lead.serviceInterest}","${lead.budget}","${lead.status}","${escapedMessage}","${lead.date}"`;
    });
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Shonali_Network_Leads.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <main className="pt-10 pb-12 px-8 min-h-screen blueprint-grid">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-blue-600 font-headline text-xs tracking-widest uppercase mb-2 block font-bold">Workspace // Lead Matrix</span>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Digital Leads Ecosystem</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleExport}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-headline font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-600/25 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
              <span>Export Data</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">New Acquisition</p>
            <h3 className="text-3xl font-headline font-extrabold">{newLeadsCount}</h3>
            <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-blue-600" style={{width: leads.length ? `${(newLeadsCount/leads.length)*100}%` : '0%'}}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">In Dialogue</p>
            <h3 className="text-3xl font-headline font-extrabold">{contactedLeadsCount}</h3>
            <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-blue-600" style={{width: leads.length ? `${(contactedLeadsCount/leads.length)*100}%` : '0%'}}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">Qualified Architectures</p>
            <h3 className="text-3xl font-headline font-extrabold">{qualifiedLeadsCount}</h3>
            <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-blue-600" style={{width: leads.length ? `${(qualifiedLeadsCount/leads.length)*100}%` : '0%'}}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-600/10 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1 text-blue-600">Conversion Total</p>
            <h3 className="text-3xl font-headline font-extrabold text-blue-600">{formattedRevenue}</h3>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/50">
                    <th className="px-6 py-4 text-[10px] font-headline font-bold text-slate-400 tracking-widest uppercase">ID</th>
                    <th className="px-6 py-4 text-xs font-headline font-bold text-slate-600 uppercase">Client Info</th>
                    <th className="px-6 py-4 text-xs font-headline font-bold text-slate-600 uppercase">Requirement</th>
                    <th className="px-6 py-4 text-xs font-headline font-bold text-slate-600 uppercase text-right">Budget</th>
                    <th className="px-6 py-4 text-xs font-headline font-bold text-slate-600 uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                        {searchQuery ? `No leads matching "${searchQuery}"` : "No leads found."}
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`transition-colors cursor-pointer ${selectedLead?.id === lead.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : 'hover:bg-slate-50/80 border-l-4 border-transparent'}`}
                      >
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{lead.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                              {lead.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-headline font-semibold text-sm text-slate-900">{lead.name}</p>
                              <p className="text-[11px] text-slate-400">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">{lead.serviceInterest}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-headline font-bold text-sm text-slate-900">{lead.budget}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-3 py-1 text-[11px] font-bold rounded-full 
                             ${lead.status === 'New' ? 'bg-orange-100 text-orange-700' : 
                               lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' : 
                               lead.status === 'Qualified' ? 'bg-green-100 text-green-700' : 
                               'bg-indigo-100 text-indigo-700'}`}>
                             {lead.status === 'Won' ? 'Won Project' : lead.status}
                           </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedLead && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl"><span className="material-symbols-outlined text-blue-600 text-3xl">person</span></div>
                    <div>
                      <h4 className="font-headline font-bold text-xl text-slate-900">{selectedLead.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{selectedLead.serviceInterest} • {selectedLead.budget} Budget</p>
                    </div>
                  </div>
                  
                  {/* 🔥 FIX: GMAIL BUTTON LOGIC CORRECTED HERE */}
                  <div className="flex gap-2">
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedLead.email}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      title="Send Email via Gmail"
                    >
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </a>
                    
                    <button 
                      onClick={() => { deleteLead(selectedLead.id); setSelectedLeadId(null); }} 
                      className="bg-white border border-red-200 text-red-500 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Lead"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-6">
                  <div className="col-span-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Initial Message</h5>
                    <div className="bg-slate-50 p-5 rounded-xl text-sm text-slate-700 border border-slate-100">"{selectedLead.message}"</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</h5>
                    <button onClick={() => updateLeadStatus(selectedLead.id, "Contacted")} className={`p-3 rounded-xl border text-sm font-bold transition-all ${selectedLead.status === 'Contacted' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 hover:bg-slate-100'}`}>Mark Contacted</button>
                    <button onClick={() => updateLeadStatus(selectedLead.id, "Qualified")} className={`p-3 rounded-xl border text-sm font-bold transition-all ${selectedLead.status === 'Qualified' ? 'bg-green-600 text-white border-green-600' : 'bg-slate-50 hover:bg-slate-100'}`}>Mark Qualified</button>
                    <button onClick={() => updateLeadStatus(selectedLead.id, "Won")} className={`p-3 rounded-xl border text-sm font-bold transition-all ${selectedLead.status === 'Won' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 hover:bg-slate-100'}`}>Project Won!</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-headline font-extrabold text-lg mb-4 text-slate-900">Filter Leads</h4>
              <div className="flex flex-col gap-2">
                {uniqueServices.map(service => (
                  <button 
                    key={service}
                    onClick={() => setFilterService(service)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold border transition-all ${filterService === service ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white hover:bg-slate-50'}`}
                  >
                    {service}
                    <span className="float-right text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">
                      {service === "All" ? leads.length : leads.filter(l => l.serviceInterest === service).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminLeads;