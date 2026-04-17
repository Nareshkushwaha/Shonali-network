import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- Yeh naya import kiya hai

interface ServiceModalProps {
  service: any | null; 
  open: boolean;
  onClose: () => void;
}

const ServiceModal = ({ service, open, onClose }: ServiceModalProps) => {
  const navigate = useNavigate(); // <-- Navigation ke liye setup

  // Jab modal open ho, tab background scroll rokne ke liye
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

  // CTA Button click hone par yeh function chalega
  const handleCtaClick = () => {
    onClose(); // Pehle modal band karo
    navigate("/contact"); // Phir contact page par jao
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-[#f8fafc] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header Section */}
            <div className="bg-slate-100/50 px-8 py-6 flex items-start justify-between border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-blue-600 text-3xl">web</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {service.title}
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 rounded-full transition-all shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Section */}
            <div className="p-8 overflow-y-auto no-scrollbar">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {service.featuresList && service.featuresList.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-base text-slate-600 font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                  {(!service.featuresList || service.featuresList.length === 0) && (
                    <p className="text-sm text-slate-400 italic">No specific features listed.</p>
                  )}
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  Ideal For
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-full border border-slate-200 shadow-sm">Portfolio sites</span>
                  <span className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-full border border-slate-200 shadow-sm">Landing pages</span>
                  <span className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-full border border-slate-200 shadow-sm">Company brochures</span>
                </div>
              </div>
            </div>

            {/* Footer Section (Sticky at bottom) */}
            <div className="bg-white p-6 md:p-8 border-t border-slate-200">
              {service.price && (
                <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100 flex justify-center">
                  <p className="text-blue-700 font-semibold text-lg">Starting from ₹{service.price}</p>
                </div>
              )}
              
              {/* <-- Yahan onClick me handleCtaClick laga diya hai --> */}
              <button 
                onClick={handleCtaClick}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
              >
                {service.cta || "Get Started"} <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;