import React from "react";
import { Lead } from "@/types/lead";

const statusStyles: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-900">Name</th>
            <th className="px-4 py-3 font-semibold text-gray-900">Company</th>
            <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-900">Value</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{lead.name}</p>
                <p className="text-gray-500 text-xs">{lead.email}</p>
              </td>
              <td className="px-4 py-3 text-gray-700">{lead.company}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[lead.status]}`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700 font-mono">
                ${lead.value.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
