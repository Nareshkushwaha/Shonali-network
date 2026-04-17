import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useData } from "../context/DataContext";

const AdminProjects = () => {
  const { projects, addProject, deleteProject, searchQuery } = useData();
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const projectCategories = ["Web Design", "Mobile Apps", "Marketing", "Branding", "Software"];

  const filteredProjects = projects.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.category.toLowerCase().includes(searchLower)
    );
  });

  const handleSave = () => {
    if (!title || !category || !image || !description) {
      return alert("Please fill all fields!");
    }

    addProject({
      id: Date.now().toString(),
      title,
      category,
      image,
      description
    });

    setTitle("");
    setCategory("");
    setImage("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <main className="pt-8 px-6 pb-12 min-h-screen max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Project Portfolio</h2>
            <p className="text-slate-500 text-sm font-medium">Curating digital excellence blueprints.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 group"
          >
            <span className={`material-symbols-outlined mr-2 text-[20px] transition-transform ${showForm ? "rotate-45" : ""}`}>
              {showForm ? "close" : "add"}
            </span>
            {showForm ? "Cancel" : "Add Project"}
          </button>
        </div>

        {/* Compact Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-lg font-bold mb-5 text-slate-800">New Project Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Project Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder="Project name..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none">
                  <option value="" disabled>Select...</option>
                  {projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Image Link</label>
                <input value={image} onChange={e => setImage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" placeholder="https://..." />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none resize-none" rows={2} placeholder="Briefly describe..."></textarea>
              </div>
            </div>
            <button onClick={handleSave} className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">Save to Portfolio</button>
          </div>
        )}

        {/* Stats Preview Bar */}
        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-8 border border-slate-100 flex items-center">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
               {searchQuery ? `FOUND: ${filteredProjects.length}` : `TOTAL: ${projects.length} PROJECTS`}
             </span>
        </div>

        {/* COMPACT PROJECT GRID */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">folder_open</span>
            <p className="text-slate-400 text-sm font-medium">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
                {/* Fixed Smaller Image Height */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={project.image} />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-md text-[9px] font-black text-blue-600 tracking-tighter uppercase shadow-sm border border-blue-50">{project.category}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 min-h-[32px]">{project.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                         <span className="material-symbols-outlined text-blue-400 text-[14px]">engineering</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Core Team</span>
                    </div>
                    <button 
                      onClick={() => { if(window.confirm('Delete this project?')) deleteProject(project.id) }} 
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </AdminLayout>
  );
};

export default AdminProjects;