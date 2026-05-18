import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";

export type SubService = { id: string; parentService: string; title: string; price: string; description: string; featuresList: string[]; cta: string; status?: string; };

type ServiceContextType = {
  services: SubService[];
  addService: (service: SubService) => void;
  deleteService: (id: string) => void;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [services, setServices] = useState<SubService[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/sub-services`)
      .then(res => setServices(res.data))
      .catch(err => console.error("Sub-Services Fetch Error", err));
  }, []);

  const addService = (service: SubService) => setServices([...services, service]);
  const deleteService = (id: string) => setServices(services.filter(s => s.id !== id));

  return (
    <ServiceContext.Provider value={{ services, addService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceData = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("useServiceData must be used within a ServiceProvider");
  return context;
};