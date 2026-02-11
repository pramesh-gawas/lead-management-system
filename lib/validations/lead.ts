import * as z from "zod";

export const LEAD_SOURCES = ["LinkedIn", "Website", "Referral", "Cold Call", "Direct"] as const;

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  value: z.coerce.number().min(0, "Value cannot be negative"),
  status: z.enum(["NEW","CONTACTED","QUALIFIED","PROPOSAL","WON","LOST",]),
  source: z.enum(LEAD_SOURCES),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
export interface Lead extends LeadFormValues {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}