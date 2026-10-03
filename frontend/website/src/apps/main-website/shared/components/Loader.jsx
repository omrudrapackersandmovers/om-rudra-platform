import { Truck } from "lucide-react";
import { company } from "@/data/company";

const Loader = ({
  text = "Loading verified relocation services...",
  fullScreen = false,
  size = "md",
  className = "",
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    : "min-h-[40vh] flex items-center justify-center p-8";

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm px-4">
        {/* Animated Brand Truck & Radar Pulse */}
        <div className="relative flex items-center justify-center">
          {/* Concentric Pulse Rings */}
          <div className="absolute w-20 h-20 rounded-full bg-primary/15 animate-ping duration-1000 pointer-events-none" />
          <div className="absolute w-16 h-16 rounded-full bg-accent/20 animate-pulse duration-700 pointer-events-none" />

          {/* Central Logo / Icon Badge */}
          <div className="relative w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 border-2 border-white/20 flex items-center justify-center">
            {company.logo?.icon ? (
              <img
                src={company.logo.icon}
                alt={company.brandName}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Truck size={26} className="text-accent animate-pulse" />
            )}
          </div>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-44 h-1.5 rounded-full bg-surface border border-border/80 overflow-hidden relative">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-[shimmer_1.4s_infinite_linear] -translate-x-full" />
        </div>

        {/* Loading Message & Brand Tagline */}
        <div className="space-y-1">
          <p className="font-display font-bold text-sm text-text">
            {company.brandName}
          </p>
          <p className="text-xs text-text-muted">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
