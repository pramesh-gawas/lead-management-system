"use client";
import { useLeads } from "@/context/LeadContext";
import { Paper, Typography } from "@mui/material";

export default function DashboardStats() {
  const { leads } = useLeads();

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const totalLeads = leads.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Paper className="p-6 border-l-4 border-blue-500">
        <Typography color="textSecondary" gutterBottom>
          Total Leads
        </Typography>
        <Typography variant="h4" className="font-bold">
          {totalLeads}
        </Typography>
      </Paper>

      <Paper className="p-6 border-l-4 border-green-500">
        <Typography color="textSecondary" gutterBottom>
          Pipeline Value
        </Typography>
        <Typography variant="h4" className="font-bold">
          ${totalValue.toLocaleString()}
        </Typography>
      </Paper>
    </div>
  );
}
