import { MapPin, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { company } from "../../../../../data/company";

/**
 * TrustBar — verified operational metrics and service standards.
 * Designed with elevated card structure, dedicated icon containers,
 * high-contrast typography, and smooth micro-interactions.
 */
const TrustBar = () => {
  const { stats } = company;

  const trustCards = [
    {
      icon: MapPin,
      value: `${stats?.districtsServed ?? 50}`,
      suffix: "+",
      title: "Districts Covered",
      description:
        "Direct company hub network across Bihar, Jharkhand, and North India.",
      highlight: "Direct Hubs",
    },
    {
      icon: Truck,
      value: `${stats?.statesServed ?? 6}`,
      suffix: " States",
      title: "Core Moving Corridors",
      description:
        "Dedicated inter-state routes across Bihar, Jharkhand, UP, Delhi NCR & WB.",
      highlight: "Daily Routes",
    },
    {
      icon: ShieldCheck,
      value: "100",
      suffix: "%",
      title: "Dedicated Sealed Trucks",
      description:
        "Enclosed container vehicles with zero co-loading or mixing of belongings.",
      highlight: "Zero Co-loading",
    },
    {
      icon: CheckCircle2,
      value: "Fixed",
      suffix: "",
      title: "Upfront Price Guarantee",
      description:
        "Itemized written estimates before your move with zero hidden cost surprises.",
      highlight: "Zero Hidden Fees",
    },
  ];

  return (
    <section
      className="bg-surface/70 border-b border-border/80 py-10 sm:py-14 relative"
      aria-label="Verified operational standards"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 4-Card Elevated Trust Grid ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {trustCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-[var(--radius-lg)] bg-background border border-border shadow-xs hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top: Icon Badge & Highlight Pill */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors duration-200 shadow-xs">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <span className="text-[11px] font-bold text-text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
                    {card.highlight}
                  </span>
                </div>

                {/* Metric Display */}
                <div className="mb-2">
                  <div className="font-display font-extrabold text-text tracking-tight flex items-baseline gap-1" style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1.1 }}>
                    <span className="text-primary">{card.value}</span>
                    {card.suffix && (
                      <span className="text-accent text-xl sm:text-2xl font-bold">
                        {card.suffix}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-text mb-1.5 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TrustBar;
