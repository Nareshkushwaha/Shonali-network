import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useProjectData } from "../context/ProjectContext";
import axios from "axios";
import { API_URL } from "../../config/api";

const AdminProjects = () => {
  const { projects = [], fetchProjects } = useProjectData();
  
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null); 
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState(""); // 🔥 Naya State
  const [loading, setLoading] = useState(false);

  const projectCategories = ["Web Design", "Mobile Apps", "Marketing", "Branding", "Software"];

  const handleSave = async () => {
    if (!title || !category || !image || !description) {
      return alert("Please fill all required fields and select an image!");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("shonali_token");
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("liveUrl", liveUrl); // 🔥 Form mein add kiya
      formData.append("image", image); 

      const res = await axios.post(`${API_URL}/projects`, formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
        }
      });

      if (res.data) {
        alert("✅ Project saved successfully!");
        fetchProjects(); 
        setShowForm(false);
        setTitle(""); setCategory(""); setImage(null); setDescription(""); setLiveUrl("");
      }
    } catch (error) {
      alert("❌ Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("shonali_token");
      await axios.delete(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <AdminLayout>
      <main className="pt-8 px-4 md:px-8 pb-12 min-h-screen max-w-7xl mx-auto bg-slate-50/50">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Project Portfolio</h2>
            <p className="text-slate-500 text-xs font-medium mt-1">Manage and showcase your premium work.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-900 hover:bg-slate-800 transition-all text-white px-5 py-2 rounded-lg font-semibold text-xs flex items-center shadow-md"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">{showForm ? "close" : "add"}</span>
            {showForm ? "Cancel Entry" : "New Project"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">edit_document</span>
              Project Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Project Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. E-Commerce App" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500/20">
                  <option value="">Select Category</option>
                  {projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* 🔥 Naya Live Link Input */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Live Project Link (Optional)</label>
                <input type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="https://example.com" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Project Cover Image</label>
                 <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-all bg-white">
                    <span className="material-symbols-outlined text-slate-400 mb-1">cloud_upload</span>
                    <span className="text-xs text-slate-500 font-semibold">{image ? image.name : "Click to browse image from your PC"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                 </label>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Brief Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500/20 resize-none" placeholder="Describe the project..." rows={3} />
              </div>
            </div>

            <div className="flex justify-end mt-6">
               <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md">
                 {loading ? "Uploading..." : "Save Configuration"}
               </button>
            </div>
          </div>
        )}

        {/* Admin Project List View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((project: any) => {
            const imageUrl = project.image ? `${API_URL.replace('/api', '')}${project.image}` : null;
            return (
              <div key={project.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                <div className="h-36 overflow-hidden relative bg-slate-100">
                  {imageUrl ? (
                     <img src={imageUrl} className="w-full h-full object-cover" alt="" onError={(e: any) => { e.target.style.display = 'none'; }} />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300 material-symbols-outlined text-4xl">image</div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-[4px] text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">{project.category}</span>
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1 truncate">{project.title}</h3>
                    {project.liveUrl && <p className="text-[10px] text-blue-500 truncate mb-1">{project.liveUrl}</p>}
                  </div>
                  <div className="flex justify-end pt-3 mt-2 border-t border-slate-100">
                    <button onClick={() => handleDelete(project.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminProjects;