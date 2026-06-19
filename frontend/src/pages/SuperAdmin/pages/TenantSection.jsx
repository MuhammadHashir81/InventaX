// ─── Section: Tenants ─────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { api } from "../../../../api/api";

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
export const TenantsSection = () => {

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [tenants, setTenants] = useState([])
    const [page, setPage] = useState(1)
    const [totalTenants, setTotalTenants] = useState(0)

        const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('chaning')
            setDebouncedSearch(search)
            setPage(1)
        }, 1000);
        return () => clearTimeout(timer); 


    }, [search])


    const fetchAllTenants = async (limit = 10) => {
        try {
            const response = await api.get(`/api/super-admin/get-all-tenants?page=${page}&limit=${limit}&search=${debouncedSearch}`)
            console.log(response)
            setTenants(response.tenantSnapshot)
            setTotalPages(response.totalPages)
            setTotalTenants(response.totalTenants)
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        fetchAllTenants()
    }, [page, debouncedSearch])



    // handle next page
    const handleNextPage = () => {
        setPage((prev) => prev + 1)
        console.log(page)

    }


    // handle previous page

    const handlePreviousPage = () => {
        setPage((prev) => prev - 1)
        console.log(page)
    }




    const formatDate = (ts) => {
        if (!ts) return '—'
        return new Date(ts).toLocaleDateString('en-PK', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }


    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">All Tenants</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{totalTenants} registered tenants</p>
                </div>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search tenants…"
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
                            <th className="text-left px-5 py-3">Owner</th>
                            <th className="text-left px-5 py-3">Plan</th>
                            <th className="text-left px-5 py-3">Status</th>
                            <th className="text-left px-5 py-3">Users</th>
                            <th className="text-left px-5 py-3">Joined</th>
                            <th className="text-left px-5 py-3">Expired</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tenants.map((t) => (
                            <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 text-gray-500">{t.username}</td>
                                <td className="px-5 py-3"><PlanBadge plan={t.subscription.plan} /></td>
                                <td className="px-5 py-3"><StatusBadge status={t.subscription.status} /></td>
                                <td className="px-5 py-3 text-gray-500">{t.customerCount}</td>
                                <td className="px-5 py-3 text-gray-400">
                                    {formatDate(t.subscription.currentPeriodStart ? t.subscription.currentPeriodStart : t.subscription.trialStartDate)}
                                </td>

                                <td className="px-5 py-3 text-gray-500">
                                    {formatDate(t.subscription.currentPeriodEnd ? t.subscription.currentPeriodEnd : t.subscription.trialEndDate)}

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