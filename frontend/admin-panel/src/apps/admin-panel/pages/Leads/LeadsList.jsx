import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Phone,
  MessageSquare,
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  X,
  User,
  Truck,
  RotateCcw,
  Copy,
  Check,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Loader2,
  Mail,
  Download,
} from "lucide-react";
import {
  useGetLeadsQuery,
  useCreateManualLeadMutation,
  useUpdateLeadMutation,
} from "../../../../store/apiSlices/leadsApiSlice";
import { useGetQuotesQuery } from "../../../../store/apiSlices/quotesApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { FormField } from "../../../../components/FormField";
import { CardGridSkeleton } from "../../shared/components/Skeleton";
import { exportToCsv } from "../../shared/utils/csvExport";
import { Select } from "../../shared/components/Select";

const LeadsList = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: leads = [], isLoading, isFetching, refetch: fetchLeads } =
    useGetLeadsQuery(statusFilter);
  const { data: quotes = [], refetch: fetchQuotes } = useGetQuotesQuery();
  const [isSyncing, setIsSyncing] = useState(false);

  const quoteByLeadId = React.useMemo(() => {
    const map = {};
    for (const q of quotes) {
      if (q.leadId) {
        map[q.leadId] = q;
      }
    }
    return map;
  }, [quotes]);

  const findQuoteForLead = (lead) => {
    if (quoteByLeadId[lead.id]) return quoteByLeadId[lead.id];
    if (lead.phone) {
      const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
      if (cleanPhone) {
        const match = quotes.find(
          (q) => q.customerPhone && q.customerPhone.replace(/[^0-9]/g, "") === cleanPhone
        );
        if (match) return match;
      }
    }
    return null;
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetchLeads(),
        fetchQuotes(),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const { data: dbSettings } = useGetSettingsQuery();
  const companyName = dbSettings?.name || "Om Rudra Packers and Movers";
  const [createManualLead] = useCreateManualLeadMutation();
  const [updateLead] = useUpdateLeadMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const formatLeadDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "-";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime())
        ? (dateStr.length > 20 ? "-" : dateStr)
        : d.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch {
      return "-";
    }
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);

  // New Lead Form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    movingFrom: "",
    movingTo: "",
    moveType: "Within City",
    service: "Home Shifting",
    timeline: "Within a week",
    notes: "",
  });
  const [leadErrors, setLeadErrors] = useState({});
  const [leadSubmitError, setLeadSubmitError] = useState("");

  const navigate = useNavigate();

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      await updateLead({ id: leadId, status: newStatus }).unwrap();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status: " + (err.data?.error || err.message));
    }
  };

  const handleSaveNotes = async (leadId, notes) => {
    try {
      await updateLead({ id: leadId, notes }).unwrap();
    } catch (err) {
      alert("Failed to save notes: " + (err.data?.error || err.message));
    }
  };

  const validateLeadForm = () => {
    const errs = {};
    if (!newLeadForm.name.trim()) errs.name = "Customer name is required";
    if (!newLeadForm.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(newLeadForm.phone.trim())) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    if (!newLeadForm.movingFrom.trim()) errs.movingFrom = "Moving from address is required";
    if (!newLeadForm.movingTo.trim()) errs.movingTo = "Moving to address is required";
    setLeadErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setLeadSubmitError("");
    if (!validateLeadForm()) return;

    try {
      await createManualLead(newLeadForm).unwrap();
      setIsAddModalOpen(false);
      setNewLeadForm({
        name: "",
        phone: "",
        email: "",
        movingFrom: "",
        movingTo: "",
        moveType: "Within City",
        service: "Home Shifting",
        timeline: "Within a week",
        notes: "",
      });
      setLeadErrors({});
    } catch (err) {
      setLeadSubmitError(err.data?.error || err.message || "Failed to create lead");
    }
  };

  const copyToClipboard = (phone, id) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.movingFrom && l.movingFrom.toLowerCase().includes(q)) ||
      (l.movingTo && l.movingTo.toLowerCase().includes(q))
    );
  });

  // KPI Calculations
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const contactedCount = leads.filter((l) => l.status === "contacted").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            New Lead
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Contacted
          </span>
        );
      case "converted":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Converted
          </span>
        );
      case "lost":
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Lost
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const columns = [
      { header: "Lead ID", accessor: (l) => l.id },
      { header: "Customer Name", accessor: (l) => l.name || "" },
      { header: "Phone", accessor: (l) => l.phone || "" },
      { header: "Email", accessor: (l) => l.email || "" },
      { header: "Moving From", accessor: (l) => l.movingFrom || "" },
      { header: "Moving To", accessor: (l) => l.movingTo || "" },
      { header: "Move Type", accessor: (l) => l.moveType || "" },
      { header: "Service", accessor: (l) => l.service || "" },
      { header: "Timeline", accessor: (l) => l.timeline || "" },
      { header: "Status", accessor: (l) => l.status || "" },
      { header: "Notes", accessor: (l) => l.notes || "" },
      { header: "Created Date", accessor: (l) => l.createdAt || "" },
    ];
    exportToCsv("leads_export", columns, filteredLeads);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Row */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          title="Export filtered leads to CSV"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync leads"
          aria-label="Refresh & sync leads"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-blue-600" : ""}`} />
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Log Call Lead</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Total Leads</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <User className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 sm:mt-2 font-mono">{totalLeads}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">All channel inquiries</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">New Inquiries</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1 sm:mt-2 font-mono">{newLeadsCount}</p>
          <p className="text-[10px] sm:text-[11px] text-rose-500 font-medium mt-0.5 truncate">Needs follow-up</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">In Progress</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1 sm:mt-2 font-mono">{contactedCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Quote discussed</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Converted</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 sm:mt-2 font-mono">{convertedCount}</p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5 truncate">
            {totalLeads > 0 ? `${Math.round((convertedCount / totalLeads) * 100)}% conversion` : "Active deals"}
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone number, origin, or destination city..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs with Dynamic Count Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: "All Leads", count: totalLeads },
            { id: "new", label: "New", count: newLeadsCount },
            { id: "contacted", label: "Contacted", count: contactedCount },
            { id: "converted", label: "Converted", count: convertedCount },
            { id: "lost", label: "Lost", count: leads.filter((l) => l.status === "lost").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 border-slate-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid / Cards */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No leads found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No inquiries match "${searchQuery}". Try searching by another keyword.`
              : 'Submit a quote on the public website or click "Quick Call Lead" to log a customer inquiry.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Customer Call</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div>
                {/* Row 1: Lead ID & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                    Lead #{lead.id}
                  </span>
                  <div className="shrink-0">{getStatusBadge(lead.status)}</div>
                </div>

                {/* Row 2: Customer Name */}
                <div className="mt-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </h3>

                  {/* Row 3: Phone and Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-mono font-medium">{lead.phone}</span>
                      <button
                        onClick={() => copyToClipboard(lead.phone, `phone-${lead.id}`)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
                        title="Copy phone number"
                      >
                        {copiedPhoneId === `phone-${lead.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {lead.email && (
                      <div className="flex items-center gap-1 text-slate-500 min-w-0 max-w-full">
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-xs text-slate-600 hover:text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-[240px]"
                          title={`Email ${lead.email}`}
                        >
                          <span className="truncate">{lead.email}</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(lead.email, `email-${lead.id}`)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Copy email address"
                        >
                          {copiedPhoneId === `email-${lead.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Route & Cargo Specs */}
                <div className="mt-3 bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{lead.movingFrom}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-blue-900 truncate">{lead.movingTo}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200/70 font-medium text-slate-700">
                      📦 {lead.service || "Shifting"}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200/70 font-medium text-slate-700">
                      ⏱️ {lead.timeline || "Immediate"}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {formatLeadDate(lead.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Optional Customer Notes */}
                {lead.notes && (
                  <p className="mt-2.5 text-xs text-slate-600 bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl">
                    <span className="font-semibold text-amber-800">Note: </span>
                    {lead.notes}
                  </p>
                )}
              </div>

              {/* Bottom Actions Area */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                {/* View Full Customer Pipeline CTA */}
                <button
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Customer Pipeline & Relocation Tree →</span>
                </button>

                {/* Communication & Conversion Buttons */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] sm:text-xs rounded-xl transition-colors text-center border border-emerald-200/60"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${lead.name}, greetings from ${companyName}! We received your shifting inquiry for ${lead.movingFrom} to ${lead.movingTo}. How can we assist you with best rates today?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 bg-green-50 hover:bg-green-100 text-green-800 font-semibold text-[11px] sm:text-xs rounded-xl transition-colors text-center border border-green-200/60"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </a>

                  {(() => {
                    const existingQuote = findQuoteForLead(lead);
                    if (existingQuote) {
                      return (
                        <button
                          onClick={() => navigate(`/quotes/${existingQuote.id}`)}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] sm:text-xs rounded-xl shadow-2xs transition-colors cursor-pointer text-center"
                          title={`View Quotation ${existingQuote.quoteNumber}`}
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">View Quote</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => {
                          navigate(
                            `/quotes/new?leadId=${lead.id}&name=${encodeURIComponent(
                              lead.name
                            )}&phone=${encodeURIComponent(
                              lead.phone
                            )}&email=${encodeURIComponent(
                              lead.email || ""
                            )}&from=${encodeURIComponent(
                              lead.movingFrom
                            )}&to=${encodeURIComponent(lead.movingTo)}&service=${encodeURIComponent(
                              lead.service || ""
                            )}&moveType=${encodeURIComponent(
                              lead.moveType || ""
                            )}&timeline=${encodeURIComponent(lead.timeline || "")}`
                          );
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer text-center"
                        title="Generate quotation for this inquiry"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    );
                  })()}
                </div>

                {/* Quick Status Pill Bar */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-medium">Stage:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                    {["new", "contacted", "converted", "lost"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(lead.id, st)}
                        className={`px-2 py-0.5 rounded-md capitalize font-medium transition-all ${
                          lead.status === st
                            ? "bg-white text-slate-900 shadow-2xs font-bold"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Manual Lead Modal (Full screen on mobile, elegant dialog on desktop) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl flex flex-col sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Log Incoming Call / Walk-In Lead
                </h3>
                <p className="text-xs text-slate-500">
                  Capture customer details to track and generate estimate
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="flex-1 flex flex-col min-h-0 text-xs">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {leadSubmitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-between">
                    <span>{leadSubmitError}</span>
                    <button type="button" onClick={() => setLeadSubmitError("")} className="font-bold">×</button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Customer Name" required error={leadErrors.name}>
                    <input
                      type="text"
                      value={newLeadForm.name}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, name: e.target.value })
                      }
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs sm:text-sm"
                    />
                  </FormField>

                  <FormField label="Phone Number" required error={leadErrors.phone}>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newLeadForm.phone}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, phone: e.target.value })
                      }
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs sm:text-sm font-mono"
                    />
                  </FormField>
                </div>

                <FormField label="Email Address (Optional)">
                  <input
                    type="email"
                    value={newLeadForm.email || ""}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, email: e.target.value })
                    }
                    placeholder="e.g. customer@example.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs sm:text-sm"
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Moving From" required error={leadErrors.movingFrom}>
                    <input
                      type="text"
                      value={newLeadForm.movingFrom}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, movingFrom: e.target.value })
                      }
                      placeholder="e.g. Kankarbagh, Patna"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs sm:text-sm"
                    />
                  </FormField>

                  <FormField label="Moving To" required error={leadErrors.movingTo}>
                    <input
                      type="text"
                      value={newLeadForm.movingTo}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, movingTo: e.target.value })
                      }
                      placeholder="e.g. Ranchi / New Delhi"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs sm:text-sm"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <FormField label="Move Scope">
                    <Select
                      value={newLeadForm.moveType}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, moveType: e.target.value })
                      }
                      buttonClassName="bg-slate-50 border-slate-200"
                    >
                      <option value="Within City">Within City</option>
                      <option value="Domestic">Interstate (Domestic)</option>
                      <option value="Vehicle Shifting">Vehicle Only</option>
                    </Select>
                  </FormField>

                  <FormField label="Service Category">
                    <Select
                      value={newLeadForm.service}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, service: e.target.value })
                      }
                      buttonClassName="bg-slate-50 border-slate-200"
                    >
                      <option value="Home Shifting">Home Shifting</option>
                      <option value="Office Relocation">Office Relocation</option>
                      <option value="Car & Bike Transport">Car / Bike Transport</option>
                      <option value="Warehousing">Storage / Warehousing</option>
                    </Select>
                  </FormField>

                  <FormField label="Timeline">
                    <Select
                      value={newLeadForm.timeline}
                      onChange={(e) =>
                        setNewLeadForm({ ...newLeadForm, timeline: e.target.value })
                      }
                      buttonClassName="bg-slate-50 border-slate-200"
                    >
                      <option value="Immediate">Today / Tomorrow</option>
                      <option value="Within a week">Within a week</option>
                      <option value="Next month">Next month</option>
                      <option value="Just inquiring">Just inquiring</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Notes & Special Requirements">
                  <textarea
                    rows={3}
                    value={newLeadForm.notes}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, notes: e.target.value })
                    }
                    placeholder="e.g. 2BHK, 3rd floor without elevator, includes refrigerator..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs sm:text-sm resize-none"
                  />
                </FormField>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white sm:bg-slate-50/60 flex items-center justify-end gap-2.5 shrink-0 pb-[max(env(safe-area-inset-bottom),0.875rem)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer text-xs sm:text-sm text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-xs sm:text-sm text-center"
                >
                  Save Lead Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
