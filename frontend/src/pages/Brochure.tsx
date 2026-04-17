import { Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

const Brochure = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  // 🔥 REAL LOGIC: Check if admin has uploaded a brochure
  const [isAvailable, setIsAvailable] = useState(false);
  const [documentName, setDocumentName] = useState("Company Brochure");

  useEffect(() => {
    // Check local storage to see if admin uploaded it from Admin Panel
    const activeFile = localStorage.getItem("activeBrochure");
    if (activeFile) {
      setIsAvailable(true);
      setDocumentName(activeFile); // Jo file upload hui hai, wahi naam use karenge
    }
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return alert("Name and Email are required!");

    setIsDownloading(true);

    try {
      const payload = {
        name: name,
        company: company || "Independent",
        documentName: documentName,
        email: email,
        date: new Date().toISOString()
      };

      // Backend me request save ho rahi hai
      await axios.post("https://shonalinetworks.com/api/brochures", payload);

      setTimeout(() => {
        setIsDownloading(false);
        setDownloadComplete(true);
        
        // --- DIRECT DOWNLOAD LOGIC ---
        // Apni actual PDF file ko frontend ke 'public' folder me 'brochure.pdf' naam se save zaroor karna
        const link = document.createElement("a");
        link.href = "/brochure.pdf"; 
        link.setAttribute("download", documentName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        
        // Reset form
        setTimeout(() => {
            setDownloadComplete(false);
            setName("");
            setEmail("");
            setCompany("");
        }, 5000);
      }, 1500);

    } catch (error) {
      console.error("Failed to track download:", error);
      setIsDownloading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="section-padding min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Copy */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 shadow-inner">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 leading-tight">
                Download Our <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Master Brochure
                </span>
              </h1>
              <p className="text-slate-500 mb-8 text-lg">
                Get a comprehensive overview of our services, portfolio, and architecture blueprints in a beautifully designed PDF.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-4">What's Inside the Document</h3>
                {["Company overview & vision", "Complete digital service catalog", "Featured architectural case studies", "Performance marketing metrics", "Client testimonials"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Lead Capture Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Request Access</h3>
                  
                  {/* 🔥 UI CHECK: Available hai ya nahi */}
                  {!isAvailable ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center mt-4">
                      <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                      <h4 className="text-amber-800 font-bold mb-1">Currently Unavailable</h4>
                      <p className="text-amber-600 text-sm">We are updating our brochure. Please check back later!</p>
                    </div>
                  ) : downloadComplete ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in zoom-in mt-4">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-green-800 font-bold text-lg mb-1">Request Approved!</h4>
                      <p className="text-green-600 text-sm">Your download has started on your device. We've tracked this request.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleDownload} className="space-y-4 mt-4">
                      <p className="text-sm text-slate-500 mb-6">Enter your details to receive the download link immediately.</p>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name *</label>
                        <input 
                          type="text" required value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address *</label>
                        <input 
                          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                          placeholder="john@company.com" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Company Name</label>
                        <input 
                          type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" 
                          placeholder="Optional" 
                        />
                      </div>

                      <Button disabled={isDownloading} className="w-full h-14 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 text-base font-bold transition-all flex items-center justify-center">
                        {isDownloading ? "Generating PDF..." : <><Download className="w-5 h-5 mr-2" /> Download Brochure</>}
                      </Button>
                      <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-semibold">
                        Your data is secure with us
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Brochure;