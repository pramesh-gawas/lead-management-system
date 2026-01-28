"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Lead } from "../types/lead";

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const savedLeads = localStorage.getItem("crm_leads");
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("crm_leads", JSON.stringify(leads));
  }, [leads]);

  const addLead = (newLead: Omit<Lead, "id" | "createdAt">) => {
    const leadWithMeta: Lead = {
      ...newLead,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setLeads((prev) => [leadWithMeta, ...prev]);
  };

  return (
    <LeadContext.Provider value={{ leads, addLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used within a LeadProvider");
  return context;
}
