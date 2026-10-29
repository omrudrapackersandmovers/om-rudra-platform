import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { readConsent, setConsent, trackPage, trackEnquiry } from "../../../../utils/analytics.js";

export default function AnalyticsConsent() {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState(undefined);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    Promise.resolve(readConsent()).then(setChoice);
    const openPreferences = () => setEditing(true);
    window.addEventListener("open-analytics-preferences", openPreferences);
    return () => window.removeEventListener("open-analytics-preferences", openPreferences);
  }, []);
  useEffect(() => {
    if (choice === "accepted") trackPage(pathname);
  }, [choice, pathname]);
  useEffect(() => {
    const onContactClick = event => {
      const link = event.target?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (/^tel:/i.test(href)) trackEnquiry("click_to_call", "website");
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(href)) trackEnquiry("click_whatsapp", "website");
    };
    document.addEventListener("click", onContactClick, true);
    return () => document.removeEventListener("click", onContactClick, true);
  }, []);
  const choose = value => {
    setConsent(value);
    setChoice(value);
    setEditing(false);
  };
  if (choice === undefined) return null;
  if (choice && !editing) return null;
  return <section aria-label="Analytics cookie preferences" className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-2xl rounded-2xl border border-border bg-background p-5 shadow-xl sm:p-6">
    <h2 className="font-display font-semibold text-lg">Help us improve your moving experience</h2>
    <p className="mt-2 text-sm text-text-muted">With your permission, we use Google Analytics cookies to understand page visits, successful moving enquiries and call or WhatsApp clicks. Your choice does not affect enquiries or bookings. <Link to="/privacy#cookies" className="text-primary underline">Read our privacy policy</Link>.</p>
    <div className="mt-4 flex flex-wrap gap-3"><button onClick={() => choose("accepted")} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Accept analytics</button><button onClick={() => choose("declined")} className="rounded-full border border-border px-5 py-3 text-sm font-semibold">Decline analytics</button></div>
  </section>;
}
