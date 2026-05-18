import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceModalProps {
  service: any | null; 
  open: boolean;
  onClose: () => void;
}

const ServiceModal = ({ service, open, onClose }: ServiceModalProps) => {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleCtaClick = () => {
    onClose(); 
    navigate("/contact"); 
  };

  if (!service) return null;

  // 🔥 THE FIX: Safe Array Extractors (Ye logic untouched hai taaki crash na ho)
  const getSafeArray = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return data.split(',').map(item => item.trim()).filter(Boolean);
    return [];
  };

  const safeFeatures = getSafeArray(service.features || service.featuresList);
  const safeUseCases = getSafeArray(service.useCases);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container - Sleek & Professional */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
          >
            {/* Header Section */}
            <div className="bg-slate-50/80 px-6 py-5 flex items-start justify-between border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  {typeof service.icon === 'string' ? (
                     <span className="material-symbols-outlined text-blue-600 text-[20px]">{service.icon}</span>
                  ) : (
                     <span className="material-symbols-outlined text-blue-600 text-[20px]">web</span>
                  )}
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-0.5">Service Details</span>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight tracking-tight">
                    {service.title}
                  </h2>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Section */}
            <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
              <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium">
                {service.description || service.shortDescription || "No description provided."}
              </p>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  {safeFeatures.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 bg-blue-50 rounded-md p-0.5">
                         <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-slate-600 font-medium leading-snug">{feature}</span>
                    </div>
                  ))}
                  {safeFeatures.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No specific features listed.</p>
                  )}
                </div>
              </div>

              {/* Ideal For (Use Cases) */}
              {safeUseCases.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                    Ideal For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {safeUseCases.map((useCase: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200 shadow-sm transition-colors hover:bg-white hover:border-slate-300">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Section - Compact SaaS Style */}
            <div className="bg-slate-50 px-6 py-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto text-left">
                {(service.price || service.pricingHint) && (
                  <>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Investment</p>
                    <p className="text-blue-600 font-black text-lg tracking-tight">
                      {service.price ? `₹${service.price}` : service.pricingHint}
                    </p>
                  </>
                )}
              </div>
              
              <button 
                onClick={handleCtaClick}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                {service.cta || "Inquire Now"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;