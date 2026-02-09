import { ReactNode } from "react";
import ClientLayout from "./clientLayout/page";

export const metadata = {
  title: "My CRM",
  description: "Lead Management System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
