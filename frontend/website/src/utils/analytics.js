import { indexablePaths, siteUrl } from "../data/site.js";

export const measurementId = "G-89HGJ92WHV";
export const consentKey = "om-rudra-analytics-consent";
let configured = false;
let previousPage = "";

export function readConsent() {
  try { return window.localStorage.getItem(consentKey); } catch { return null; }
}

export function setConsent(value) {
  try { window.localStorage.setItem(consentKey, value); } catch { /* Session choice still works. */ }
  window[`ga-disable-${measurementId}`] = value !== "accepted";
  if (value !== "accepted") {
    previousPage = "";
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ["", "; domain=omrudrapackersandmovers.com", "; domain=.omrudrapackersandmovers.com"]) {
        document.cookie = `${name}=; max-age=0; path=/${domain}; SameSite=Lax; Secure`;
      }
    }
  }
}

export function trackPage(pathname, { confirmedQuote = false } = {}) {
  if (pathname === "/quote-received" && !confirmedQuote) return;
  if (!["omrudrapackersandmovers.com", "www.omrudrapackersandmovers.com"].includes(window.location.hostname)) return;
  if (window[`ga-disable-${measurementId}`] || readConsent() !== "accepted") return;
  // Never send query parameters, fragments, search terms or arbitrary user paths.
  const page = indexablePaths.includes(pathname) || (pathname === "/quote-received" && confirmedQuote) ? pathname : "/404";
  if (page === previousPage) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!configured) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      page_location: `${siteUrl}${page}`,
      page_referrer: "",
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement("script");
    script.id = "google-analytics-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    configured = true;
  }
  window.gtag("event", "page_view", {
    page_location: `${siteUrl}${page}`,
    page_referrer: previousPage ? `${siteUrl}${previousPage}` : "",
    page_title: page === "/" ? "Home" : page.slice(1).replaceAll("-", " "),
  });
  previousPage = page;
}

// Only fixed event names and labels cross the analytics boundary. Never pass form data.
export function trackEnquiry(eventName, source) {
  const sources = {
    generate_lead: ["moving_quote", "contact_enquiry"],
    click_to_call: ["website"],
    click_whatsapp: ["website"],
  };
  if (!sources[eventName]?.includes(source)) return;
  if (typeof window === "undefined" || readConsent() !== "accepted") return;
  if (window[`ga-disable-${measurementId}`]) return;
  try {
    trackPage(window.location.pathname);
    if (!configured || typeof window.gtag !== "function") return;
    const page = indexablePaths.includes(window.location.pathname) ? window.location.pathname : "/404";
    window.gtag("event", eventName, {
      lead_source: source,
      page_location: `${siteUrl}${page}`,
      page_referrer: "",
      transport_type: "beacon",
    });
  } catch { /* Optional measurement must never interrupt an enquiry or contact link. */ }
}
