import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Plus,
  Search,
  MapPin,
  ArrowRight,
  Truck,
  RotateCcw,
  CheckCircle,
  Package,
  IndianRupee,
  X,
} from "lucide-react";
import { useGetBiltiesQuery } from "../../../../store/apiSlices/biltiesApiSlice";
import { CardGridSkeleton } from "../../shared/components/Skeleton";

const BiltiesList = () => {
  const { data: bilties = [], isLoading, isFetching, refetch: fetchBilties } =
    useGetBiltiesQuery();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchBilties(),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "-";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime())
        ? (dateStr.length > 20 ? "-" : dateStr)
        : d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    } catch {
      return "-";
    }
  };

  const filteredBilties = bilties.filter((bilty) => {
    const s = searchQuery.toLowerCase();
    const matchesQuery =
      (bilty.lrNumber && bilty.lrNumber.toLowerCase().includes(s)) ||
      (bilty.truckNumber && bilty.truckNumber.toLowerCase().includes(s)) ||
      (bilty.driverName && bilty.driverName.toLowerCase().includes(s)) ||
      (bilty.consignorName && bilty.consignorName.toLowerCase().includes(s)) ||
      (bilty.consigneeName && bilty.consigneeName.toLowerCase().includes(s)) ||
      (bilty.fromCity && bilty.fromCity.toLowerCase().includes(s)) ||
      (bilty.toCity && bilty.toCity.toLowerCase().includes(s));

    const matchesStatus =
      statusFilter === "all" ? true : bilty.freightStatus === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalBilties = bilties.length;
  const totalFreight = bilties.reduce((acc, b) => acc + (b.freightAmount || 0), 0);
  const totalPackages = bilties.reduce((acc, b) => acc + (Number(b.packagesCount) || 0), 0);
  const paidBilties = bilties.filter((b) => b.freightStatus === "paid").length;
  const toPayBilties = bilties.filter((b) => b.freightStatus === "to_pay").length;

  return (
    <div className="space-y-6">
      {/* Action Row */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync consignment notes"
          aria-label="Refresh & sync consignment notes"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-brand-600 dark:text-brand-300" : ""}`} />
        </button>
        <button
          onClick={() => navigate("/bilties/new")}
          className="flex items-center gap-1.5 sm:gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-brand-500/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Bilty (LR)</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Consignments</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono truncate">{totalBilties}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Official road permits</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Freight</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 shrink-0">
              <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono truncate">
            ₹{totalFreight.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{paidBilties} paid / {toPayBilties} To-Pay</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Packages Manifest</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-brand-600 dark:text-brand-300 mt-2 font-mono truncate">{totalPackages}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Total cartons moved</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Truck Fleet</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-purple-600 dark:text-purple-300 mt-2 font-mono truncate">
            {new Set(bilties.map((b) => b.truckNumber)).size}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Unique vehicles dispatched</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by LR #, truck #, sender, or destination city..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: "All LRs", count: totalBilties },
            { id: "paid", label: "Freight Paid", count: paidBilties },
            { id: "to_pay", label: "To Pay (Delivery)", count: toPayBilties },
            { id: "billed", label: "Billed to Account", count: bilties.filter((b) => b.freightStatus === "billed").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                statusFilter === tab.id
                  ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 border-slate-200/70 dark:border-slate-700/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                  statusFilter === tab.id
                    ? "bg-white/20 dark:bg-slate-900/20 text-white"
                    : "bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bilties Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredBilties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No consignment notes found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No LRs match "${searchQuery}".`
              : "Generate an official Lorry Receipt for your trucks before highway dispatch."}
          </p>
          <button
            onClick={() => navigate("/bilties/new")}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Lorry Receipt</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBilties.map((bilty) => (
            <div
              key={bilty.id}
              onClick={() => navigate(`/bilties/${bilty.id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-brand-400 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Row 1: LR Number and Freight Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-800/60 px-2 py-0.5 rounded-md">
                    {bilty.lrNumber}
                  </span>
                  <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {bilty.freightStatus}
                  </span>
                </div>

                {/* Row 2: Consignor to Consignee */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors flex items-center gap-1.5 flex-wrap">
                    <span className="truncate">{bilty.consignorName}</span>
                    <span className="text-slate-400 font-normal">➔</span>
                    <span className="text-brand-900 dark:text-brand-300 truncate">{bilty.consigneeName}</span>
                  </h3>
                </div>

                {/* Row 3: Route Box and Package Count */}
                <div className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300 shrink-0" />
                    <span className="truncate">{bilty.fromCity}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-bold text-brand-900 dark:text-brand-300 truncate">{bilty.toCity}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/70 dark:border-slate-700/70 font-semibold">
                    {bilty.packagesCount} pkgs
                  </span>
                </div>

                {/* Row 4: Dedicated Truck and Driver Row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/50 rounded-lg px-2.5 py-1.5 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-400">🚛 Truck:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 font-mono uppercase">{bilty.truckNumber || "N/A"}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-slate-400">👤 Driver:</span>
                    <span className="text-slate-800 dark:text-slate-100 font-medium truncate max-w-[140px] sm:max-w-none">{bilty.driverName || "N/A"}</span>
                  </span>
                </div>
              </div>

              {/* Row 5: Freight Amount and View Consignment CTA */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Freight Amount</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                    ₹{Number(bilty.freightAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {formatDate(bilty.createdAt)}
                  </span>
                  <span className="text-brand-600 dark:text-brand-300 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-xs">
                    <span>View Consignment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BiltiesList;
