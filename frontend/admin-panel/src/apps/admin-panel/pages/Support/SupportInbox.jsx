import { useState } from "react";
import { Headphones, Search, RefreshCw, Mail, Phone, MessageSquare, CheckCircle, Loader2, AlertCircle, Clock, Plus } from "lucide-react";
import ComplaintForm from "./ComplaintForm";
import { Select } from "../../shared/components/Select";
import { useGetSupportQuery, useUpdateSupportMutation } from "../../../../store/apiSlices/supportApiSlice";

const statuses = { new: "New", in_progress: "In progress", resolved: "Resolved", closed: "Closed" };
const sources = { website: "Website", phone: "Phone call", whatsapp: "WhatsApp", in_person: "In person", email: "Email", other: "Other" };
const badgeColors = { new: "bg-blue-50 text-blue-700", in_progress: "bg-amber-50 text-amber-800", resolved: "bg-emerald-50 text-emerald-700", closed: "bg-slate-100 text-slate-600" };
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all";
const dateLabel = value => {
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

function MessageDetail({ message }) {
  const [status, setStatus] = useState(message.supportStatus);
  const [notes, setNotes] = useState(message.supportNotes || "");
  const [feedback, setFeedback] = useState("");
  const [save, { isLoading }] = useUpdateSupportMutation();
  const dirty = status !== message.supportStatus || notes !== (message.supportNotes || "");
  const submit = async event => {
    event.preventDefault();
    setFeedback("");
    try {
      await save({ id: message.id, supportStatus: status, supportNotes: notes }).unwrap();
      setFeedback("Changes saved.");
    } catch (error) {
      setFeedback(error.data?.error || "Could not save changes. Please try again.");
    }
  };
  return <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
    <div className="border-b border-slate-100 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-500">CONTACT #{message.id}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColors[message.supportStatus]}`}>{statuses[message.supportStatus]}</span></div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 break-words">{message.service}</h2>
      {message.subjectOther && <p className="mt-2 text-sm text-slate-700 [overflow-wrap:anywhere]">{message.subjectOther}</p>}
      <p className="mt-1 text-sm text-slate-500">Received {dateLabel(message.createdAt)}</p>
      <p className="mt-2 text-xs text-slate-500">Source: {sources[message.supportSource] || "Website"}{message.bookingReference && ` · Booking: ${message.bookingReference}`}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-blue-700" href={`tel:+91${message.phone}`}><Phone size={16} />Call customer</a>
        {message.email && <a className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-blue-700" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.service}`)}`}><Mail size={16} />Open email reply</a>}
      </div>
      <dl className="mt-5 space-y-1 text-sm break-words"><dt className="font-semibold">{message.name}</dt><dd className="text-slate-600">+91 {message.phone}</dd>{message.email && <dd className="text-slate-600 [overflow-wrap:anywhere]">{message.email}</dd>}</dl>
    </div>
    <div className="p-4 sm:p-5"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Customer message</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800 [overflow-wrap:anywhere]">{message.notes || "No message provided."}</p></div>
    <form onSubmit={submit} className="border-t border-slate-100 p-4 sm:p-5 space-y-4">
      <label className="block text-sm font-semibold">Status<Select containerClassName="mt-2" value={status} onChange={event => { setStatus(event.target.value); setFeedback(""); }} disabled={isLoading}>{Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select></label>
      <label className="block text-sm font-semibold">Internal notes<textarea className={`${inputClass} mt-2 min-h-32 resize-y font-normal`} maxLength={10000} value={notes} onChange={event => { setNotes(event.target.value); setFeedback(""); }} disabled={isLoading} placeholder="Record follow-ups, booking details, or how the issue was resolved." /></label>
      <p className="text-xs text-slate-500">Notes are visible to staff. The customer's original message is preserved.</p>
      {feedback && <p role="status" className="text-sm text-slate-700">{feedback}</p>}
      <button disabled={!dirty || isLoading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50">{isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}{isLoading ? "Saving..." : "Save changes"}</button>
    </form>
  </section>;
}

export default function SupportInbox() {
  const { data: messages = [], isLoading, isFetching, isError, refetch } = useGetSupportQuery(undefined, { pollingInterval: 30000 });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [createdNotice, setCreatedNotice] = useState("");
  const visible = messages.filter(message => (filter === "all" || message.supportStatus === filter) && (subject === "all" || message.service === subject) && [message.name, message.email, message.phone, message.service, message.subjectOther, message.notes, String(message.id)].some(value => value?.toLowerCase().includes(query.trim().toLowerCase())));
  const selected = visible.find(message => message.id === selectedId) || visible[0];
  return <div className="space-y-4 sm:space-y-6">
    <div className="flex items-center justify-end gap-2">
      <button onClick={() => { setShowForm(value => !value); setCreatedNotice(""); }} aria-expanded={showForm} className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"><Plus size={18} />Log complaint</button>
      <button onClick={refetch} disabled={isFetching} aria-label="Refresh messages" title="Refresh messages" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"><RefreshCw size={18} className={isFetching ? "animate-spin" : ""} /></button>
    </div>
    {showForm && <ComplaintForm onCancel={() => setShowForm(false)} onCreated={message => { setSelectedId(message.id); setQuery(""); setFilter("all"); setSubject("all"); setShowForm(false); setCreatedNotice(`Complaint #${message.id} logged successfully.`); }} />}
    {createdNotice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{createdNotice}</p>}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {[
        { label: "Total messages", count: messages.length, caption: "Website & direct enquiries", icon: Headphones, color: "blue" },
        { label: "New messages", count: messages.filter(message => message.supportStatus === "new").length, caption: "Needs follow-up", icon: AlertCircle, color: "rose" },
        { label: "In progress", count: messages.filter(message => message.supportStatus === "in_progress").length, caption: "Being handled by the team", icon: Clock, color: "amber" },
        { label: "Resolved", count: messages.filter(message => message.supportStatus === "resolved").length, caption: "Customer enquiries resolved", icon: CheckCircle, color: "emerald" },
      ].map(({ label, count, caption, icon: Icon, color }) => {
        const colors = { blue: ["bg-blue-50 text-blue-600", "text-slate-900"], rose: ["bg-rose-50 text-rose-600", "text-rose-600"], amber: ["bg-amber-50 text-amber-600", "text-amber-600"], emerald: ["bg-emerald-50 text-emerald-600", "text-emerald-600"] };
        return <div key={label} className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between gap-2"><span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</span><span className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${colors[color][0]}`}><Icon className="w-4 h-4" /></span></div>
          <div className={`text-xl sm:text-2xl font-black mt-1 sm:mt-2 font-mono ${colors[color][1]}`}>{isLoading ? "—" : count}</div><p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{caption}</p>
        </div>;
      })}
    </div>
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row gap-3"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input aria-label="Search contact messages" className={`${inputClass} pl-10`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, phone, email, or message..." /></label><Select aria-label="Filter by subject" containerClassName="w-full sm:w-56" value={subject} onChange={event => setSubject(event.target.value)}><option value="all">All subjects</option>{[...new Set(messages.map(message => message.service))].sort().map(value => <option key={value}>{value}</option>)}</Select></div>
      <div className="flex flex-wrap gap-2">{Object.entries({ all: "All messages", ...statuses }).map(([key, label]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)} className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${filter === key ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-slate-50/80 text-slate-600 border-slate-200/80 hover:bg-slate-100"}`}>{label} <span className={`text-[10px] px-1.5 rounded-full font-mono font-medium ${filter === key ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-500"}`}>{messages.filter(message => key === "all" || message.supportStatus === key).length}</span></button>)}</div>
    </div>
    {isError ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">Could not load messages. <button className="underline" onClick={refetch}>Try again</button></div> : isLoading ? <div role="status" className="p-12 text-center text-slate-500">Loading contact messages...</div> : !visible.length ? <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3"><div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto"><Headphones size={28} /></div><h2 className="text-sm font-bold text-slate-800">{messages.length ? "No matching messages" : "Your support inbox is clear"}</h2><p className="text-xs text-slate-500 max-w-md mx-auto">{messages.length ? "Try another search, status, or subject." : "Messages submitted through the website contact form will appear here."}</p></div> : <div className="grid items-start gap-5 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
      <section aria-label="Contact messages" className="rounded-2xl border border-slate-200 bg-white overflow-hidden"><div className="px-5 py-4 border-b border-slate-100 text-xs font-semibold text-slate-500">{visible.length} {visible.length === 1 ? "message" : "messages"} · Newest first</div><div className="max-h-[680px] overflow-y-auto">{visible.map(message => <button key={message.id} onClick={() => setSelectedId(message.id)} aria-pressed={selected?.id === message.id} className={`w-full text-left p-5 border-b border-slate-100 border-l-4 transition-colors ${selected?.id === message.id ? "border-l-blue-600 bg-blue-50/60" : "border-l-transparent hover:bg-slate-50"}`}><div className="flex items-start justify-between gap-2"><span className="font-bold text-sm break-words">{message.name}</span><span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${badgeColors[message.supportStatus]}`}>{statuses[message.supportStatus]}</span></div><div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-600"><MessageSquare size={14} />{message.service}</div><p className="mt-2 line-clamp-2 text-sm text-slate-500 [overflow-wrap:anywhere]">{message.notes}</p><p className="mt-3 text-xs text-slate-400">#{message.id} · {dateLabel(message.createdAt)}</p></button>)}</div></section>
      {selected && <MessageDetail key={selected.id} message={selected} />}
    </div>}
  </div>;
}



