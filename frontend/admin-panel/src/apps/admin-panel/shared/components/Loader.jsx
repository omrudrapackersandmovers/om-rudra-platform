import React from "react";
import { Loader2, Truck } from "lucide-react";
import { companyConfig } from "../../../../configs/company.config";

/**
 * Enterprise Logistics Loader Component
 * Supports multiple presentation variants:
 * - 'fullscreen': Full viewport overlay, ideal for auth checks and initial app bootstrap
 * - 'page': Centered within the main view panel with branded card
 * - 'inline': Compact spinner for buttons, inline rows, or card headers
 * - 'card': Skeleton/card placeholder for data grids
 */
const Loader = ({
  variant = "page",
  message = "Loading operations...",
  subtext,
  size = "md",
  showLogo = true,
  className = "",
}) => {
  // Inline compact variant
  if (variant === "inline") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 text-slate-500 font-medium text-xs ${className}`}
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        {message && <span>{message}</span>}
      </div>
    );
  }

  // Card / Table container variant
  if (variant === "card") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs ${className}`}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Truck className="w-2.5 h-2.5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{message}</p>
          {subtext && <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>}
        </div>
      </div>
    );
  }

  // Fullscreen / Page centered variant
  const isFullscreen = variant === "fullscreen";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-slate-50/90 backdrop-blur-xs p-6"
          : "min-h-[50vh] w-full p-8"
      } ${className}`}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-sm w-full text-center flex flex-col items-center space-y-4">
        {/* Animated Brand / Logo badge */}
        {showLogo && (
          <div className="relative flex items-center justify-center">
            {/* Spinning decorative ring */}
            <div className="absolute inset-0 -m-3 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            
            {/* Inner Brand Avatar / Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 p-2.5 flex items-center justify-center shadow-md relative z-10">
              <img
                src={companyConfig.logo.primary}
                alt={companyConfig.name}
                className="w-full h-full object-contain filter brightness-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div className="logo-fallback hidden font-black text-amber-400 text-base tracking-tighter">
                1OM
              </div>
            </div>
          </div>
        )}

        {/* Status text */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            {message}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs">
            {subtext || "Please wait while we synchronize your operations workspace."}
          </p>
        </div>

        {/* Animated Progress Dots Bar */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
