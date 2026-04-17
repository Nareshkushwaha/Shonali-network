import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext";
import axios from "axios"; 

const AdminSubServices = () => {
  // 🔥 DYNAMIC SEARCH: context se services aur searchQuery nikal li
  const { services, addService, deleteService, searchQuery } = useData();
  
  // --- FORM STATES ---
  const [parentService, setParentService] = useState(""); 
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [ctaText, setCtaText] = useState("Inquire for Project");

  const mainServiceOptions = [
    "Website Development", 
    "App Development",
    "Software Development",
    "Automation",
    "SEO",
    "Performance Marketing",
    "Graphic Design",
    "Social Media",
    "Influencer Marketing",
    "Education Services",
  ];

  // 🔥 FILTER LOGIC: Top Search Bar के हिसाब से सब-सर्विसेज फ़िल्टर होंगी
  const filteredServices = services.filter((srv: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      srv.title.toLowerCase().includes(searchLower) ||
      srv.parentService.toLowerCase().includes(searchLower)
    );
  });
  
  const handleClearForm = () => {
    setParentService("");
    setTitle("");
    setPrice("");
    setDescription("");
    setFeatures("");
    setCtaText("Inquire for Project");
  };

  const handleSave = async () => {
    if (!parentService) return alert("Please select a Main Service first!");
    if (!title) return alert("Sub-Service Title is required!");
    if (!description) return alert("Modal Description is required!");
    
    try {
      const token = localStorage.getItem("token"); 
      
      const payload = {
        parentService: parentService,
        title: title,
        description: description,
        price: price,
        featuresList: features.split(",").map(f => f.trim()).filter(f => f), 
        cta: ctaText
      };

      const res = await axios.post("https://shonalinetworks.com/api/sub-services", payload, {
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (res.data.success) {
        addService(res.data.data); 
        handleClearForm();
        alert(`✅ Sub-Service "${title}" permanently saved to MySQL!`);
      }

    } catch (error) {
      console.error("Save Error:", error);
      alert("❌ Failed to save to database.");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/sub-services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      deleteService(id); 
      alert("Service deleted from Database!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  };

  return (
    <AdminLayout>
      <main className="pt-10 px-8 pb-12 min-h-screen">
        
        {/* Top Title Area */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-blue-600">Sub-Services Architecture</span>
            </nav>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Sub-Services <span className="text-blue-600 font-light">Builder</span>
            </h2>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleClearForm}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all scale-[1.02] active:scale-95 flex items-center"
            >
              <span className="material-symbols-outlined mr-2 text-sm">add</span>
              New Sub-Service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* EDITOR SIDEBAR & FORM */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            
            {/* 🔥 DYNAMIC TABS: Ab Search Query ke hisaab se filter honge */}
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
              {filteredServices.map((srv: any) => (
                <button key={srv.id} className="flex-shrink-0 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-blue-300 transition-all flex items-center gap-2 group shadow-sm">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mb-0.5">{srv.parentService}</span>
                    <span className="font-semibold text-sm">{srv.title}</span>
                  </div>
                  <span onClick={(e) => { e.stopPropagation(); handleDelete(srv.id); }} className="material-symbols-outlined text-[14px] text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors ml-2">delete</span>
                </button>
              ))}
              {filteredServices.length === 0 && (
                <p className="text-sm text-slate-400 italic mt-2">
                  {searchQuery ? `No services match "${searchQuery}"` : "No sub-services saved yet."}
                </p>
              )}
            </div>

            {/* Configuration Form */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
              <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
                <span className="material-symbols-outlined text-blue-600 mr-3">tune</span>
                <h3 className="text-xl font-bold tracking-tight">Configuration Engine</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <label className="text-xs font-bold text-blue-700 uppercase ml-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">account_tree</span>
                    Link to Main Service
                  </label>
                  <div className="relative">
                    <select 
                      value={parentService} 
                      onChange={(e) => setParentService(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none outline-none cursor-pointer"
                    >
                      <option value="" disabled>-- Select the Parent Service --</option>
                      {mainServiceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sub-Service Title</label>
                    <input 
                      value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                      type="text" placeholder="e.g. Custom React Website" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price Point (INR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input 
                        value={price} onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                        type="text" placeholder="15,000" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Modal Description</label>
                  <textarea 
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none" 
                    rows={4} placeholder="Describe what's included in this sub-service..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Core Features (Comma Separated)</label>
                    <input 
                      value={features} onChange={(e) => setFeatures(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                      type="text" placeholder="Free Hosting, SEO Ready, Admin Panel" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Primary CTA Button</label>
                    <input 
                      value={ctaText} onChange={(e) => setCtaText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
                <button onClick={handleClearForm} className="text-slate-400 font-semibold text-sm flex items-center hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined mr-1 text-sm">delete_sweep</span>
                  Clear Form
                </button>
                <button 
                  className="px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2" 
                  onClick={handleSave}
                >
                  <span className="material-symbols-outlined text-sm">publish</span>
                  Save Sub-Service
                </button>
              </div>
            </section>
          </div>

          {/* DYNAMIC LIVE MODAL PREVIEW */}
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <span className="material-symbols-outlined text-sm mr-2">visibility</span>
                  Live Modal Preview
                </h3>
              </div>

              <div className="bg-slate-100/50 rounded-[2rem] p-8 aspect-[4/5] border-2 border-white shadow-inner flex items-center justify-center relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
                  
                  {parentService && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-blue-600 tracking-widest uppercase shadow-sm">
                        {parentService}
                      </span>
                    </div>
                  )}

                  <div className="relative h-40 bg-slate-800">
                    <img className="w-full h-full object-cover opacity-80" alt="Preview Placeholder" src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">{title || "Sub Service Name"}</h4>
                        <span className="text-blue-600 font-bold text-lg">₹{price || "0"}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed mt-2 line-clamp-3">
                        {description || "Enter a description in the form to see the preview."}
                      </p>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Features</p>
                      <ul className="space-y-1.5">
                         {features ? features.split(",").map((f, i) => (
                           <li key={i} className="flex items-center text-xs font-medium text-slate-700">
                              <span className="material-symbols-outlined text-green-500 text-sm mr-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                              {f.trim()}
                           </li>
                         )) : <p className="text-xs italic text-slate-400">Features will appear here...</p>}
                      </ul>
                    </div>
                    
                    <button className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30">
                      {ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminSubServices;