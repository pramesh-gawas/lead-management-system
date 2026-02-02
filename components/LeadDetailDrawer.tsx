"use client";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
  Chip,
  TextField,
  Button,
  Avatar,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLeads } from "../context/LeadContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
  author_id?: string;
}

export default function LeadDetailDrawer() {
  const { selectedLead, setSelectedLead } = useLeads();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const handleAddNote = async () => {
    if (!note.trim() || !selectedLead) return;
    setIsPosting(true);

    const { data, error } = await supabase
      .from("lead_notes")
      .insert([{ lead_id: selectedLead.id, content: note }])
      .select()
      .single();

    if (!error) {
      setNotes([data, ...notes]);
      setNote("");
    }
    setIsPosting(false);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedLead?.id) return;

      const { data, error } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", selectedLead.id)
        .order("created_at", { ascending: false });

      if (!error) setNotes(data);
    };

    fetchNotes();
  }, [selectedLead?.id]);

  return (
    <Drawer
      anchor="right"
      open={!!selectedLead}
      onClose={() => setSelectedLead(null)}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* HEADER */}
      <Box p={3} sx={{ borderBottom: "1px solid #eee" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Lead Details
          </Typography>
          <IconButton onClick={() => setSelectedLead(null)}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* CONTENT - Scrollable */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {selectedLead && (
          <>
            <Typography variant="h5" fontWeight="bold">
              {selectedLead.name}
            </Typography>
            <Typography color="textSecondary">
              {selectedLead.company}
            </Typography>
            <Chip
              label={selectedLead.status}
              color="primary"
              size="small"
              sx={{ mt: 1, mb: 2 }}
            />

            <Stack spacing={2} sx={{ mb: 4 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body2">{selectedLead.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Value
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="success.main"
                >
                  ${Number(selectedLead.value).toLocaleString()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* NEW NOTE INPUT */}
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Activity
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddNote}
              disabled={isPosting || !note.trim()}
              sx={{ mb: 4 }}
            >
              {isPosting ? "Posting..." : "Post Note"}
            </Button>

            {/* NOTES LIST */}
            <Stack spacing={2}>
              {notes.map((n) => (
                <Box key={n.id} sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                    A
                  </Avatar>
                  <Paper
                    variant="outlined"
                    sx={{ p: 1.5, flexGrow: 1, bgcolor: "#f9fafb" }}
                  >
                    <Typography variant="body2">{n.content}</Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {new Date(n.created_at).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  );
}
