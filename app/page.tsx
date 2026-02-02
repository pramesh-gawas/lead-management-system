"use client";
import React from "react";
import DashboardStats from "@/components/DashboardStats";
import LeadChart from "@/components/LeadChart";
import { Box, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Sales Overview
      </Typography>

      <DashboardStats />

      <Box mt={4}>
        <LeadChart />
      </Box>
    </Box>
  );
}
