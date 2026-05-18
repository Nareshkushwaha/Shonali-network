import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useServiceData } from "../context/ServiceContext";
import { API_URL } from "../../config/api";
import axios from "axios"; 

const AdminSubServices = () => {
  const { services, addService, deleteService } = useServiceData();
  
  const searchQuery = ""; 

  const [parentService, setParentService] = useState(""); 
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [ctaText, setCtaText] = useState("Inquire for Project");

  const mainServiceOptions = [
    "Website Development", "App Development", "Software Development",
    "Automation", "SEO", "Performance Marketing", "Graphic Design",
    "Social Media", "Influencer Marketing", "Education Services",
  ];

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
      const token = localStorage.getItem("shonali_token"); 
      
      const payload = {
        parentService: parentService,
        title: title,
        description: description,
        price: price,
        featuresList: features.split(",").map(f => f.trim()).filter(f => f), 
        cta: ctaText
      };

      const res = await axios.post(`${API_URL}/sub-services`, payload, {
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (res.data) {
        addService(res.data); 
        handleClearForm();
        alert(`✅ Sub-Service "${title}" permanently saved!`);
      }

    } catch (error) {
      console.error("Save Error:", error);
      alert("❌ Failed to save. Is Backend Running?");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = localStorage.getItem("shonali_token");
      
      await axios.delete(`${API_URL}/sub-services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      deleteService(id); 
      alert("Service deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  };

  return (
    <AdminLayout>
      <main className="pt-10 px-4 md:px-8 pb-12 min-h-screen max-w-7xl mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Sub-Services <span className="text-blue-600 font-light">Builder</span>
            </h2>
          </div>
          <button 
            onClick={handleClearForm}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined mr-2 text-sm">add</span>
            New Sub-Service
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            
            {/* Horizontal Tabs for existing services */}
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
              {filteredServices.map((srv: any) => (
                <div key={srv.id} className="flex-shrink-0 px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-4 shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">{srv.parentService}</p>
                    <p className="font-semibold text-sm">{srv.title}</p>
                  </div>
                  <button onClick={() => handleDelete(srv.id)} className="text-slate-300 hover:text-red-500">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Form Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Parent Service</label>
                  <select 
                    value={parentService} 
                    onChange={(e) => setParentService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="" disabled>Select Main Service</option>
                    {mainServiceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Sub-Service Title" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                  <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (INR)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>

                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input value={features} onChange={e => setFeatures(e.target.value)} placeholder="Features (comma separated)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                  <input value={ctaText} onChange={e => setCtaText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>

                <button onClick={handleSave} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                  Save Sub-Service
                </button>
              </div>
            </section>
          </div>

          {/* EXACT LIVE PREVIEW (As per user image) */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-24">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Live Preview
              </h4>
              
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-sm border border-slate-100">
                
                {/* 1. Image Header with Category Badge */}
                <div 
                  className="h-44 relative bg-cover bg-center"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  
                  {/* Category Pill */}
                  {parentService && (
                    <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{parentService}</span>
                    </div>
                  )}
                </div>

                {/* 2. Card Content (Title, Price, Desc) */}
                <div className="p-6 pt-3 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="font-extrabold text-3xl text-slate-900 tracking-tight">{title || "Title"}</h5>
                    <span className="text-blue-600 font-extrabold text-xl shrink-0">₹{price || ""}</span>
                  </div>
                  
                  <p className="text-sm text-slate-500">
                    {description || "Enter details to see description preview..."}
                  </p>

                  {/* 3. Core Features List with Green Checks */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Features</p>
                    <div className="space-y-2">
                      {features ? features.split(",").filter(f => f.trim()).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                          {/* Green Checkmark */}
                          <span className="material-symbols-outlined text-[18px] text-green-500 fill-current">check_circle</span>
                          {feat.trim()}
                        </div>
                      )) : (
                         <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                           <span className="material-symbols-outlined text-[16px]">check_circle</span>
                           Add features (comma separated)
                         </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Button */}
                  <button className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all">
                    {ctaText}
                  </button>
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