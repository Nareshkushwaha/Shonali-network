// src/context/ProjectContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";

const ProjectContext = createContext<any>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <ProjectContext.Provider value={{ projects, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectData = () => useContext(ProjectContext);