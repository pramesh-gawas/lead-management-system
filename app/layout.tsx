"use client";
import LeadDetailDrawer from "@/components/LeadDetailDrawer";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { LeadProvider } from "@/context/LeadContext";
import { Box, CssBaseline } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return (
    <html lang="en">
      <body>
        <LeadProvider>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {!isLoginPage && <Sidebar />}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
              {children}
            </Box>
            {!isLoginPage && <LeadDetailDrawer />}
          </Box>
        </LeadProvider>
      </body>
    </html>
  );
}
