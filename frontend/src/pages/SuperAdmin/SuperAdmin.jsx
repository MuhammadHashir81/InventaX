import React, { useState } from "react";
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
import { IoIosLogOut } from "react-icons/io";
import { api } from "../../../api/api";
import { NavLink, Outlet } from "react-router-dom";

// ─── Mock Data ────────────────────────────────────────────────────────────────


const TENANTS = [
  { id: 1, name: "Acme Corp", owner: "john@acme.com", plan: "Pro", status: "active", users: 14, joined: "2024-11-03" },
  { id: 2, name: "Nova Ltd", owner: "sara@nova.io", plan: "Free", status: "active", users: 3, joined: "2025-01-18" },
  { id: 3, name: "Pixel Hub", owner: "mike@pixel.co", plan: "Pro", status: "suspended", users: 8, joined: "2024-09-22" },
  { id: 4, name: "BrightPath", owner: "emma@bright.com", plan: "Free", status: "active", users: 42, joined: "2024-07-11" },
  { id: 5, name: "Stackify", owner: "dev@stackify.io", plan: "Pro", status: "expired", users: 2, joined: "2025-03-01" },
];

const SUBSCRIPTIONS = [
    { id: 1, tenant: "Acme Corp", plan: "Pro", amount: "$49/mo", status: "active", nextBilling: "2026-07-10", stripeId: "sub_1Abc" },
    { id: 2, tenant: "Nova Ltd", plan: "Free", amount: "$19/mo", status: "active", nextBilling: "2026-07-18", stripeId: "sub_2Def" },
    { id: 3, tenant: "Pixel Hub", plan: "Pro", amount: "$49/mo", status: "past_due", nextBilling: "2026-06-22", stripeId: "sub_3Ghi" },
    { id: 4, tenant: "BrightPath", plan: "Free", amount: "$199/mo", status: "active", nextBilling: "2026-07-11", stripeId: "sub_4Jkl" },
    { id: 5, tenant: "Stackify", plan: "Pro", amount: "$19/mo", status: "canceled", nextBilling: "—", stripeId: "sub_5Mno" },
  ];

const AUDIT_LOGS = [
  { id: 1, actor: "john@acme.com", action: "Created invoice #INV-0042", tenant: "Acme Corp", time: "2 min ago", level: "info" },
  { id: 2, actor: "System", action: "Subscription payment failed", tenant: "Pixel Hub", time: "1 hr ago", level: "error" },
  { id: 3, actor: "sara@nova.io", action: "Added product 'Widget Pro'", tenant: "Nova Ltd", time: "3 hr ago", level: "info" },
  { id: 4, actor: "System", action: "Subscription canceled", tenant: "Stackify", time: "5 hr ago", level: "warn" },
  { id: 5, actor: "emma@bright.com", action: "Invited 3 new users", tenant: "BrightPath", time: "1 day ago", level: "info" },
  { id: 6, actor: "System", action: "Webhook delivered: invoice.paid", tenant: "Acme Corp", time: "1 day ago", level: "info" },
  { id: 7, actor: "mike@pixel.co", action: "Login from new device", tenant: "Pixel Hub", time: "2 days ago", level: "warn" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    suspended: "bg-amber-50 text-amber-700 border border-amber-200",
    expired: "bg-gray-100 text-gray-500 border border-gray-200",
    past_due: "bg-red-50 text-red-600 border border-red-200",
    canceled: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || map.expired}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const PlanBadge = ({ plan }) => {
  const map = {
    Free: "bg-blue-50 text-blue-600",
    Pro: "bg-violet-50 text-violet-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${map[plan] || "bg-gray-100 text-gray-500"}`}>
      {plan}
    </span>
  );
};

const AuditIcon = ({ level }) => {
  if (level === "error") return <FiXCircle className="text-red-500 mt-0.5 shrink-0" />;
  if (level === "warn") return <FiAlertCircle className="text-amber-500 mt-0.5 shrink-0" />;
  return <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />;
};


const NAV = [
  { key: "overview", link:'/super-admin', label: "Overview", icon: <FiGrid /> },
  { key: "tenants", link:'/super-admin/tenants', label: "Tenants", icon: <FiUsers /> },
  { key: "subscriptions", link:'/super-admin/subscriptions', label: "Subscriptions", icon: <FiCreditCard /> },
  { key: "audit", link:'/super-admin/audits' ,label: "Audit Logs", icon: <FiList /> },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const SuperAdmin = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  
  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside
        className={`${collapsed ? "w-[70px]" : "w-[240px]"
          } shrink-0 h-screen sticky top-0 bg-gray-900 text-white flex flex-col transition-all duration-200 overflow-hidden`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-[64px] border-b border-gray-800">
          {collapsed ? (
            <span className="text-xl font-bold text-blue-400">X</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-400">InventaX</span>
              <span className="text-[10px] bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded font-semibold tracking-wide">
                SUPER
              </span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
            key={item.key}
            to={item.link}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeSection === item.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: logout + collapse */}
        <div className="px-3 pb-5 space-y-2 border-t border-gray-800 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <IoIosLogOut className="text-base shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors text-sm"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 h-[64px] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Super Admin</p>
            <h1 className="text-sm font-semibold text-gray-700 capitalize">{activeSection}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <FiUserCheck className="text-blue-500" />
            <span>superadmin@inventax.io</span>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          <Outlet/>
        </div>
        
      </main>

    </div>
  );
};

export default SuperAdmin;