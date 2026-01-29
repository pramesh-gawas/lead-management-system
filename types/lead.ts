export const LEAD_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  PROPOSAL: "PROPOSAL",
  WON: "WON",
  LOST: "LOST",
} as const;

export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company:string;
  value:number;
  status: LeadStatus;
  created_at: string;
  updated_at:string;
}

export interface LeadStats {
  totalLeads: number;
  totalValue: number;
  wonValue: number;
  pipelineCount: number;
}