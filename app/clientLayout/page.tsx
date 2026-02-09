"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LeadDetailDrawer from "@/components/LeadDetailDrawer";
import { LeadProvider } from "@/context/LeadContext";
import { Box } from "@mui/material";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <LeadProvider>
      <Box sx={{ display: "flex" }}>
        {!isAuthPage && <Sidebar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isAuthPage ? 0 : 3,
            width: "100%",
            minHeight: "100vh",
            bgcolor: isAuthPage ? "transparent" : "#f4f7fe",
          }}
        >
          {children}
        </Box>
        {!isAuthPage && <LeadDetailDrawer />}
      </Box>
    </LeadProvider>
  );
}
