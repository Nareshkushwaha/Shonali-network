import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios"; 
import { API_URL } from "../../config/api";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@shonalinetwork.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Location", value: "India" },
];

const Contact = () => {
  const [sending, setSending] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceInterest, setServiceInterest] = useState("Web Development");
  const [budget, setBudget] = useState("₹5k - ₹10k");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const payload = {
        name,
        email,
        serviceInterest,
        budget,
        message,
        // status aur date backend khud laga lega
      };

      // 👉 FIX 2: Seedha Axios se data bheja (Bina kisi Admin Context/Token ke)
      await axios.post(`${API_URL}/leads`, payload);

      toast.success("Message sent! We'll get back to you soon.");
      
      // Form ko wapas khali kar diya
      setName("");
      setEmail("");
      setMessage("");
      setServiceInterest("Web Development");
      setBudget("₹5k - ₹10k");

    } catch (error) {
      console.error("Lead Error:", error);
      toast.error("Failed to send inquiry. Please try again or check backend.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <section className="section-padding py-20 bg-slate-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Let's discuss how we can help your business grow digitally.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              {contactInfo.map((c) => (
                <div key={c.label} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">{c.label}</p>
                    <p className="font-bold text-sm text-slate-800">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-6 md:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                   <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="rounded-xl h-12 bg-slate-50 border-slate-200 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                   <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" required className="rounded-xl h-12 bg-slate-50 border-slate-200 focus:ring-blue-500/20" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Required</label>
                   <select value={serviceInterest} onChange={(e) => setServiceInterest(e.target.value)} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-700">
                     <option value="Web Development">Web Development</option>
                     <option value="App Development">App Development</option>
                     <option value="SEO">SEO & Marketing</option>
                     <option value="Branding">Branding</option>
                   </select>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Budget</label>
                   <select value={budget} onChange={(e) => setBudget(e.target.value)} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-700">
                     <option value="Under ₹5k">Under ₹5k</option>
                     <option value="₹5k - ₹10k">₹5k - ₹10k</option>
                     <option value="₹10k - ₹50k">₹10k - ₹50k</option>
                     <option value="₹50k+">₹50k+</option>
                   </select>
                </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Details</label>
                 <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your project..." rows={4} required className="rounded-xl resize-none bg-slate-50 border-slate-200 focus:ring-blue-500/20 text-sm p-4" />
              </div>
              
              <Button type="submit" disabled={sending} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[15px] transition-all shadow-md mt-2">
                {sending ? "Transmitting..." : "Send Request"}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;