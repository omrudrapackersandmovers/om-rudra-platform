import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Plus,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  Truck,
  Receipt,
  FileText,
  DollarSign,
  User,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Edit2,
  Mail,
} from "lucide-react";
import {
  useGetLeadByIdQuery,
  useGetLeadPipelineQuery,
  useUpdateLeadMutation,
} from "../../../../store/apiSlices/leadsApiSlice";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pipelineData, isLoading: loading } = useGetLeadPipelineQuery(id);
  const [updateLead] = useUpdateLeadMutation();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "—";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime()) ? (dateStr.length > 20 ? "—" : dateStr) : d.toLocaleDateString("en-IN");
    } catch {
      return "—";
    }
  };

  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const lead = pipelineData?.lead;
  const quotes = pipelineData?.quotes || [];

  const handleStatusChange = async (newStatus) => {
    try {
      await updateLead({ id, status: newStatus }).unwrap();
    } catch (err) {
      alert("Failed to update lead status: " + (err.data?.error || err.message));
    }
  };

  const handleSaveNotes = async () => {
    try {
      await updateLead({ id, notes }).unwrap();
      setIsEditingNotes(false);
    } catch (err) {
      alert("Failed to save notes: " + (err.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading customer pipeline...</div>;
  }

  if (!lead) {
    return <div className="text-center py-12 text-rose-500 text-sm">Lead not found.</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/leads")}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leads</span>
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Customer Pipeline #{lead.id}
            </h2>
            <p className="text-xs text-slate-500">End-to-end relocation lifecycle & linked documents</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {quotes.length > 0 ? (
            <>
              <Link
                to={`/quotes/${quotes[0].id}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>View / Edit Quote</span>
              </Link>
              <button
                onClick={() =>
                  navigate(
                    `/quotes/new?leadId=${lead.id}&name=${encodeURIComponent(
                      lead.name
                    )}&phone=${encodeURIComponent(
                      lead.phone
                    )}&email=${encodeURIComponent(
                      lead.email || ""
                    )}&from=${encodeURIComponent(
                      lead.movingFrom
                    )}&to=${encodeURIComponent(lead.movingTo)}&service=${encodeURIComponent(lead.service || "")}&moveType=${encodeURIComponent(lead.moveType || "")}&timeline=${encodeURIComponent(lead.timeline || "")}`
                  )
                }
                className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                title="Create an alternative quotation for this customer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Another Quote</span>
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                navigate(
                  `/quotes/new?leadId=${lead.id}&name=${encodeURIComponent(
                    lead.name
                  )}&phone=${encodeURIComponent(
                    lead.phone
                  )}&email=${encodeURIComponent(
                    lead.email || ""
                  )}&from=${encodeURIComponent(
                    lead.movingFrom
                  )}&to=${encodeURIComponent(lead.movingTo)}&service=${encodeURIComponent(lead.service || "")}&moveType=${encodeURIComponent(lead.moveType || "")}&timeline=${encodeURIComponent(lead.timeline || "")}`
                )
              }
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quote</span>
            </button>
          )}
        </div>
      </div>

      {/* Lead Customer Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">{lead.name}</h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  lead.status === "converted"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : lead.status === "contacted"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : lead.status === "lost"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {lead.status}
              </span>
            </div>

            {/* Row 1 Contact: Phone & WhatsApp */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1 font-mono text-blue-600 hover:underline">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 {lead.phone}</span>
              </a>
              <a
                href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${lead.name}, this is from Om Rudra Packers and Movers regarding your relocation inquiry.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-600 hover:underline font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Row 2 Contact: Email */}
            {lead.email && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${lead.email}`}
                  className="text-slate-600 hover:text-blue-600 hover:underline truncate max-w-xs sm:max-w-md"
                  title={`Send email to ${lead.email}`}
                >
                  {lead.email}
                </a>
              </div>
            )}
          </div>

          {/* Quick status switch buttons */}
          <div className="grid grid-cols-4 sm:flex gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
            {["new", "contacted", "converted", "lost"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`py-1.5 px-2 sm:px-3 text-center rounded-lg capitalize text-xs transition-colors cursor-pointer ${
                  lead.status === st
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Route & Inquiry details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Route</span>
            <div className="font-semibold text-slate-900">
              {lead.movingFrom} ➔ {lead.movingTo}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Service & Move Type</span>
            <div className="font-medium text-slate-800">
              {lead.service} ({lead.moveType})
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Timeline</span>
            <div className="font-medium text-slate-800">{lead.timeline}</div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 font-semibold">
            <span>Customer Notes / Communication Log:</span>
            {!isEditingNotes && (
              <button
                onClick={() => {
                  setNotes(lead.notes || "");
                  setIsEditingNotes(true);
                }}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Edit Notes
              </button>
            )}
          </div>
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 italic">
              {lead.notes || "No notes logged yet."}
            </p>
          )}
        </div>
      </div>

      {/* PIPELINE VISUALIZER TREE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Relocation Journey & Associated Documents</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {quotes.length} {quotes.length === 1 ? "Quotation" : "Quotations"} Generated
          </span>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">No Quotations Created Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                To start this customer's relocation pipeline, generate their formal quote with inventory and pricing.
              </p>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/quotes/new?leadId=${lead.id}&name=${encodeURIComponent(
                    lead.name
                  )}&phone=${encodeURIComponent(
                    lead.phone
                  )}&from=${encodeURIComponent(
                    lead.movingFrom
                  )}&to=${encodeURIComponent(lead.movingTo)}&service=${encodeURIComponent(lead.service || "")}&moveType=${encodeURIComponent(lead.moveType || "")}&timeline=${encodeURIComponent(lead.timeline || "")}`
                )
              }
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Quote →</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
              >
                {/* Quote Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-xl shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{q.quoteNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            q.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Created on {formatDate(q.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="font-mono font-bold text-base text-slate-900 mr-1">
                      ₹{q.totalAmount.toLocaleString("en-IN")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/quotes/${q.id}/edit`}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Edit this quotation"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                      <Link
                        to={`/quotes/${q.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Sub-level Jobs under this quote */}
                {q.jobs && q.jobs.length > 0 ? (
                  <div className="pl-3 sm:pl-6 border-l-2 border-purple-200 space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Converted Move Job:</span>
                    </div>

                    {q.jobs.map((j) => (
                      <div
                        key={j.id}
                        className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3.5 sm:p-4 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-blue-700 text-xs">{j.jobNumber}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  j.status === "completed"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}
                              >
                                {j.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Scheduled Date: <strong>{j.scheduledDate}</strong>
                            </p>
                          </div>

                          <Link
                            to={`/jobs/${j.id}`}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors w-full sm:w-auto"
                          >
                            <span>Manage Job & Resources</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Invoices and Bilties inside the Job */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                          {/* Invoices */}
                          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Receipt className="w-3 h-3 text-blue-600" />
                              <span>Invoices ({j.invoices?.length || 0})</span>
                            </span>
                            {j.invoices && j.invoices.length > 0 ? (
                              j.invoices.map((inv) => (
                                <div key={inv.id} className="flex justify-between items-center pt-1">
                                  <div>
                                    <div className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      Bal: ₹{inv.balanceDue} • {inv.paymentStatus.toUpperCase()}
                                    </div>
                                  </div>
                                  <Link
                                    to={`/invoices/${inv.id}`}
                                    className="text-blue-600 font-semibold text-xs hover:underline flex items-center gap-0.5"
                                  >
                                    <span>View</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </div>
                              ))
                            ) : (
                              <div className="text-slate-400 text-[11px]">No invoice generated yet</div>
                            )}
                          </div>

                          {/* Bilties */}
                          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-amber-500" />
                              <span>Highway Bilties / LR ({j.bilties?.length || 0})</span>
                            </span>
                            {j.bilties && j.bilties.length > 0 ? (
                              j.bilties.map((b) => (
                                <div key={b.id} className="flex justify-between items-center pt-1">
                                  <div>
                                    <div className="font-mono font-bold text-slate-900">{b.lrNumber}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      Truck: {b.truckNumber} • {b.freightStatus.toUpperCase()}
                                    </div>
                                  </div>
                                  <Link
                                    to={`/bilties/${b.id}`}
                                    className="text-amber-600 font-semibold text-xs hover:underline flex items-center gap-0.5"
                                  >
                                    <span>View</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </div>
                              ))
                            ) : (
                              <div className="text-slate-400 text-[11px]">No Bilty issued yet</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pl-4 sm:pl-6 border-l-2 border-slate-200 flex items-center justify-between text-xs text-slate-500 py-1">
                    <span>This quote has not yet been converted into an active move job.</span>
                    <Link
                      to={`/quotes/${q.id}`}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Convert to Job →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetail;
