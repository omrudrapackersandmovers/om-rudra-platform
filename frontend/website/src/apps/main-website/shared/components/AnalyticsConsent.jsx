import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { readConsent, setConsent, trackPage } from "../../../../utils/analytics.js";

export default function AnalyticsConsent() {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState(undefined);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    Promise.resolve(readConsent()).then(setChoice);
  }, []);
  useEffect(() => {
    if (choice === "accepted") trackPage(pathname);
  }, [choice, pathname]);
  const choose = value => {
    setConsent(value);
    setChoice(value);
    setEditing(false);
  };
  if (choice === undefined) return null;
  if (choice && !editing) return <button onClick={() => setEditing(true)} className="fixed bottom-2 left-2 z-40 rounded-full border border-border bg-background px-3 py-2 text-xs text-text-muted shadow-sm">Cookie settings</button>;
  return <section aria-label="Analytics cookie preferences" className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-2xl rounded-2xl border border-border bg-background p-5 shadow-xl sm:p-6">
    <h2 className="font-display font-semibold text-lg">Help us improve your moving experience</h2>
    <p className="mt-2 text-sm text-text-muted">With your permission, we use Google Analytics cookies to understand which pages are useful. Your choice does not affect enquiries or bookings. <Link to="/privacy#cookies" className="text-primary underline">Read our privacy policy</Link>.</p>
    <div className="mt-4 flex flex-wrap gap-3"><button onClick={() => choose("accepted")} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Accept analytics</button><button onClick={() => choose("declined")} className="rounded-full border border-border px-5 py-3 text-sm font-semibold">Decline analytics</button></div>
  </section>;
}
