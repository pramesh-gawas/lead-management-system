"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Lead } from "../types/lead";
import { supabase } from "@/lib/supabase";

interface LeadContextType {
  leads: Lead[];
  loading: boolean;
  addLead: (lead: Omit<Lead, "id" | "created_at">) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
      } else {
        setLeads(data || []);
      }
      setLoading(false);
    };

    fetchLeads();
  }, []);

  const addLead = async (newLead: Omit<Lead, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("leads")
      .insert([newLead])
      .select();

    if (error) {
      alert("Error saving lead: " + error.message);
    } else if (data) {
      setLeads((prev) => [data[0], ...prev]);
    }
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      alert("Error deleting lead");
    } else {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }
  };

  return (
    <LeadContext.Provider value={{ leads, loading, addLead, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used within a LeadProvider");
  return context;
}
