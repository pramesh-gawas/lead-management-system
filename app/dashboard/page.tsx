"use client";
import React from "react";
import { Grid, Typography, Box, Container } from "@mui/material";
import LeadCharts from "@/components/LeadChart";
import LeadStats from "@/components/DashboardStats";

export default function DashboardPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          CRM Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here is what's happening with your leads today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={12}>
          <LeadStats />
        </Grid>

        <Grid size={12}>
          <LeadCharts />
        </Grid>
      </Grid>
    </Container>
  );
}
