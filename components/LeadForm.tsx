"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, MenuItem, Paper, Typography } from "@mui/material";
import { leadSchema, LeadFormValues } from "../lib/validations/lead";
import { useLeads } from "@/context/LeadContext";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LeadForm() {
  const { fetchLeads } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      company: "",
      value: 0,
      status: "NEW",
      source: "Direct",
    },
  });

  const onSubmit = async (formData: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      const { error } = await supabase.from("leads").insert([
        {
          ...formData,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      alert("Lead saved successfully!");
      fetchLeads();
      reset();
    } catch (error: any) {
      console.error("Failed to save:", error.message);
      alert(`Save failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper className="p-6 max-w-2xl mx-auto mt-10">
      <Typography variant="h5" className="mb-6 font-bold text-slate-800">
        Create New Lead
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <TextField
          label="Full Name"
          {...register("name")}
          error={!!errors.name}
          value={watch("name") || ""}
          helperText={errors.name?.message}
          fullWidth
        />

        <TextField
          label="Email Address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />

        <TextField
          label="Company"
          {...register("company")}
          value={watch("company") || ""}
          error={!!errors.company}
          helperText={errors.company?.message}
          fullWidth
        />

        <TextField
          label="Expected Value ($)"
          type="number"
          {...register("value")}
          error={!!errors.value}
          helperText={errors.value?.message}
          fullWidth
        />

        <TextField
          select
          label="Status"
          {...register("status")}
          value={watch("status") || "NEW"}
          error={!!errors.status}
          helperText={errors.status?.message}
          fullWidth
          className="md:col-span-2"
        >
          {["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"].map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ),
          )}
        </TextField>

        <TextField
          select
          fullWidth
          label="Lead Source"
          {...register("source")}
          error={!!errors.source}
          value={watch("source") || "Direct"}
          helperText={errors.source?.message}
        >
          {["LinkedIn", "Website", "Referral", "Cold Call", "Direct"].map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ),
          )}
        </TextField>

        <div className="md:col-span-2 mt-4">
          <Button
            type="submit"
            variant="contained"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Lead"}
          </Button>
        </div>
      </form>
    </Paper>
  );
}
