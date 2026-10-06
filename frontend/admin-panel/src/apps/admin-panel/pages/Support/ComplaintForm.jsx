import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, CheckCircle, X } from "lucide-react";
import { Select } from "../../shared/components/Select";
import { useCreateComplaintMutation, useSearchSupportReferencesQuery } from "../../../../store/apiSlices/supportApiSlice";

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/70 px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900";
const contactSubjects = ["General enquiry", "Moving quote", "Existing booking", "Feedback or complaint", "Business enquiry", "Other"];
export default function ComplaintForm({ onCreated, onCancel }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector('input[name="name"]')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", subjectOther: "", message: "", supportSource: "phone", bookingReference: "", supportStatus: "new", supportNotes: "" });
  const [error, setError] = useState("");
  const [referenceQuery, setReferenceQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const referenceRelevant = ["Existing booking", "Feedback or complaint"].includes(form.subject);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(referenceQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [referenceQuery]);
  const { currentData: references = [], isFetching: searching, isError: searchError, refetch: retrySearch } = useSearchSupportReferencesQuery(debouncedQuery, { skip: !referenceRelevant || debouncedQuery.length < 2 || !!form.bookingReference });
  const [create, { isLoading }] = useCreateComplaintMutation();
  const change = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value, ...(name === "subject" && !["Existing booking", "Feedback or complaint"].includes(value) ? { bookingReference: "" } : {}) }));
    if (name === "subject") setReferenceQuery("");
  };
  const selectReference = reference => {
    let phone = reference.phone.replace(/\D/g, "");
    if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
    setForm(current => ({ ...current, bookingReference: reference.reference, name: reference.name, phone, email: reference.email || "" }));
    setReferenceQuery("");
  };
  const submit = async event => {
    event.preventDefault();
    setError("");
    if (!form.subject) { setError("Choose an enquiry subject."); return; }
    if (form.subject === "Other" && !form.subjectOther?.trim()) { setError("Please specify the enquiry subject."); return; }
    try { const result = await create({ ...form, name: form.name.trim(), message: form.message.trim(), email: form.email.trim() }).unwrap(); onCreated(result.message); }
    catch (failure) { setError(failure.data?.error || "Could not log the complaint. Please try again."); }
  };
  const handleKeyDown = event => {
    if (event.key === "Escape" && !isLoading) { event.stopPropagation(); onCancel(); }
    if (event.key !== "Tab") return;
    const controls = [...dialogRef.current.querySelectorAll('input, textarea, button, [tabindex="0"]')].filter(element => !element.matches(":disabled") && element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return createPortal(<div className="fixed inset-0 z-[70] bg-white dark:bg-slate-900 sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="complaint-title" aria-describedby="complaint-description" onKeyDown={handleKeyDown} className="bg-white dark:bg-slate-900 w-full h-[100dvh] sm:h-auto sm:max-h-[90dvh] sm:max-w-lg sm:rounded-2xl flex flex-col sm:shadow-2xl sm:border sm:border-slate-200 dark:sm:border-slate-700 overflow-hidden">
    <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900"><div><h2 id="complaint-title" className="text-base font-bold text-slate-900 dark:text-slate-100">Log a customer complaint</h2><p id="complaint-description" className="text-xs text-slate-500 dark:text-slate-400">Capture direct customer contacts and track resolution</p></div><button type="button" onClick={onCancel} disabled={isLoading} aria-label="Close complaint form" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button></div>
    <form onSubmit={submit} className="flex-1 flex flex-col min-h-0 text-xs">
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
      <fieldset disabled={isLoading} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold">Customer name *<input autoFocus name="name" required minLength={2} maxLength={100} value={form.name} onChange={change} className={inputClass} autoComplete="name" placeholder="Enter your full name" /></label>
          <label className="text-xs font-semibold">Phone number *<input name="phone" required pattern="[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number." maxLength={10} inputMode="tel" autoComplete="tel-national" value={form.phone} onChange={change} className={inputClass} placeholder="10-digit mobile number" /></label>
          <label className="text-xs font-semibold sm:col-span-2">Email address *<input name="email" required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={change} className={inputClass} placeholder="you@example.com" /></label>
        </div>
        <label className="block text-xs font-semibold">What can we help with? *<Select name="subject" containerClassName="mt-2" value={form.subject} onChange={change} options={contactSubjects} placeholder="Choose an enquiry subject" disabled={isLoading} required /></label>
        {form.subject === "Other" && <label className="block text-xs font-semibold">Please specify *<input name="subjectOther" required maxLength={200} value={form.subjectOther} onChange={change} className={inputClass} placeholder="e.g. Invoice correction or partnership request" /></label>}
        <label className="block text-xs font-semibold">Your message *<textarea name="message" required minLength={10} maxLength={2000} value={form.message} onChange={change} className={`${inputClass} min-h-28`} placeholder="Tell us how we can help. Include your booking reference or moving details if relevant." /></label>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">Staff tracking</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {referenceRelevant && <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold">Booking or job reference
              {!form.bookingReference && <input maxLength={100} value={referenceQuery} onChange={event => setReferenceQuery(event.target.value)} className={inputClass} placeholder="Search reference, customer name, or phone" autoComplete="off" />}
            </label>
            {form.bookingReference ? <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 p-3 flex items-center justify-between gap-3"><span className="text-xs font-semibold text-brand-800 dark:text-brand-300">{form.bookingReference} · Customer details filled</span><button type="button" onClick={() => { setForm(current => ({ ...current, bookingReference: "" })); setReferenceQuery(""); }} className="text-xs font-semibold text-brand-700 dark:text-brand-300 underline">Change</button></div> : <>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Search jobs and accepted quotations (bookings). Select a result to fill customer details, or leave unlinked if the reference is unknown.</p>
              {searching || referenceQuery.trim() !== debouncedQuery ? <p role="status" className="text-xs text-slate-500 dark:text-slate-400">Searching...</p> : searchError ? <p role="alert" className="text-xs text-rose-600 dark:text-rose-300">Could not search references. <button type="button" className="underline" onClick={retrySearch}>Try again</button></p> : debouncedQuery.length >= 2 && (references.length ? <div aria-label="Matching bookings and jobs" className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">{references.map(reference => <button type="button" key={`${reference.kind}-${reference.reference}`} onClick={() => selectReference(reference)} className="w-full text-left p-3 hover:bg-brand-50 dark:hover:bg-brand-950 focus:bg-brand-50 dark:focus:bg-brand-950 focus:outline-none"><span className="block text-xs font-semibold text-brand-700 dark:text-brand-300">{reference.reference} · {reference.kind === "job" ? "Job" : "Booking"}</span><span className="block mt-1 text-xs text-slate-600 dark:text-slate-300">{reference.name} · {reference.phone}</span><span className="block mt-1 text-[11px] text-slate-400 break-words">{reference.origin} → {reference.destination}</span></button>)}</div> : <p role="status" className="text-xs text-slate-500 dark:text-slate-400">No matching bookings or jobs. Try another reference, name, or phone.</p>)}
            </>}
          </div>}
          <label className="text-xs font-semibold">Contact channel *<Select name="supportSource" containerClassName="mt-2" value={form.supportSource} onChange={change} options={[{ value: "phone", label: "Phone call" }, { value: "whatsapp", label: "WhatsApp" }, { value: "in_person", label: "In person" }, { value: "email", label: "Email" }, { value: "other", label: "Other" }]} disabled={isLoading} /></label>
          <label className="text-xs font-semibold">Status<Select name="supportStatus" containerClassName="mt-2" value={form.supportStatus} onChange={change} options={[{ value: "new", label: "New" }, { value: "in_progress", label: "In progress" }, { value: "resolved", label: "Resolved" }, { value: "closed", label: "Closed" }]} disabled={isLoading} /></label>
          </div>
        </div>
        <label className="block text-xs font-semibold">Internal notes<textarea name="supportNotes" maxLength={10000} value={form.supportNotes} onChange={change} className={`${inputClass} min-h-24`} placeholder="Optional follow-up actions or resolution details for staff." /></label>
      </fieldset>
      {error && <p role="alert" className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3 text-xs text-rose-700 dark:text-rose-300">{error}</p>}
      </div>
      <div className="shrink-0 flex justify-end gap-2 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pb-[max(1rem,env(safe-area-inset-bottom))]"><button type="button" disabled={isLoading} onClick={onCancel} className="flex-1 sm:flex-initial rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer disabled:opacity-50">Cancel</button><button disabled={isLoading} className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50">{isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}{isLoading ? "Saving..." : "Save complaint"}</button></div>
    </form>
  </section></div>, document.body);
}


