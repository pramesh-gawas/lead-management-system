"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState({ full_name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name })
      .eq("id", user?.id);

    if (!error) alert("Profile updated!");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f8fafc" }}
        >
          <Tab label="Profile" />
          <Tab label="Notifications" />
          <Tab label="System Config" />
        </Tabs>

        <Box p={4}>
          {/* PROFILE TAB */}
          {tabValue === 0 && (
            <Stack spacing={3} sx={{ maxWidth: 500 }}>
              <Typography variant="h6">User Profile</Typography>
              <TextField
                label="Full Name"
                defaultValue="Admin User"
                fullWidth
              />
              <TextField
                label="Email Address"
                defaultValue="admin@crm.com"
                fullWidth
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ width: "fit-content" }}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Stack>
          )}

          {/* NOTIFICATIONS TAB */}
          {tabValue === 1 && (
            <Stack spacing={2}>
              <Typography variant="h6">Notification Preferences</Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email me when a lead is WON"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Notify me of new leads"
              />
              <FormControlLabel
                control={<Switch />}
                label="Weekly summary report"
              />
            </Stack>
          )}

          {/* SYSTEM CONFIG TAB */}
          {tabValue === 2 && (
            <Stack spacing={3}>
              <Typography variant="h6">CRM Configuration</Typography>
              <Typography variant="body2" color="textSecondary">
                Currency: <strong>USD ($)</strong>
              </Typography>
              <Divider />
              <Typography variant="body2" color="error">
                Danger Zone
              </Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ width: "fit-content" }}
              >
                Clear All Lead Data
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
