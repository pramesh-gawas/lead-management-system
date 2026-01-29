"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Lead, LeadStats, LeadStatus } from "../types/lead";
import { supabase } from "@/lib/supabase";

interface LeadContextType {
  leads: Lead[];
  loading: boolean;
  addLead: (
    lead: Omit<Lead, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
  stats: LeadStats;
  filter: LeadStatus | "ALL";
  setFilter: (filter: LeadStatus | "ALL") => void;
  filteredLeads: Lead[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = filter === "ALL" || lead.status === filter;
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leads, filter, searchTerm]);
  const stats = {
    totalLeads: leads.length,
    totalValue: leads.reduce((sum, lead) => sum + Number(lead.value), 0),
    wonValue: leads
      .filter((l) => l.status === "WON")
      .reduce((sum, lead) => sum + Number(lead.value), 0),
    pipelineCount: leads.filter(
      (l) => l.status !== "WON" && l.status !== "LOST",
    ).length,
  };

  const updateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : lead,
        ),
      );
    } else {
      console.error("Error updating status:", error);
    }
  };

  const addLead = async (
    newLead: Omit<Lead, "id" | "created_at" | "updated_at">,
  ) => {
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
    <LeadContext.Provider
      value={{
        leads,
        loading,
        addLead,
        deleteLead,
        updateLeadStatus,
        stats,
        filter,
        setFilter,
        filteredLeads,
        searchTerm,
        setSearchTerm,
        selectedLead,
        setSelectedLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used within a LeadProvider");
  return context;
}
