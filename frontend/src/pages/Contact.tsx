import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useData } from "../context/DataContext";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@shonalinetwork.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Location", value: "India" },
];

const Contact = () => {
  const { addLead } = useData(); 
  const [sending, setSending] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceInterest, setServiceInterest] = useState("Web Development");
  
  // 🔥 Default budget set to ₹5k - ₹10k
  const [budget, setBudget] = useState("₹5k - ₹10k");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      const newId = `L-${Math.floor(Math.random() * 9000) + 1000}`;

      addLead({
        id: newId,
        name,
        email,
        serviceInterest,
        budget,
        status: "New",
        message,
        date: new Date().toLocaleDateString()
      });

      setSending(false);
      toast.success("Message sent! We'll get back to you soon.");
      
      // Form reset
      setName("");
      setEmail("");
      setMessage("");
      setServiceInterest("Web Development");
      setBudget("₹5k - ₹10k");

    }, 800); 
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have a project in mind? Let's talk about how we can help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((c) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="font-medium text-sm">{c.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FULLY DYNAMIC FORM */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your Name" 
                  required 
                  className="rounded-xl" 
                />
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  className="rounded-xl" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select 
                  value={serviceInterest} 
                  onChange={(e) => setServiceInterest(e.target.value)} 
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="SEO">SEO & Marketing</option>
                  <option value="Branding">Branding</option>
                  <option value="Other">Other Query</option>
                </select>

                {/* 🔥 Indian Rupees (INR) Dropdown with Exact Amount Option */}
                <select 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)} 
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Under ₹5k">Under ₹5k</option>
                  <option value="₹5k - ₹10k">₹5k - ₹10k</option>
                  <option value="₹10k - ₹15k">₹10k - ₹15k</option>
                  <option value="₹15k - ₹25k">₹15k - ₹25k</option>
                  <option value="₹25k - ₹50k">₹25k - ₹50k</option>
                  <option value="₹50k+">₹50k+</option>
                  <option value="Exact Amount (Specify in Message)">Exact Amount (Specify in Message)</option>
                </select>
              </div>

              <Textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Tell us about your project..." 
                rows={5} 
                required 
                className="rounded-xl resize-none" 
              />
              
              <Button type="submit" disabled={sending} className="gap-2 rounded-xl">
                <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;