import { useSyncExternalStore } from "react";

const storageKey = "om-rudra-admin-theme";
const listeners = new Set();
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let preference;
try { preference = localStorage.getItem(storageKey); } catch { /* Storage can be unavailable. */ }
let theme = preference === "dark" || preference === "light" ? preference : systemTheme.matches ? "dark" : "light";

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  listeners.forEach(listener => listener());
}
applyTheme();
systemTheme.addEventListener("change", () => {
  if (preference !== "light" && preference !== "dark") {
    theme = systemTheme.matches ? "dark" : "light";
    applyTheme();
  }
});
window.addEventListener("storage", event => {
  if (event.key !== storageKey && event.key !== null) return;
  preference = event.newValue;
  theme = preference === "dark" || preference === "light" ? preference : systemTheme.matches ? "dark" : "light";
  applyTheme();
});

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function useTheme() {
  const currentTheme = useSyncExternalStore(subscribe, () => theme);
  return { theme: currentTheme, toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    preference = theme;
    try { localStorage.setItem(storageKey, theme); } catch { /* Keep the session preference. */ }
    applyTheme();
  } };
}
