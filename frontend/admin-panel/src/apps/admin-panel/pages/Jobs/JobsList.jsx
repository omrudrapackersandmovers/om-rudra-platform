import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Truck,
  Calendar,
  MapPin,
  ArrowRight,
  Phone,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  X,
} from "lucide-react";
import { useGetJobsQuery } from "../../../../store/apiSlices/jobsApiSlice";
import { CardGridSkeleton } from "../../shared/components/Skeleton";

const JobsList = () => {
  const { data: jobs = [], isLoading, isFetching, refetch: fetchJobs } =
    useGetJobsQuery();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchJobs(),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "Date TBD";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime())
        ? (dateStr.length > 20 ? "Date TBD" : dateStr)
        : d.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
    } catch {
      return dateStr;
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const s = searchQuery.toLowerCase();
    const matchesQuery =
      (j.jobNumber && j.jobNumber.toLowerCase().includes(s)) ||
      (j.customerName && j.customerName.toLowerCase().includes(s)) ||
      (j.customerPhone && j.customerPhone.includes(s)) ||
      (j.pickupAddress && j.pickupAddress.toLowerCase().includes(s)) ||
      (j.deliveryAddress && j.deliveryAddress.toLowerCase().includes(s));

    const matchesStatus =
      statusFilter === "all" ? true : j.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalJobs = jobs.length;
  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const scheduledCount = jobs.filter((j) => j.status === "scheduled").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            Scheduled
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            In Transit
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Row */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync jobs"
          aria-label="Refresh & sync jobs"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-brand-600 dark:text-brand-300" : ""}`} />
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Moves</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono truncate">{totalJobs}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">All confirmed relocations</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">In Transit</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-300 mt-2 font-mono truncate">{inProgressCount}</p>
          <p className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-300 font-medium mt-0.5 truncate">Vehicles on road</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Scheduled</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-brand-600 dark:text-brand-300 mt-2 font-mono truncate">{scheduledCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Upcoming move dates</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Delivered</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-2 font-mono truncate">{completedCount}</p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-300 font-medium mt-0.5 truncate">
            {totalJobs > 0 ? `${Math.round((completedCount / totalJobs) * 100)}% Fulfilled` : "0%"}
          </p>
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
            placeholder="Search by job #, customer name, phone, or route..."
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
            { id: "all", label: "All Jobs", count: totalJobs },
            { id: "scheduled", label: "Scheduled", count: scheduledCount },
            { id: "in_progress", label: "In Transit", count: inProgressCount },
            { id: "completed", label: "Completed", count: completedCount },
            { id: "cancelled", label: "Cancelled", count: jobs.filter((j) => j.status === "cancelled").length },
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

      {/* Jobs Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No active jobs found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No moves match "${searchQuery}".`
              : "When a customer accepts a quotation, convert it into an active job to schedule dispatch."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-brand-400 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Row 1: Job # and Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-800/60 px-2 py-0.5 rounded-md">
                    {job.jobNumber}
                  </span>
                  <div className="shrink-0">{getStatusBadge(job.status)}</div>
                </div>

                {/* Row 2: Customer Name and Phone */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors truncate">
                    {job.customerName}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>+91 {job.customerPhone}</span>
                  </div>
                </div>

                {/* Row 3: Route Box */}
                <div className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300 shrink-0" />
                    <span className="truncate">{job.pickupAddress}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-semibold text-brand-950 dark:text-brand-300 truncate">{job.deliveryAddress}</span>
                  </div>
                </div>

                {/* Row 4: Schedule and Truck Info */}
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/50 rounded-lg px-2.5 py-1.5 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{formatDate(job.scheduledDate || job.movingDate)}</span>
                  </span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                    {job.vehicleAssigned ? `🚛 ${job.vehicleAssigned}` : "Truck pending"}
                  </span>
                </div>
              </div>

              {/* Row 5: Driver and Manage CTA */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] truncate max-w-[150px] sm:max-w-none">
                  Driver: <span className="font-medium text-slate-800 dark:text-slate-100">{job.driverName || "Unassigned"}</span>
                </span>
                <span className="text-brand-600 dark:text-brand-300 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-xs">
                  <span>Manage Job</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsList;
