import * as z from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  value: z.coerce.number().min(0, "Value cannot be negative"),
  status: z.enum(["NEW","CONTACTED","QUALIFIED","PROPOSAL","WON","LOST",]),
});

export type LeadFormValues = z.infer<typeof leadSchema>;