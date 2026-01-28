"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, MenuItem, Paper, Typography } from "@mui/material";
import { leadSchema, LeadFormValues } from "../lib/validations/lead";
import { useLeads } from "@/context/LeadContext";

export default function LeadForm() {
  const { addLead } = useLeads();
  const {
    reset,
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
    },
  });

  console.log("Current Form Errors:", errors);

  const onSubmit = (data: LeadFormValues) => {
    // console.log(data);
    addLead(data);
    alert("Lead saved to local state!");
    reset();
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
          defaultValue="NEW"
          {...register("status")}
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

        <div className="md:col-span-2 mt-4">
          <Button
            type="submit"
            variant="contained"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 w-full py-3"
          >
            Save Lead
          </Button>
        </div>
      </form>
    </Paper>
  );
}
