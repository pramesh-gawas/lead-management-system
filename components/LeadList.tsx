"use client";
import React, { useState } from "react";
import { useLeads } from "../context/LeadContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
  Chip,
} from "@mui/material";
import { LEAD_STATUS } from "@/types/lead";
const getStatusColor = (status: string) => {
  switch (status) {
    case LEAD_STATUS.NEW:
      return "info";
    case LEAD_STATUS.CONTACTED:
      return "primary";
    case LEAD_STATUS.QUALIFIED:
      return "warning";
    case LEAD_STATUS.PROPOSAL:
      return "secondary";
    case LEAD_STATUS.WON:
      return "success";
    case LEAD_STATUS.LOST:
      return "error";
    default:
      return "default";
  }
};

export default function LeadList() {
  const { leads } = useLeads();
  const [filter, setFilter] = useState("All");
  const filteredLeads =
    filter === "All" ? leads : leads.filter((lead) => lead.status === filter);

  return (
    <Box className="mt-8">
      <Paper className="mb-4 shadow-sm">
        <Tabs
          value={filter}
          onChange={(_, newValue) => setFilter(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Leads" value="All" />
          <Tab label="New" value={LEAD_STATUS.NEW} />
          <Tab label="Won" value={LEAD_STATUS.WON} />
          <Tab label="Lost" value={LEAD_STATUS.LOST} />
          <Tab label="Proposal" value={LEAD_STATUS.PROPOSAL} />
          <Tab label="Contacted" value={LEAD_STATUS.CONTACTED} />
          <Tab label="Qualified" value={LEAD_STATUS.QUALIFIED} />
        </Tabs>
      </Paper>

      <TableContainer
        component={Paper}
        className="shadow-md rounded-lg overflow-hidden"
      >
        <Table>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Company</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold text-right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-slate-50">
                <TableCell>{lead.name}</TableCell>
                <TableCell className="text-slate-600">{lead.company}</TableCell>
                <TableCell>
                  <Chip
                    label={lead.status}
                    size="small"
                    color={getStatusColor(lead.status) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${lead.value.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {filteredLeads.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  className="py-20 text-slate-400"
                >
                  No {filter === "All" ? "" : filter} leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
