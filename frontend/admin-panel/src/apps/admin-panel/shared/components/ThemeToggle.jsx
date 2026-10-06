import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../../store/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  const Icon = theme === "dark" ? Sun : Moon;
  return <button type="button" onClick={toggleTheme} aria-label={label} title={label}
    className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 cursor-pointer">
    <Icon className="h-4 w-4" aria-hidden="true" />
  </button>;
}
