import { useCallback, useEffect, useState } from "react";
import { api } from "../../../../util/api";

const labels = { queued: "Waiting to send", sending: "Sending", accepted: "Accepted by email service", failed: "Failed", skipped: "Skipped", uncertain: "Needs review" };
export default function EmailActivity() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const refresh = useCallback(async () => {
    setBusy(true);
    try { setData(await api.get("/emails")); setError(""); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => {
    let active = true;
    api.get("/emails").then(result => { if (active) setData(result); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);
  const retry = async id => {
    setBusy(true);
    try { await api.post(`/emails/${id}/retry`, {}); await refresh(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <section className="space-y-5" aria-label="Email activity">
    <div className="flex items-center justify-between gap-4">
      <div><h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Automatic customer emails</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enquiries, estimates, bookings, invoices, payments, and support updates.</p></div>
      <button type="button" disabled={busy} onClick={refresh} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold disabled:opacity-50">{busy ? "Loading…" : "Refresh"}</button>
    </div>
    {error && <p role="alert" className="text-sm text-red-600 dark:text-red-300">{error}</p>}
    {data && <>
      {(!data.enabled || !data.providerConfigured) && <p className="rounded-xl bg-amber-50 dark:bg-amber-950 p-4 text-sm text-amber-800 dark:text-amber-200">Email sending is paused or the email service key is missing. Pending messages remain saved for retry.</p>}
      <p className="text-sm text-slate-500 dark:text-slate-400">Accepted means the email service received the message; it does not confirm inbox delivery. For items needing review, check the provider log before resending.</p>
      <div className="flex flex-wrap gap-2">{data.counts.map(item => <span key={item.status} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs">{labels[item.status]}: <strong>{item.count}</strong></span>)}</div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">{data.emails.length === 0 ? <p className="py-8 text-sm text-slate-500">No lifecycle emails yet. New activity will appear here.</p> : data.emails.map(email => <article key={email.id} className="flex flex-wrap justify-between gap-3 py-4">
        <div className="min-w-0"><p className="text-sm font-semibold capitalize">{email.kind.replaceAll("_", " ")} <span className="text-xs font-normal text-slate-500">#{email.entity_id}</span></p><p className="break-all text-xs text-slate-500 dark:text-slate-400">{email.recipient || "Company notification inbox"}</p><p className="mt-1 text-xs text-slate-500">{new Date(email.created_at * 1000).toLocaleString()} · Attempts: {email.attempts}</p>{email.last_error && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{email.last_error.replaceAll("_", " ")}</p>}</div>
        <div className="flex items-center gap-3"><span className={`text-xs font-semibold ${["failed", "uncertain"].includes(email.status) ? "text-red-600 dark:text-red-300" : "text-slate-600 dark:text-slate-300"}`}>{labels[email.status]}</span>{Boolean(email.can_retry) && <button type="button" disabled={busy} onClick={() => retry(email.id)} className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Retry</button>}</div>
      </article>)}</div>
    </>}
  </section>;
}
