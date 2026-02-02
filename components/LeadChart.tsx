"use client";
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Paper, Typography, Grid, Box } from "@mui/material";
import { useLeads } from "../context/LeadContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function LeadCharts() {
  const { filteredLeads } = useLeads();

  const sourceData = useMemo(() => {
    const sources: Record<string, { name: string; count: number }> = {};

    filteredLeads.forEach((lead) => {
      const s = lead.source || "Direct";
      if (!sources[s]) sources[s] = { name: s, count: 0 };
      sources[s].count += 1;
    });

    return Object.values(sources);
  }, [filteredLeads]);

  const chartData = useMemo(() => {
    const statusCounts: Record<
      string,
      { name: string; count: number; value: number }
    > = {};

    filteredLeads.forEach((lead) => {
      if (!statusCounts[lead.status]) {
        statusCounts[lead.status] = { name: lead.status, count: 0, value: 0 };
      }
      statusCounts[lead.status].count += 1;
      statusCounts[lead.status].value += Number(lead.value) || 0;
    });

    return Object.values(statusCounts);
  }, [filteredLeads]);

  return (
    <Grid container spacing={3} mb={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: 400, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Lead Distribution (Status)
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: 400, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Pipeline Value ($)
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number | string | undefined) => {
                  if (value === undefined) return "$0";
                  return `$${Number(value).toLocaleString()}`;
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3, height: 300, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Leads by Source
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
