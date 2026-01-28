import { LEAD_STATUS, LeadStatus } from "@/types/lead";

const STATUS_COLORS: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW]: "bg-blue-100 text-blue-700 border-blue-200",
  [LEAD_STATUS.CONTACTED]: "bg-purple-100 text-purple-700 border-purple-200",
  [LEAD_STATUS.QUALIFIED]: "bg-orange-100 text-orange-700 border-orange-200",
  [LEAD_STATUS.PROPOSAL]: "bg-indigo-100 text-indigo-700 border-indigo-200",
  [LEAD_STATUS.WON]: "bg-green-100 text-green-700 border-green-200",
  [LEAD_STATUS.LOST]: "bg-gray-100 text-gray-700 border-gray-200",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold border ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}
