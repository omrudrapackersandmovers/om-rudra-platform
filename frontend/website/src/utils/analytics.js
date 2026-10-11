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

export function trackPage(pathname) {
  if (!["omrudrapackersandmovers.com", "www.omrudrapackersandmovers.com"].includes(window.location.hostname)) return;
  if (window[`ga-disable-${measurementId}`] || readConsent() !== "accepted") return;
  // Never send query parameters, fragments, search terms or arbitrary user paths.
  const page = indexablePaths.includes(pathname) ? pathname : "/404";
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
