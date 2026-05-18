import React from "react";
import { AuthProvider } from "./AuthContext";
import { ServiceProvider } from "./ServiceContext";
import { LeadProvider } from "./LeadContext";
import { ProjectProvider } from "./ProjectContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ServiceProvider>
        <ProjectProvider>
          <LeadProvider>
            {children}
          </LeadProvider>
        </ProjectProvider>
      </ServiceProvider>
    </AuthProvider>
  );
};