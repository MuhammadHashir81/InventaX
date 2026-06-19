import { useState } from "react";
import {
  FiGrid,
  FiUsers,
  FiCreditCard,
  FiActivity,
  FiList,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiDollarSign,
  FiUserCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export const AuditSection = () => {

    const AUDIT_LOGS = [
  { id: 1, actor: "john@acme.com", action: "Created invoice #INV-0042", tenant: "Acme Corp", time: "2 min ago", level: "info" },
  { id: 2, actor: "System", action: "Subscription payment failed", tenant: "Pixel Hub", time: "1 hr ago", level: "error" },
  { id: 3, actor: "sara@nova.io", action: "Added product 'Widget Pro'", tenant: "Nova Ltd", time: "3 hr ago", level: "info" },
  { id: 4, actor: "System", action: "Subscription canceled", tenant: "Stackify", time: "5 hr ago", level: "warn" },
  { id: 5, actor: "emma@bright.com", action: "Invited 3 new users", tenant: "BrightPath", time: "1 day ago", level: "info" },
  { id: 6, actor: "System", action: "Webhook delivered: invoice.paid", tenant: "Acme Corp", time: "1 day ago", level: "info" },
  { id: 7, actor: "mike@pixel.co", action: "Login from new device", tenant: "Pixel Hub", time: "2 days ago", level: "warn" },
];


const AuditIcon = ({ level }) => {
  if (level === "error") return <FiXCircle className="text-red-500 mt-0.5 shrink-0" />;
  if (level === "warn") return <FiAlertCircle className="text-amber-500 mt-0.5 shrink-0" />;
  return <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />;
};

  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? AUDIT_LOGS : AUDIT_LOGS.filter((l) => l.level === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Audit Logs</h2>
          <p className="text-sm text-gray-500 mt-0.5">System-wide activity feed</p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "info", "warn", "error"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition ${filter === f
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {filtered.map((log) => (
          <div key={log.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
            <AuditIcon level={log.level} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 font-medium">{log.action}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="text-gray-500">{log.actor}</span> · {log.tenant}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
              <FiClock className="text-xs" />
              {log.time}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">No logs for this filter.</p>
        )}
      </div>
    </div>
  );
};
