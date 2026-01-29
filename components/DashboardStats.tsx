"use client";
import React from "react";
import { useLeads } from "../context/LeadContext";
import { Paper, Grid, Typography, Box, Skeleton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Fixed import
import StarsIcon from "@mui/icons-material/Stars"; // A better icon for Avg Value

export default function DashboardStats() {
  const { leads, loading } = useLeads(); // Added loading state

  // Calculations
  const totalLeads = leads.length;
  const totalValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.value) || 0),
    0,
  );
  const averageValue = totalLeads > 0 ? totalValue / totalLeads : 0;

  const wonValue = leads
    .filter((l) => l.status === "WON")
    .reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: <PeopleIcon color="primary" />,
      bgColor: "rgba(25, 118, 210, 0.08)",
    },
    {
      label: "Pipeline Value",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalValue),
      icon: <AccountBalanceWalletIcon color="success" />,
      bgColor: "rgba(46, 125, 50, 0.08)",
    },
    {
      label: "Avg. Lead Value",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(averageValue),
      icon: <StarsIcon sx={{ color: "#ed6c02" }} />, // Orange color
      bgColor: "rgba(237, 108, 2, 0.08)",
    },
    {
      label: "Closed Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(wonValue),
      icon: <StarsIcon color="primary" />, // Or any icon you like
      bgColor: "rgba(33, 150, 243, 0.08)",
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 4 }}>
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} mb={4}>
      {stats.map((stat, index) => (
        <Grid key={index} size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                backgroundColor: stat.bgColor,
                borderRadius: 2,
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
