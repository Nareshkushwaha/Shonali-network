import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { useProjectData } from "../context/ProjectContext";
import { API_URL } from "../../config/api"; 

const Projects = () => {
  const [active, setActive] = useState<string>("All");
  
  const { projects = [] } = useProjectData(); 

  const dynamicCategories = ["All", ...Array.from(new Set(projects.map((p: any) => p.category)))];

  const filtered = active === "All" ? projects : projects.filter((p: any) => p.category === active);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return ""; 
    if (imagePath.startsWith("http")) return imagePath; 
    const baseUrl = API_URL.replace('/api', ''); 
    return `${baseUrl}${imagePath}`; 
  };

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-slate-50/50 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
              Our Portfolio
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Projects</span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium">
              A showcase of our premium digital architecture across web, app, marketing, and design.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2.5 mb-12">
              {dynamicCategories.map((c: any) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    active === c
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-20 text-slate-400 border border-dashed border-slate-300 rounded-2xl bg-white max-w-2xl mx-auto shadow-sm">
              <span className="material-symbols-outlined text-4xl mb-3 opacity-40">folder_open</span>
              <p className="font-bold text-sm">No projects to show yet.</p>
              <p className="text-xs mt-1">Upload them directly from your Admin Workspace.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((p: any) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden group hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col border border-slate-200 relative"
                  >
                    {/* 🔥 THE FIX: Yahan image ko <a> tag ke andar dala taaki click ho sake */}
                    {p.liveUrl ? (
                      <a 
                        href={p.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-100 shrink-0 block cursor-pointer"
                      >
                        {p.image ? (
                          <img src={getImageUrl(p.image)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><span className="material-symbols-outlined text-4xl">image</span></div>
                        )}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded border border-white/20 text-[9px] font-black text-slate-800 tracking-widest uppercase shadow-sm">{p.category}</span>
                        </div>
                      </a>
                    ) : (
                      <div className="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-100 shrink-0">
                        {p.image ? (
                          <img src={getImageUrl(p.image)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><span className="material-symbols-outlined text-4xl">image</span></div>
                        )}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded border border-white/20 text-[9px] font-black text-slate-800 tracking-widest uppercase shadow-sm">{p.category}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-5 flex flex-col flex-1">
                      {p.liveUrl ? (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-blue-600">
                          <h3 className="font-bold text-sm mb-1.5 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1" title={p.title}>
                            {p.title}
                          </h3>
                        </a>
                      ) : (
                        <h3 className="font-bold text-sm mb-1.5 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1" title={p.title}>
                          {p.title}
                        </h3>
                      )}

                      <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow" title={p.description}>
                        {p.description}
                      </p>
                      
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase group-hover:text-blue-600 transition-colors">
                           {p.liveUrl ? "Visit Live Site" : "Case Study"}
                         </span>
                         {p.liveUrl ? (
                           <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer z-10">
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                           </a>
                         ) : (
                           <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                              <span className="material-symbols-outlined text-[14px]">north_east</span>
                           </div>
                         )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;