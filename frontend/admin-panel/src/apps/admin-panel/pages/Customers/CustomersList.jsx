import { useState } from "react";
import { Link } from "react-router";
import { Users, User, Search, X, RotateCcw, Phone, Mail, Copy, Check, TrendingUp, ArrowRight } from "lucide-react";
import { useGetLeadsQuery } from "../../../../store/apiSlices/leadsApiSlice";

const panel = "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs";

export default function CustomersList({ customers, search, setSearch, refetch, isFetching }) {
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState("all");
  const active = useGetLeadsQuery("all");
  const deleted = useGetLeadsQuery("deleted");
  const counts = new Map();
  for (const lead of [...(active.data || []), ...(deleted.data || [])]) {
    if (lead.customerId) counts.set(lead.customerId, (counts.get(lead.customerId) || 0) + 1);
  }
  const repeatCount = customers.filter(c => (counts.get(c.id) || 0) > 1).length;
  const filtered = customers.filter(c =>
    `${c.name} ${c.phone} ${c.email || ""}`.toLowerCase().includes(search.trim().toLowerCase()) &&
    (filter !== "repeat" || (counts.get(c.id) || 0) > 1)
  );
  async function copyPhone(customer) {
    try { await navigator.clipboard.writeText(customer.phone); setCopied(customer.id); }
    catch { setCopied(null); }
  }
  function refresh() { refetch(); active.refetch(); deleted.refetch(); }
  const refreshing = isFetching || active.isFetching || deleted.isFetching;

  return <div className="space-y-4 sm:space-y-6">
    <div className="flex items-center justify-end gap-2">
      <button onClick={refresh} disabled={refreshing} aria-label="Refresh customers" title="Refresh customers" className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-brand-600 transition-colors disabled:opacity-50">
        <RotateCcw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
      {[["Total Customers", customers.length, "Customer profiles", Users], ["Repeat Customers", repeatCount, "More than one enquiry", TrendingUp]].map(([label, value, hint, Icon]) =>
        <div key={label} className={`${panel} p-3.5 sm:p-4`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300"><Icon className="w-4 h-4" /></span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 sm:mt-2 font-mono">{label === "Repeat Customers" && (active.isLoading || deleted.isLoading || active.error || deleted.error) ? "—" : value}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{hint}</p>
        </div>
      )}
    </div>

    <div className={`${panel} p-3.5 sm:p-4 space-y-3`}>
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input aria-label="Search customers" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer name, phone number, or email..." className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900 transition-all" />
        {search && <button onClick={() => setSearch("")} aria-label="Clear customer search" className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>}
      </div>
      <div className="flex items-center gap-1.5">
        {[["all", "All Customers", customers.length], ["repeat", "Repeat", repeatCount]].map(([value, label, count]) => <button key={value} disabled={value === "repeat" && (active.isLoading || deleted.isLoading || !!active.error || !!deleted.error)} onClick={() => setFilter(value)} className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50 ${filter === value ? "bg-brand-600 text-white border-brand-600 shadow-xs" : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
          {label}<span className="rounded-md px-1.5 py-0.5 bg-black/5 dark:bg-white/10 font-mono">{count}</span>
        </button>)}
      </div>
    </div>

    {!filtered.length ? <div className={`${panel} text-center py-12 px-4`}>
      <Users className="w-8 h-8 mx-auto text-slate-400 mb-3" />
      <h2 className="font-bold text-slate-900 dark:text-slate-100">{search || filter === "repeat" ? "No matching customers" : "No customers yet"}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{search || filter === "repeat" ? "Try another search or switch to All Customers." : "Customer profiles appear when enquiries are received or logged."}</p>
    </div> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map(customer => <article key={customer.id} className={`${panel} p-4 sm:p-5 hover:shadow-md hover:border-brand-400 transition-all flex flex-col justify-between space-y-3.5 group`}>
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-800/60 px-2 py-0.5 rounded-md">Customer #{customer.id}</span>
            {(counts.get(customer.id) || 0) > 1 && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">Repeat customer</span>}
          </div>
          <h2 className="mt-2 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug break-words group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{customer.name}</h2>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-600 dark:text-slate-300">
            <Phone className="w-3 h-3 text-slate-400" /><span className="font-mono font-medium">{customer.phone}</span>
            <button onClick={() => copyPhone(customer)} aria-label={`Copy ${customer.name}'s phone number`} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5">{copied === customer.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}</button>
          </div>
          {customer.email && <a href={`mailto:${customer.email}`} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 mt-1"><Mail className="w-3 h-3 shrink-0" /><span className="truncate">{customer.email}</span></a>}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><User className="w-3.5 h-3.5" />{active.isLoading || deleted.isLoading || active.error || deleted.error ? "Enquiry history available in profile" : `${counts.get(customer.id) || 0} enquiries in history`}</div>
          {customer.notes && <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 bg-amber-50/80 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-800/60 p-2.5 rounded-xl line-clamp-2"><span className="font-semibold text-amber-800 dark:text-amber-300">Note: </span>{customer.notes}</p>}
        </div>
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link to={`/customers/${customer.id}`} className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"><TrendingUp className="w-3.5 h-3.5 text-brand-400" />View Customer Profile & History<ArrowRight className="w-3.5 h-3.5" /></Link>
          <a href={`tel:${customer.phone}`} className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-200/60 dark:border-emerald-800/60"><Phone className="w-3.5 h-3.5" />Call Customer</a>
        </div>
      </article>)}
    </div>}
  </div>;
}
