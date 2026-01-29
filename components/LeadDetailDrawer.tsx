"use client";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLeads } from "../context/LeadContext";

export default function LeadDetailDrawer() {
  const { selectedLead, setSelectedLead } = useLeads();

  return (
    <Drawer
      anchor="right"
      open={!!selectedLead}
      onClose={() => setSelectedLead(null)}
      PaperProps={{ sx: { width: { xs: "100%", sm: 400 } } }}
    >
      <Box p={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Lead Details</Typography>
          <IconButton onClick={() => setSelectedLead(null)}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {selectedLead && (
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {selectedLead.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {selectedLead.company}
            </Typography>

            <Chip
              label={selectedLead.status}
              color="primary"
              sx={{ mt: 1, mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="textSecondary">
              Contact Information
            </Typography>
            <Typography variant="body1" mb={2}>
              {selectedLead.email}
            </Typography>

            <Typography variant="subtitle2" color="textSecondary">
              Deal Value
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="success.main">
              ${Number(selectedLead.value).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
