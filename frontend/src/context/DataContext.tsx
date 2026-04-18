import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// ==========================
// 1. TYPES 
// ==========================
export type SubService = { id: string; parentService: string; title: string; price: string; description: string; featuresList: string[]; cta: string; status?: string; };
export type Project = { id: string; title: string; category: string; image: string; description: string; };
export type Lead = { id: string; name: string; email: string; serviceInterest: string; budget: string; status: "New" | "Contacted" | "Qualified" | "Won"; message: string; date: string; };
export type BrochureRequest = { id: string; name: string; email?: string; company: string; documentName: string; status: "Pending" | "Dispatched" | "Archiving"; date: string; };
export type UserProfile = { name: string; email: string; role: string; avatarUrl?: string; };

type DataContextType = {
  currentUser: UserProfile; 
  updateUser: (user: Partial<UserProfile>) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{success: boolean; message?: string; error?: string}>;
  searchQuery: string; 
  setSearchQuery: (query: string) => void; 
  services: SubService[]; 
  addService: (service: SubService) => void; 
  deleteService: (id: string) => void;
  projects: Project[]; 
  addProject: (project: Project) => void; 
  deleteProject: (id: string) => void;
  leads: Lead[]; 
  addLead: (lead: Lead) => void; 
  updateLeadStatus: (id: string, newStatus: Lead["status"]) => void; 
  deleteLead: (id: string) => void;
  brochureRequests: BrochureRequest[]; 
  updateBrochureStatus: (id: string, newStatus: BrochureRequest["status"]) => void; 
  addDummyRequest: () => void; 
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// ==========================
// 🔥 AUTO-SWITCH URL LOGIC
// ==========================
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_URL = isLocalhost 
  ? "http://localhost:5000/api" 
  : "https://shonalinetworks.com/api";

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  
  // ==========================
  // 2. STATES
  // ==========================
  const [currentUser, setCurrentUser] = useState<UserProfile>({ name: "Admin", email: "admin@shonalinetwork.com", role: "Super Admin", avatarUrl: "" });
  const [searchQuery, setSearchQuery] = useState(""); 
  const [services, setServices] = useState<SubService[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [brochureRequests, setBrochureRequests] = useState<BrochureRequest[]>([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // ==========================
  // 3. FETCH DATA LOGIC
  // ==========================
  useEffect(() => {
    const fetchAllData = async () => {
      
      try {
        const projectsRes = await axios.get(`${API_URL}/projects`);
        setProjects(projectsRes.data);
      } catch (err) { console.error("Projects Fetch Error", err); }

      try {
        const servicesRes = await axios.get(`${API_URL}/sub-services`);
        setServices(servicesRes.data);
      } catch (err) { console.error("Sub-Services Fetch Error", err); }

      const token = localStorage.getItem("token");
      if (token && token !== "null") {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
          const leadsRes = await axios.get(`${API_URL}/leads`, config);
          setLeads(leadsRes.data);
        } catch (err) { console.error("Leads Fetch Error", err); }

        try {
          const profileRes = await axios.get(`${API_URL}/admin/profile`, config);
          setCurrentUser(profileRes.data);
        } catch (err) { console.error("Profile Fetch Error", err); }

        try {
          const brochuresRes = await axios.get(`${API_URL}/brochures`, config);
          setBrochureRequests(brochuresRes.data);
        } catch (err) { console.error("Brochures Fetch Error", err); }
      }
    };

    fetchAllData();
  }, []);

  // ==========================
  // 4. ACTION FUNCTIONS 
  // ==========================
  
  const updateUser = async (user: Partial<UserProfile>) => {
    try {
      const res = await axios.put(`${API_URL}/admin/profile`, user, getAuthHeaders());
      setCurrentUser(res.data.data); 
    } catch (err) { console.error(err); }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    try {
      const res = await axios.put(`${API_URL}/admin/change-password`, { currentPassword: oldPass, newPassword: newPass }, getAuthHeaders());
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Password change failed" };
    }
  };

  const addLead = async (lead: Lead) => {
    try {
      const res = await axios.post(`${API_URL}/leads`, lead);
      setLeads([res.data.data, ...leads]); 
    } catch (err) { console.error(err); }
  };

  const updateLeadStatus = async (id: string, newStatus: Lead["status"]) => {
    try {
      await axios.put(`${API_URL}/leads/${id}`, { status: newStatus }, getAuthHeaders());
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l)); 
    } catch (err) { console.error(err); }
  };

  const deleteLead = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/leads/${id}`, getAuthHeaders());
      setLeads(leads.filter(l => l.id !== id)); 
    } catch (err) { console.error(err); }
  };

  const addService = (service: SubService) => {
    setServices([...services, service]);
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addProject = async (project: Project) => {
    try {
      const res = await axios.post(`${API_URL}/projects`, project, getAuthHeaders());
      setProjects([res.data.data, ...projects]);
    } catch (err) { console.error(err); }
  };

  const deleteProject = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/projects/${id}`, getAuthHeaders());
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const updateBrochureStatus = async (id: string, newStatus: BrochureRequest["status"]) => {
    try {
      await axios.put(`${API_URL}/brochures/${id}`, { status: newStatus }, getAuthHeaders());
      setBrochureRequests(brochureRequests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) { console.error(err); }
  };

  const addDummyRequest = async () => {};

  return (
    <DataContext.Provider value={{ 
      currentUser, 
      updateUser, 
      changePassword,
      searchQuery, 
      setSearchQuery, 
      services, 
      addService, 
      deleteService, 
      projects, 
      addProject, 
      deleteProject,
      leads, 
      addLead, 
      updateLeadStatus, 
      deleteLead,
      brochureRequests, 
      updateBrochureStatus, 
      addDummyRequest
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};