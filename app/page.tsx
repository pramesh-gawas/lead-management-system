"use client";
import DashboardStats from "@/components/DashboardStats";
import LeadForm from "@/components/LeadForm";
import LeadList from "@/components/LeadList";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          CRM Dashboard
        </h1>
        <p className="text-slate-500">
          Manage your sales pipeline and track prospects.
        </p>
      </header>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <LeadForm />
        </div>
        <div className="lg:col-span-2">
          <LeadList />
        </div>
      </div>
    </div>
  );
}
