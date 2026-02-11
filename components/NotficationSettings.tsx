"use client";
import {
  Switch,
  FormControlLabel,
  Stack,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function NotificationSettings({
  profile,
  onUpdateSuccess,
  loading,
}: {
  profile: any;
  onUpdateSuccess: () => void;
  loading: boolean;
}) {
  const [prefs, setPrefs] = useState({
    notify_won: profile?.notify_won ?? false,
    notify_new_leads: profile?.notify_new_leads ?? true,
    weekly_summary: profile?.weekly_summary ?? false,
  });

  useEffect(() => {
    if (profile) {
      setPrefs({
        notify_won: profile.notify_won,
        notify_new_leads: profile.notify_new_leads,
        weekly_summary: profile.weekly_summary,
      });
    }
  }, [profile]);

  const handleToggle = async (key: string, value: boolean) => {
    if (!profile?.id) {
      console.error("Cannot update: Profile ID is undefined");
      return;
    }
    setPrefs((prev) => ({ ...prev, [key]: value }));
    const { error } = await supabase
      .from("profiles")
      .update({ [key]: value })
      .eq("id", profile.id);

    if (error) {
      console.error(error);
      setPrefs((prev) => ({ ...prev, [key]: !value }));
    } else {
      onUpdateSuccess();
    }
  };

  if (loading) {
    return (
      <Box p={2}>
        <Typography variant="h6" mb={3}>
          Notification Preferences
        </Typography>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width="60%" height={40} />
          <Skeleton variant="rectangular" width="60%" height={40} />
          <Skeleton variant="rectangular" width="60%" height={40} />
        </Stack>
      </Box>
    );
  }
  return (
    <Box p={2}>
      <Typography variant="h6" mb={3}>
        Notification Preferences
      </Typography>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={prefs.notify_won}
              onChange={(e) => handleToggle("notify_won", e.target.checked)}
            />
          }
          label="Email me when a lead is WON"
        />
        <FormControlLabel
          control={
            <Switch
              checked={prefs.notify_new_leads}
              onChange={(e) =>
                handleToggle("notify_new_leads", e.target.checked)
              }
            />
          }
          label="Notify me of new leads"
        />
        <FormControlLabel
          control={
            <Switch
              checked={prefs.weekly_summary}
              onChange={(e) => handleToggle("weekly_summary", e.target.checked)}
            />
          }
          label="Weekly summary report"
        />
      </Stack>
    </Box>
  );
}
