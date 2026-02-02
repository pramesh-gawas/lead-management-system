"use client";
import React, { useState } from "react";
import { useLeads } from "../context/LeadContext";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Typography,
  Tooltip,
  Button,
  Checkbox,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { LEAD_STATUS, LeadStatus } from "@/types/lead";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { supabase } from "@/lib/supabase";

const getStatusColor = (status: string) => {
  switch (status) {
    case LEAD_STATUS.NEW:
      return "info";
    case LEAD_STATUS.WON:
      return "success";
    case LEAD_STATUS.LOST:
      return "error";
    default:
      return "primary";
  }
};

export default function LeadList() {
  const {
    leads,
    loading,
    deleteLead,
    updateLeadStatus,
    filteredLeads,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    setSelectedLead,
  } = useLeads();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredLeads.map((n) => n.id);
      setSelectedIds(newSelected);
      return;
    }
    setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedIds, id];
    } else {
      newSelected = selectedIds.filter((item) => item !== id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedIds.length} leads?`)) {
      await Promise.all(selectedIds.map((id) => deleteLead(id)));
      setSelectedIds([]);
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("CRM Lead Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Status: ${filter} | Search: ${searchTerm || "None"}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    const tableRows = filteredLeads.map((lead) => [
      lead.name,
      lead.company,
      lead.status,
      `$${Number(lead.value).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["Name", "Company", "Status", "Value"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save(`leads-report-${new Date().getTime()}.pdf`);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Active Leads
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={downloadPDF}
          disabled={filteredLeads.length === 0}
        >
          Download PDF
        </Button>
      </Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={filter}
          onChange={(_, v) => setFilter(v)}
          variant="scrollable"
        >
          <Tab label="ALL" value="ALL" />
          {Object.values(LEAD_STATUS).map((s) => (
            <Tab key={s} label={s} value={s} />
          ))}
        </Tabs>
      </Paper>
      <TextField
        fullWidth
        placeholder="Search leads..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, bgcolor: "white" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearchTerm("")} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {selectedIds.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "#fff5f5",
          }}
        >
          <Typography color="error.main" fontWeight="bold">
            {selectedIds.length} leads selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </Paper>
      )}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < filteredLeads.length
                  }
                  checked={
                    filteredLeads.length > 0 &&
                    selectedIds.length === filteredLeads.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Lead</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Value
              </TableCell>

              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => {
              const isItemSelected = selectedIds.indexOf(lead.id) !== -1;
              return (
                <TableRow
                  key={lead.id}
                  hover
                  onClick={() => setSelectedLead(lead)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleSelectOne(lead.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "primary.main",
                        fontStyle: "italic",
                        display: "block",
                      }}
                    >
                      Updated:{" "}
                      {new Date(lead.updated_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {lead.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {lead.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "block" }}
                    >
                      Added:{" "}
                      {new Date(lead.created_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <TextField
                      select
                      size="small"
                      value={lead.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        updateLeadStatus(lead.id, e.target.value as LeadStatus);
                      }}
                      sx={{ minWidth: 120 }}
                    >
                      {Object.values(LEAD_STATUS).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "mono" }}>
                    ${Number(lead.value).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLead(lead.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
