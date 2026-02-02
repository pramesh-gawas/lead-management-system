"use client";
import React from "react";
import LeadList from "@/components/LeadList";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LeadForm from "@/components/LeadForm";

export default function LeadsPage() {
  return (
    <Box>
      <Box mb={3}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.primary">Leads</Typography>
        </Breadcrumbs>
        <Typography variant="h4" fontWeight="bold" mt={1}>
          Lead Management
        </Typography>
        <LeadForm></LeadForm>
      </Box>

      <LeadList />
    </Box>
  );
}
