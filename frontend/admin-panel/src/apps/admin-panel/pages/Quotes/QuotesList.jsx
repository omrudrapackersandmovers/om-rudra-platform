import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileSpreadsheet,
  Plus,
  Search,
  MapPin,
  ArrowRight,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  X,
  Edit2,
  Download,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  useGetQuotesQuery,
  useUpdateQuoteStatusMutation,
} from "../../../../store/apiSlices/quotesApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { CardGridSkeleton } from "../../shared/components/Skeleton";
import { exportToCsv } from "../../shared/utils/csvExport";

const QuotesList = () => {
  const { data: quotes = [], isLoading, isFetching, refetch: fetchQuotes } =
    useGetQuotesQuery();
  const { data: dbSettings } = useGetSettingsQuery();
  const companyName = dbSettings?.name || "Om Rudra Packers and Movers";
  const [updateQuoteStatus] = useUpdateQuoteStatusMutation();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpdateStatus = async (quoteId, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await updateQuoteStatus({ id: quoteId, status: newStatus }).unwrap();
    } catch (err) {
      alert("Failed to update status: " + (err.data?.error || err.message));
    }
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchQuotes(),
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

  const filteredQuotes = quotes.filter((q) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      (q.quoteNumber && q.quoteNumber.toLowerCase().includes(s)) ||
      (q.customerName && q.customerName.toLowerCase().includes(s)) ||
      (q.customerPhone && q.customerPhone.includes(s)) ||
      (q.movingFrom && q.movingFrom.toLowerCase().includes(s)) ||
      (q.movingTo && q.movingTo.toLowerCase().includes(s));

    const matchesStatus =
      statusFilter === "all" ? true : q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalQuotes = quotes.length;
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted");
  const acceptedCount = acceptedQuotes.length;
  const sentCount = quotes.filter((q) => q.status === "sent").length;
  const totalAcceptedValue = acceptedQuotes.reduce((acc, q) => acc + (q.totalAmount || 0), 0);
  const totalPipelineValue = quotes.reduce((acc, q) => acc + (q.totalAmount || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Accepted
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            Sent
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
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

  const handleExportCSV = () => {
    const columns = [
      { header: "Quote Number", accessor: (q) => q.quoteNumber || "" },
      { header: "Customer Name", accessor: (q) => q.customerName || "" },
      { header: "Phone", accessor: (q) => q.customerPhone || "" },
      { header: "Moving From", accessor: (q) => q.movingFrom || "" },
      { header: "Moving To", accessor: (q) => q.movingTo || "" },
      { header: "Move Date", accessor: (q) => q.moveDate || "" },
      { header: "Total Amount (INR)", accessor: (q) => q.totalAmount || 0 },
      { header: "Status", accessor: (q) => q.status || "" },
      { header: "Created Date", accessor: (q) => q.createdAt || "" },
    ];
    exportToCsv("quotes_export", columns, filteredQuotes);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Row */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          title="Export filtered quotes to CSV"
        >
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync quotes"
          aria-label="Refresh & sync quotes"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-brand-600 dark:text-brand-300" : ""}`} />
        </button>
        <button
          onClick={() => navigate("/quotes/new")}
          className="flex items-center gap-1.5 sm:gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-brand-500/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Quote</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Quotes</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 sm:mt-2 font-mono">{totalQuotes}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">All estimates created</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Accepted Quotes</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-1 sm:mt-2 font-mono">{acceptedCount}</p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-300 font-medium mt-0.5 truncate">
            {totalQuotes > 0 ? `${Math.round((acceptedCount / totalQuotes) * 100)}% Win Rate` : "0%"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Sent / Pending</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-brand-600 dark:text-brand-300 mt-1 sm:mt-2 font-mono">{sentCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Awaiting approval</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Accepted Value</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 shrink-0">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 sm:mt-2 font-mono truncate">
            ₹{totalAcceptedValue.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
            Pipeline: ₹{totalPipelineValue.toLocaleString("en-IN")}
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
            placeholder="Search by quotation #, customer name, phone, or route..."
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
            { id: "all", label: "All Quotes", count: totalQuotes },
            { id: "sent", label: "Sent / Pending", count: sentCount },
            { id: "accepted", label: "Accepted", count: acceptedCount },
            { id: "rejected", label: "Rejected", count: quotes.filter((q) => q.status === "rejected").length },
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

      {/* Quotations Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No quotations found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No quotations match "${searchQuery}".`
              : 'Click "New Quote" to create an estimate or generate one directly from an inquiry lead.'}
          </p>
          <button
            onClick={() => navigate("/quotes/new")}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Quote</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              onClick={() => navigate(`/quotes/${quote.id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-brand-400 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Row 1: Quote # and Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-800/60 px-2 py-0.5 rounded-md">
                    {quote.quoteNumber}
                  </span>
                  <div className="shrink-0">{getStatusBadge(quote.status)}</div>
                </div>

                {/* Row 2: Customer Name and Phone */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors truncate">
                    {quote.customerName}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>+91 {quote.customerPhone}</span>
                  </div>
                </div>

                {/* Row 3: Route Box */}
                <div className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300 shrink-0" />
                    <span className="truncate">{quote.movingFrom}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-semibold text-brand-950 dark:text-brand-300 truncate">{quote.movingTo}</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Total Estimate and Action Buttons */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Total Estimate</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                    ₹{Number(quote.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {quote.customerPhone && (
                    <a
                      href={`https://wa.me/91${quote.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `*Quotation from ${companyName}*\nQuote No: ${quote.quoteNumber}\nCustomer: ${quote.customerName}\nRoute: ${quote.movingFrom} ➔ ${quote.movingTo}\nTotal Estimate: ₹${Number(quote.totalAmount || 0).toLocaleString("en-IN")}\nStatus: ${quote.status.toUpperCase()}\n\nPlease reply or call to confirm your moving date.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-lg text-[11px] font-semibold transition-colors"
                      title="Share Quote on WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quotes/${quote.id}/edit`);
                    }}
                    className="p-1.5 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950 rounded-lg text-slate-400 transition-colors"
                    title="Edit Quote"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-brand-600 dark:text-brand-300 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-xs">
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

export default QuotesList;
