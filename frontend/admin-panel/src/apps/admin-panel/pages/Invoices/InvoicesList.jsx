import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Receipt,
  Plus,
  Search,
  IndianRupee,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  X,
  Download,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useGetInvoicesQuery } from "../../../../store/apiSlices/invoicesApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { companyConfig } from "../../../../configs/company.config";
import { CardGridSkeleton } from "../../shared/components/Skeleton";
import { exportToCsv } from "../../shared/utils/csvExport";

const InvoicesList = () => {
  const { data: invoices = [], isLoading, isFetching, refetch: fetchInvoices } =
    useGetInvoicesQuery();
  const { data: dbSettings } = useGetSettingsQuery();
  const companyName = dbSettings?.name || companyConfig?.name || "Om Rudra Packers and Movers";
  const upiId = dbSettings?.upi?.id || dbSettings?.bankDetails?.upiId || companyConfig?.bankDetails?.upiId || "";
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchInvoices(),
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

  const filteredInvoices = invoices.filter((inv) => {
    const s = searchQuery.toLowerCase();
    const matchesQuery =
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(s)) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(s)) ||
      (inv.customerPhone && inv.customerPhone.includes(s)) ||
      (inv.pickupAddress && inv.pickupAddress.toLowerCase().includes(s)) ||
      (inv.deliveryAddress && inv.deliveryAddress.toLowerCase().includes(s));

    const matchesStatus =
      statusFilter === "all" ? true : inv.paymentStatus === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalInvoices = invoices.length;
  const totalInvoicedAmount = invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
  const totalPendingAmount = invoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);
  const totalCollectedAmount = Math.max(0, totalInvoicedAmount - totalPendingAmount);

  const paidCount = invoices.filter((inv) => inv.paymentStatus === "paid").length;
  const unpaidCount = invoices.filter((inv) => inv.paymentStatus === "unpaid").length;
  const partialCount = invoices.filter((inv) => inv.paymentStatus === "partial").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Paid
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Partial Paid
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Unpaid
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
      { header: "Invoice Number", accessor: (inv) => inv.invoiceNumber || "" },
      { header: "Customer Name", accessor: (inv) => inv.customerName || "" },
      { header: "Phone", accessor: (inv) => inv.customerPhone || "" },
      { header: "Pickup Address", accessor: (inv) => inv.pickupAddress || "" },
      { header: "Delivery Address", accessor: (inv) => inv.deliveryAddress || "" },
      { header: "Total Amount (INR)", accessor: (inv) => inv.totalAmount || 0 },
      {
        header: "Paid Amount (INR)",
        accessor: (inv) =>
          inv.paidAmount !== undefined
            ? inv.paidAmount
            : Math.max(0, (Number(inv.totalAmount) || 0) - (Number(inv.balanceDue) || 0)),
      },
      { header: "Balance Due (INR)", accessor: (inv) => inv.balanceDue || 0 },
      { header: "Payment Status", accessor: (inv) => inv.paymentStatus || "" },
      { header: "Created Date", accessor: (inv) => inv.createdAt || "" },
    ];
    exportToCsv("invoices_export", columns, filteredInvoices);
  };

  return (
    <div className="space-y-6">
      {/* Action Row */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          title="Export filtered invoices to CSV"
        >
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync invoices"
          aria-label="Refresh & sync invoices"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-brand-600 dark:text-brand-300" : ""}`} />
        </button>
        <button
          onClick={() => navigate("/invoices/new")}
          className="flex items-center gap-1.5 sm:gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-brand-500/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Bill</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Invoiced</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
              <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono truncate">
            ₹{totalInvoicedAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{totalInvoices} total bills</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Collected (Paid)</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 shrink-0">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-2 font-mono truncate">
            ₹{totalCollectedAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-300 font-medium mt-0.5 truncate">
            {totalInvoicedAmount > 0
              ? `${Math.round((totalCollectedAmount / totalInvoicedAmount) * 100)}% realization`
              : "0%"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Pending Balance</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-300 mt-2 font-mono truncate">
            ₹{totalPendingAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] sm:text-[11px] text-rose-500 font-medium mt-0.5 truncate">Outstanding collection</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Payment Status</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2 truncate">
            <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-300 font-mono">{paidCount}</p>
            <span className="text-[11px] sm:text-xs text-slate-400">/ {unpaidCount} unpaid</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{partialCount} partially settled</p>
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
            placeholder="Search by invoice #, customer name, phone, or route..."
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
            { id: "all", label: "All Bills", count: totalInvoices },
            { id: "unpaid", label: "Unpaid", count: unpaidCount },
            { id: "partial", label: "Partial Paid", count: partialCount },
            { id: "paid", label: "Fully Paid", count: paidCount },
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

      {/* Invoices Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No invoices found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No invoices match "${searchQuery}".`
              : 'Tap "New Bill" or generate a tax invoice directly from an active job.'}
          </p>
          <button
            onClick={() => navigate("/invoices/new")}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Tax Invoice</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => navigate(`/invoices/${inv.id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-brand-400 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Row 1: Invoice # and Payment Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200/60 dark:border-brand-800/60 px-2 py-0.5 rounded-md">
                    {inv.invoiceNumber}
                  </span>
                  <div className="shrink-0">{getStatusBadge(inv.paymentStatus)}</div>
                </div>

                {/* Row 2: Customer Name and Phone */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors truncate">
                    {inv.customerName}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>+91 {inv.customerPhone}</span>
                  </div>
                </div>

                {/* Row 3: Paid & Balance Due Box */}
                {(() => {
                  const paid = Number(
                    inv.paidAmount !== undefined
                      ? inv.paidAmount
                      : Math.max(0, (Number(inv.totalAmount) || 0) - (Number(inv.balanceDue) || 0))
                  );
                  const due = Number(inv.balanceDue !== undefined ? inv.balanceDue : Math.max(0, (Number(inv.totalAmount) || 0) - paid));
                  return (
                    <div className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <span>
                          Paid: <strong className="text-emerald-700 dark:text-emerald-300 font-mono font-bold">₹{paid.toLocaleString("en-IN")}</strong>
                        </span>
                        <span className={due > 0 ? "font-bold text-rose-600 dark:text-rose-300 font-mono" : "font-medium text-slate-500 dark:text-slate-400 font-mono"}>
                          Balance Due: ₹{due.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Row 4: Total Amount and Action Buttons */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Total Billed</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                    ₹{Number(inv.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {inv.customerPhone && (
                    <a
                      href={`https://wa.me/91${inv.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `*Tax Invoice from ${companyName}*\nInvoice No: ${inv.invoiceNumber}\nCustomer: ${inv.customerName}\nTotal: ₹${Number(inv.totalAmount || 0).toLocaleString("en-IN")}\n*Balance Due: ₹${Number(inv.balanceDue || 0).toLocaleString("en-IN")}*\nStatus: ${(inv.paymentStatus || "UNPAID").toUpperCase()}${upiId ? `\n\nPay via UPI: ${upiId}` : ""}\n\nThank you for choosing ${companyName}!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-lg text-[11px] font-semibold transition-colors"
                      title="Share Invoice on WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <span className="text-brand-600 dark:text-brand-300 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-xs">
                    <span>View Bill</span>
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

export default InvoicesList;
