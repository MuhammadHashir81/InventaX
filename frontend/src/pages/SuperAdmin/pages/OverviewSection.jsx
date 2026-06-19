

import { useState, useEffect } from "react";
import { api } from "../../../../api/api";
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


const PlanBadge = ({ plan }) => {
  const map = {
    free_trial: "bg-blue-50 text-blue-600",
    pro: "bg-violet-50 text-violet-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${map[plan] || "bg-gray-100 text-gray-500"}`}>
      {plan}
    </span>
  );
};

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



export const OverviewSection = () => {
  const [tenants, setTenants] = useState([])
  const [totalTenants, setTotalTenants] = useState(0)
  const [activeSubscribers, setActiveSubscribers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [monthlyRevenue,setMonthlyRevenue] = useState(0)
  const [totalPages,setTotalPages] = useState(0)
  const [page,setPage] = useState(1)
  


  // fetch all tenants

  
  const formatDate = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const fetchAllTenants = async (limit=10) => {
    try {
      const response = await api.get(`/api/super-admin/get-all-tenants?page=${page}&limit=${limit}`)
      console.log(response)
      setTotalTenants(response.totalTenants)
      setActiveSubscribers(response.activeSubscribers)
      setTenants(response.tenantSnapshot)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchRevenue = async () => {
    try {
      const response = await api.get('/api/super-admin/get-revenue')
      console.log(response)
      setMonthlyRevenue(response.monthlyRevenue)
      setTotalRevenue(response.totalRevenue)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllTenants()
  }, [page])


  useEffect(() => {
    fetchRevenue()
  }, [])



  const stats = [
    { label: "Total Tenants", value: totalTenants, icon: <FiUsers />, color: "text-blue-600 bg-blue-50" },
    { label: "Active Subscriptions", value: activeSubscribers, icon: <FiCheckCircle />, color: "text-emerald-600 bg-emerald-50" },
    { label: "Monthly Revenue", value: monthlyRevenue, icon: <FiDollarSign />, color: "text-violet-600 bg-violet-50" },
    { label: "Total Revenue", value: totalRevenue, icon: <FiDollarSign />, color: "text-indigo-600 bg-indigo-50" },
  ];

  // handle next page
  const handleNextPage = () => {
    setPage((prev) => prev + 1 )
      console.log(page)

  }


  // handle previous page

  const handlePreviousPage = () => {
      setPage((prev) => prev - 1)
      console.log(page)
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">System Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">Platform-wide metrics at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-lg text-lg ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick snapshot table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-700 text-sm">Tenant Snapshot</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
              <th className="text-left px-5 py-3">Tenant</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Users</th>
              <th className="text-left px-5 py-3">start date</th>
              <th className="text-left px-5 py-3">end date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenants.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-700">{t.username}</td>
                <td className="px-5 py-3"><PlanBadge plan={t.subscription.plan} /></td>
                <td className="px-5 py-3"><StatusBadge status={t.subscription.status} /></td>
                <td className="px-5 py-3 text-gray-500">{t.customerCount}</td>
                <td className="px-5 py-3 text-gray-500">
                    {formatDate(t.subscription.currentPeriodStart ? t.subscription.currentPeriodStart : t.subscription.trialStartDate)}
                    </td>
                <td className="px-5 py-3 text-gray-500">
                    { formatDate(t.subscription.currentPeriodEnd ? t.subscription.currentPeriodEnd :t.subscription.trialEndDate)  }

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* button div */}
      <div className={`flex gap-2 items-center `}>
              <button disabled={page === 1} onClick={handlePreviousPage} className=' border-1 border-gray-100  rounded-sm px-4 py-1 cursor-pointer hover:bg-gray-50'>previous</button>
              <p> page {page} of {totalPages} </p>
              <button disabled={page === totalPages} onClick={handleNextPage} className=' border-1 border-gray-100  rounded-sm px-4 py-1 cursor-pointer hover:bg-gray-50'>next</button>
            </div>
    </div>
  );
};
