import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react"; 
import { useState } from "react";
import Layout from "@/components/Layout";
import ServiceModal from "@/components/ServiceModal";
import { getServiceBySlug } from "@/data/services"; 
import { useServiceData } from "../context/ServiceContext"; 

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const baseService = getServiceBySlug(slug || "");
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  
  // 🔥 PURE DYNAMIC: Sirf Database wali services aayengi
  const { services } = useServiceData(); 

  if (!baseService) {
    return (
      <Layout>
        <div className="py-20 container mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
             <span className="material-symbols-outlined text-slate-400 text-3xl">search_off</span>
          </div>
          <h1 className="text-2xl font-extrabold mb-2 text-slate-800">Service Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">The service configuration you are looking for doesn't exist.</p>
          <Link to="/services" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">View All Services</Link>
        </div>
      </Layout>
    );
  }

  // 🔥 100% DYNAMIC: Koi static data mix nahi kiya. Jo Admin se aayega bas wahi filter hoga.
  const allSubServices = services.filter(
    (sub: any) => sub.parentService?.toLowerCase().trim() === baseService.title.toLowerCase().trim()
  );
  
  const MainIcon = baseService.icon;

  return (
    <Layout>
      <section className="bg-slate-50/50 min-h-screen py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <Link to="/services" className="inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-900 transition-colors mb-8 font-bold tracking-wide uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          {/* Compact Header Area */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-12 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${baseService.gradient || 'from-blue-500 to-blue-600'} flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0`}>
              <MainIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">{baseService.title}</h1>
              <p className="text-slate-500 text-sm max-w-2xl font-medium">{baseService.shortDescription}</p>
            </div>
            <div className="ml-auto hidden md:block">
               <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider">
                  {allSubServices.length} Modules
               </span>
            </div>
          </div>

          {/* 🔥 SLEEK & COMPACT SUB-SERVICES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allSubServices.length === 0 ? (
               <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
                 <span className="material-symbols-outlined text-slate-300 text-4xl mb-3">grid_view</span>
                 <p className="text-slate-600 font-bold text-sm">No configurations available for {baseService.title}.</p>
                 <p className="text-xs text-slate-400 mt-1">Add sub-services from your Admin Workspace.</p>
               </div>
            ) : (
              allSubServices.map((sub: any, i) => {
                
                // Safe Icon Rendering Logic
                const IconComponent = sub.icon;
                const isStringIcon = typeof sub.icon === 'string';

                return (
                  <motion.button
                    key={sub.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    onClick={() => setSelectedSub(sub)}
                    className="bg-white rounded-xl p-5 text-left border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group flex flex-col h-full hover:-translate-y-1"
                  >
                    {/* Top Row: Icon aur Price ek saath taaki jagah bache */}
                    <div className="flex justify-between items-start mb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 border border-slate-100 shrink-0">
                        {isStringIcon ? (
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors duration-300 text-[20px]">
                            {sub.icon}
                          </span>
                        ) : IconComponent ? (
                          <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors duration-300 text-[20px]">
                            extension
                          </span>
                        )}
                      </div>
                      
                      {/* Compact Pricing Pill */}
                      {sub.price && (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md shrink-0 ml-2 text-right line-clamp-1">
                          ₹{sub.price}
                        </span>
                      )}
                      {sub.pricingHint && !sub.price && (
                        <span className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md shrink-0 ml-2 text-right line-clamp-1">
                          {sub.pricingHint}
                        </span>
                      )}
                    </div>
                    
                    {/* 🔥 TEXT TRUNCATION: line-clamp-1 (title) aur line-clamp-2 (description) */}
                    <h3 className="font-bold text-slate-800 text-sm mb-1.5 line-clamp-1" title={sub.title}>
                      {sub.title}
                    </h3>
                    <p className="text-[12px] text-slate-500 mb-5 line-clamp-2 leading-relaxed flex-grow" title={sub.description}>
                      {sub.description}
                    </p>
                    
                    {/* Compact Footer */}
                    <div className="mt-auto w-full pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Details</span>
                      <div className="flex items-center gap-1 text-[11px] font-black text-blue-600 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all duration-300">
                        View <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.button>
                )
              })
            )}
          </div>
        </div>
      </section>

      <ServiceModal service={selectedSub} open={!!selectedSub} onClose={() => setSelectedSub(null)} />
    </Layout>
  );
};

export default ServiceDetail;