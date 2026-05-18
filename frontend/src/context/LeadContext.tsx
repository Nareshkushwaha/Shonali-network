import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";

export type Lead = { 
  id: string; 
  name: string; 
  email: string; 
  serviceInterest: string; 
  budget: string; 
  status: "New" | "Contacted" | "Qualified" | "Won"; 
  message: string; 
  date: string; 
};

type LeadContextType = {
  leads: Lead[];
  loading: boolean;
  addLead: (leadData: any) => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  fetchLeads: () => Promise<void>; // 🔥 FIX: TypeScript ko bata diya
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: React.ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Is function ko hum dashboard se call karenge fresh data ke liye
  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("shonali_token");
      const res = await axios.get(`${API_URL}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err) { 
      console.error("Leads Fetch Error", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchLeads(); 
  }, []);

  const addLead = async (leadData: any) => {
    try {
      const res = await axios.post(`${API_URL}/leads`, leadData);
      setLeads((prev) => [res.data, ...prev]);
    } catch (err) { 
      throw err; 
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("shonali_token");
      await axios.put(`${API_URL}/leads/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // UI me turant update karne ke liye
      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: status as any } : lead));
    } catch (err) { 
      alert("Failed to update status"); 
    }
  };

  const deleteLead = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const token = localStorage.getItem("shonali_token");
      await axios.delete(`${API_URL}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // UI se turant hatane ke liye
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err) { 
      alert("Failed to delete lead"); 
    }
  };

  return (
    // 🔥 FIX: fetchLeads ko provider mein add kar diya
    <LeadContext.Provider value={{ leads, loading, addLead, updateLeadStatus, deleteLead, fetchLeads }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeadData = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeadData must be used within LeadProvider");
  return context;
};