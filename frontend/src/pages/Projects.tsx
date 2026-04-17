import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { useData } from "../context/DataContext";

const Projects = () => {
  const [active, setActive] = useState<string>("All");
  
  // Admin Panel se aane wale global projects
  const { projects } = useData(); 

  // Dynamic Categories Generate karna
  const dynamicCategories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  // Filtering Logic
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Work
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              A showcase of our best work across web, app, marketing, and design.
            </p>
          </div>

          {/* DYNAMIC Filters */}
          {projects.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {dynamicCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c as string)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    active === c
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:scale-105"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* COMPACT & ELEGANT GRID */}
          {projects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
              <p>No projects to show yet. Add them from the Admin Panel!</p>
            </div>
          ) : (
            // 🔥 Grid columns badha diye (lg:grid-cols-4) taki boxes chote ho jaye
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col border border-border/50 bg-background/50 backdrop-blur-sm"
                  >
                    {/* Fixed Height Image Wrapper */}
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80";
                        }}
                      />
                      {/* 🔥 Category Badge Over Image (Modern Look) */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-background/95 backdrop-blur-md rounded-md text-[10px] font-extrabold text-primary tracking-widest uppercase shadow-sm">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Compact Content Area */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {p.description}
                      </p>
                      
                      {/* Optional Footer/Divider for balance */}
                      <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">View Details</span>
                         <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
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