import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Code } from "lucide-react"; 
import { useState } from "react";
import Layout from "@/components/Layout";
import ServiceModal from "@/components/ServiceModal";
import { getServiceBySlug } from "@/data/services"; 
import { useData } from "../context/DataContext"; 

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const baseService = getServiceBySlug(slug || "");
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  
  const { services } = useData(); 

  if (!baseService) {
    return (
      <Layout>
        <div className="py-20 container mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <Link to="/services" className="text-blue-600 font-medium hover:underline">Back to Services</Link>
        </div>
      </Layout>
    );
  }

  // Filter SubServices based on the parent
  const filteredSubServices = services.filter(
    (sub) => sub.parentService === baseService.title
  );

  const MainIcon = baseService.icon;

  return (
    <Layout>
      {/* Background waisa hi rakha hai jaisa aapke screenshot me hai */}
      <section className="bg-[#f8fafc] min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-10 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          {/* Header Area */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-16">
            <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${baseService.gradient || 'from-blue-500 to-blue-600'} flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0`}>
              <MainIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">{baseService.title}</h1>
              <p className="text-slate-500 text-lg max-w-2xl">{baseService.shortDescription}</p>
            </div>
          </div>

          {/* EXACT DESIGN CARDS GRID */}
          {/* grid-cols-4 ensure karega ki 4 card ek line me aayein */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredSubServices.length === 0 ? (
               <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                 <p className="text-slate-500 text-lg">No sub-services available for {baseService.title} yet.</p>
                 <p className="text-sm text-slate-400 mt-2">Add them from your Admin Panel.</p>
               </div>
            ) : (
              filteredSubServices.map((sub, i) => (
                <motion.button
                  key={sub.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  onClick={() => setSelectedSub(sub)}
                  className="bg-white rounded-3xl p-8 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(37,99,235,0.1)] transition-all duration-300 cursor-pointer group flex flex-col h-full border border-slate-50 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <span className="material-symbols-outlined text-blue-600 group-hover:text-white transition-colors duration-300">web</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-xl mb-3">{sub.title}</h3>
                  <p className="text-[15px] text-slate-500 mb-8 line-clamp-3 leading-relaxed flex-grow">{sub.description}</p>
                  
                  <div className="mt-auto w-full pt-6 border-t border-slate-100">
                    {sub.price && (
                      <p className="text-[13px] font-semibold text-blue-600 mb-3">Starting from ₹{sub.price}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all duration-300">
                      View Details <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </section>

      <ServiceModal service={selectedSub} open={!!selectedSub} onClose={() => setSelectedSub(null)} />
    </Layout>
  );
};

export default ServiceDetail;