
// ─── Section: Subscriptions ───────────────────────────────────────────────────

  const SUBSCRIPTIONS = [
  { id: 1, tenant: "Acme Corp", plan: "Pro", amount: "$49/mo", status: "active", nextBilling: "2026-07-10", stripeId: "sub_1Abc" },
  { id: 2, tenant: "Nova Ltd", plan: "Free", amount: "$19/mo", status: "active", nextBilling: "2026-07-18", stripeId: "sub_2Def" },
  { id: 3, tenant: "Pixel Hub", plan: "Pro", amount: "$49/mo", status: "past_due", nextBilling: "2026-06-22", stripeId: "sub_3Ghi" },
  { id: 4, tenant: "BrightPath", plan: "Free", amount: "$199/mo", status: "active", nextBilling: "2026-07-11", stripeId: "sub_4Jkl" },
  { id: 5, tenant: "Stackify", plan: "Pro", amount: "$19/mo", status: "canceled", nextBilling: "—", stripeId: "sub_5Mno" },
];

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
export const SubscriptionsSection = () => (
  

  <div className="space-y-5">
    <div>
      <h2 className="text-lg font-semibold text-gray-800">Subscription & Billing</h2>
      <p className="text-sm text-gray-500 mt-0.5">All active and historical Stripe subscriptions</p>
    </div>

    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
            <th className="text-left px-5 py-3">Tenant</th>
            <th className="text-left px-5 py-3">Plan</th>
            <th className="text-left px-5 py-3">Amount</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Next Billing</th>
            <th className="text-left px-5 py-3">Stripe ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {SUBSCRIPTIONS.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 font-medium text-gray-800">{s.tenant}</td>
              <td className="px-5 py-3"><PlanBadge plan={s.plan} /></td>
              <td className="px-5 py-3 font-semibold text-gray-700">{s.amount}</td>
              <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
              <td className="px-5 py-3 text-gray-500">{s.nextBilling}</td>
              <td className="px-5 py-3 font-mono text-xs text-gray-400">{s.stripeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
