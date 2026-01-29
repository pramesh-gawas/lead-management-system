"use client";
import dynamic from "next/dynamic";
const LeadForm = dynamic(() => import("@/components/LeadForm"), {
  ssr: false,
});

import LeadList from "@/components/LeadList";
import DashboardStats from "@/components/DashboardStats";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
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
