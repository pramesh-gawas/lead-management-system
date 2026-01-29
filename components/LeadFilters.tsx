"use client";
import { Tabs, Tab, Box, Paper } from "@mui/material";
import { useLeads } from "@/context/LeadContext";

export default function LeadFilters() {
  const { filter, setFilter } = useLeads();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setFilter(newValue as any);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={filter}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Leads" value="ALL" />
        <Tab label="New" value="NEW" />
        <Tab label="Contacted" value="CONTACTED" />
        <Tab label="Qualified" value="QUALIFIED" />
        <Tab label="Won" value="WON" />
        <Tab label="Lost" value="LOST" />
      </Tabs>
    </Box>
  );
}
