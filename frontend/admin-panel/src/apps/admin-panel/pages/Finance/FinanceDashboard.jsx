import React, { useState } from "react";
import { Link } from "react-router";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  RotateCcw,
  Truck,
  ExternalLink,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  useGetFinanceSummaryQuery,
  useGetMonthlyRevenueQuery,
  useGetTopRoutesQuery,
  useGetPendingPayrollQuery,
} from "../../../../store/apiSlices/financeApiSlice";
import { useUpdateStaffPaymentMutation } from "../../../../store/apiSlices/jobsApiSlice";
import { FormField } from "../../../../components/FormField";
import { KpiGridSkeleton } from "../../shared/components/Skeleton";
import { Select } from "../../shared/components/Select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CustomFinanceTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800 space-y-1.5 font-mono">
        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{label}</p>
        <p className="text-brand-400 flex items-center justify-between gap-4">
          <span>Billed:</span>
          <span className="font-bold">₹{Number(payload[0]?.value || 0).toLocaleString("en-IN")}</span>
        </p>
        <p className="text-emerald-400 flex items-center justify-between gap-4">
          <span>Collected:</span>
          <span className="font-bold">₹{Number(payload[1]?.value || 0).toLocaleString("en-IN")}</span>
        </p>
      </div>
    );
  }
  return null;
};

const FinanceDashboard = () => {
  const { data: summary, isLoading: summaryLoading, isFetching: summaryFetching, refetch: refetchSummary } =
    useGetFinanceSummaryQuery();
  const { data: monthly = [], isLoading: monthlyLoading } = useGetMonthlyRevenueQuery();
  const { data: topRoutes = [], isLoading: routesLoading } = useGetTopRoutesQuery();
  const { data: pendingPayroll = [], isLoading: payrollLoading, isFetching: payrollFetching, refetch: refetchPayroll } =
    useGetPendingPayrollQuery();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        refetchSummary(),
        refetchPayroll(),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const [updateStaffPayment, { isLoading: paying }] = useUpdateStaffPaymentMutation();

  // Payment modal state for clearing payroll
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [payNotes, setPayNotes] = useState("");

  const handleOpenPayModal = (item) => {
    setSelectedPayroll(item);
    setPayAmount(item.balanceOwed.toString());
    setPayMode("cash");
    setPayNotes("");
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayroll) return;

    try {
      await updateStaffPayment({
        jobId: selectedPayroll.jobId,
        staffId: selectedPayroll.staffId,
        amountPaid: (Number(selectedPayroll.amountPaid) || 0) + Number(payAmount),
        paymentMode: payMode,
        paymentNotes: payNotes || "Cleared from Finance Payroll Dashboard",
      }).unwrap();
      setSelectedPayroll(null);
      refetchPayroll();
      refetchSummary();
    } catch (err) {
      alert("Failed to record pay: " + (err.data?.error || err.message));
    }
  };

  const chartData = monthly.map((m) => {
    let label = m.month || "";
    if (label.includes("-")) {
      const parts = label.split("-");
      label = `${parts[1]}/${parts[0].slice(2)}`;
    }
    return {
      monthLabel: label,
      Billed: Number(m.billed || 0),
      Collected: Number(m.collected || 0),
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Action Row */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync financial accounts"
          aria-label="Refresh & sync financial accounts"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || summaryFetching || payrollFetching ? "animate-spin text-emerald-600 dark:text-emerald-300" : ""}`} />
        </button>
      </div>

      {/* 4 Financial KPI Cards */}
      {summaryLoading || isSyncing ? (
        <KpiGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Total Billed</span>
              <Receipt className="w-4 h-4 text-brand-600 dark:text-brand-300 shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono truncate">
              ₹{(summary?.totalRevenue || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              This Month: <strong>₹{(summary?.thisMonthRevenue || 0).toLocaleString("en-IN")}</strong>
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 truncate">Collected Cash</span>
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono truncate">
              ₹{(summary?.totalCollected || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-300 font-medium truncate">Cleared customer receipts</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 truncate">Outstanding Due</span>
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-300 font-mono truncate">
              ₹{(summary?.totalOutstanding || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Pending customer balance</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 truncate">Pending Wages</span>
              <Users className="w-4 h-4 text-rose-500 shrink-0" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-300 font-mono truncate">
              ₹{(summary?.pendingStaffWages || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              Total Paid: <strong>₹{(summary?.totalStaffPaid || 0).toLocaleString("en-IN")}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Monthly Revenue Visual Trend & Top Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Revenue Bar Chart (HTML/CSS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                <span>Monthly Billing vs Collections</span>
              </h3>
              <p className="text-xs text-slate-400">Comparison of invoice totals vs cleared receipts</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-brand-600"></span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Billed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Collected</span>
              </div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-60 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-chart-grid)" />
                  <XAxis
                    dataKey="monthLabel"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "var(--admin-chart-grid)" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip content={<CustomFinanceTooltip />} />
                  <Bar dataKey="Billed" fill="var(--color-brand-600)" radius={[4, 4, 0, 0]} maxBarSize={44} />
                  <Bar dataKey="Collected" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              No historical billing data found yet. Generate invoices to populate monthly charts.
            </div>
          )}
        </div>

        {/* Top Routes by Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Top Revenue Routes</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Ranked by Billed Value
              </span>
            </div>

            {topRoutes.length > 0 ? (
              <div className="space-y-2.5">
                {topRoutes.slice(0, 5).map((r, idx) => {
                  const parts = (r.route || "").split(/→|➔/);
                  const fromLoc = r.movingFrom || parts[0]?.trim() || "Origin";
                  const toLoc = r.movingTo || parts[1]?.trim() || "Destination";
                  const avgPrice = Math.round(r.totalRevenue / (r.count || 1));

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50/70 dark:bg-slate-950/70 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-700/70 transition-all space-y-2 group"
                    >
                      {/* Top Row: Rank Badge, Volume Pill, and Total Revenue */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono ${
                              idx === 0
                                ? "bg-amber-500 text-white shadow-2xs"
                                : idx === 1
                                ? "bg-slate-700 text-white"
                                : idx === 2
                                ? "bg-amber-700/80 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                            {r.count} {r.count === 1 ? "Move" : "Moves"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100 block leading-tight">
                            ₹{r.totalRevenue.toLocaleString("en-IN")}
                          </span>
                          {r.count > 1 ? (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                              avg ₹{avgPrice.toLocaleString("en-IN")}/move
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold block">
                              100% Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Route Path Row: Separated Origin and Destination */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="truncate flex-1 text-slate-700 dark:text-slate-200" title={fromLoc}>
                          {fromLoc}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300 shrink-0" />
                        <span className="truncate flex-1 text-brand-900 dark:text-brand-300 font-bold" title={toLoc}>
                          {toLoc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No route revenue data recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Staff Payroll Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-300 shrink-0" />
              <span>Pending Staff Wages & Payroll Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Unsettled wages for loaders, drivers, and supervisors</p>
          </div>
        </div>

        {pendingPayroll.length > 0 ? (
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto text-xs">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 text-left">Staff Name</th>
                  <th className="py-2.5 px-3 text-left">Role</th>
                  <th className="py-2.5 px-3 text-left">Job Ref</th>
                  <th className="py-2.5 px-3 text-left">Move Date</th>
                  <th className="py-2.5 px-3 text-right">Payable</th>
                  <th className="py-2.5 px-3 text-right">Paid</th>
                  <th className="py-2.5 px-3 text-right">Balance Owed</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingPayroll.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{item.staffName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.staffPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 capitalize font-medium">{item.roleOnJob || item.staffRole}</td>
                    <td className="py-2.5 px-3">
                      <Link to={`/jobs/${item.jobId}`} className="font-mono text-brand-600 dark:text-brand-300 hover:underline">
                        {item.jobNumber}
                      </Link>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{item.customerName}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{item.scheduledDate}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{item.amountPayable}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400">₹{item.amountPaid}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-300">
                      ₹{item.balanceOwed}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleOpenPayModal(item)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                      >
                        Clear Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 px-4 sm:px-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm sm:max-w-md mx-auto leading-relaxed">
              All staff wages and driver payments are fully cleared! No pending balances.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: Pay Staff Member */}
      {selectedPayroll && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                <span>Clear Wages: {selectedPayroll.staffName}</span>
              </h3>
              <button onClick={() => setSelectedPayroll(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Job Number:</span>
                  <span className="font-mono font-bold">{selectedPayroll.jobNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Customer:</span>
                  <span>{selectedPayroll.customerName}</span>
                </div>
                <div className="flex justify-between text-rose-700 dark:text-rose-300 font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{selectedPayroll.balanceOwed}</span>
                </div>
              </div>

              <FormField label="Amount to Pay Now (₹)" required>
                <input
                  type="number"
                  min="1"
                  max={selectedPayroll.balanceOwed}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-mono focus:border-emerald-500 outline-none"
                />
              </FormField>

              <FormField label="Payment Mode" required>
                <Select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  buttonClassName="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="upi">UPI / PhonePe / GPay</option>
                  <option value="bank">Direct Bank Transfer</option>
                </Select>
              </FormField>

              <FormField label="Payment Remarks / Notes">
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Paid cash at terminal"
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-emerald-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={paying}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Confirm Wage Payment Receipt</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
