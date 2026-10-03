import { Link } from "react-router";

/**
 * Button — unified brand button component tailored to our design system.
 *
 * Features:
 * - Geometric pill shape with crisp borders and multi-layered shadows
 * - Smooth hover scale and interactive arrow shift
 * - Signature light-sweep shine animation on hover
 * - Polymorphic: renders as a React Router <Link> when `to` is passed, or as a native <button>
 */
const Button = ({
  children,
  to,
  href,
  type = "button",
  onClick,
  disabled = false,
  variant = "accent", // "accent" | "primary" | "outline" | "ghost"
  size = "md", // "sm" | "md" | "lg"
  showArrow = true,
  icon,
  className = "",
  ...props
}) => {
  // Base sizing classes
  const sizeClasses = {
    sm: "px-4 py-2 text-xs gap-2",
    md: "px-6 py-3 text-sm sm:text-base gap-2.5",
    lg: "px-8 py-4 text-base sm:text-lg gap-3",
  }[size] || "px-6 py-3 text-sm sm:text-base gap-2.5";

  // Variant color & shadow classes
  const variantClasses = {
    accent:
      "bg-accent text-accent-foreground border-2 border-white/60 shadow-[0_8px_22px_rgba(245,166,35,0.32)] hover:border-white/90 active:shadow-sm",
    primary:
      "bg-primary text-white border-2 border-white/25 shadow-[0_8px_22px_rgba(32,58,100,0.28)] hover:border-white/50 active:shadow-sm",
    outline:
      "bg-background text-text border-2 border-border shadow-sm hover:border-primary/40 hover:bg-surface active:shadow-none",
    ghost:
      "bg-transparent text-text border-2 border-border/80 hover:bg-surface hover:border-primary/40 active:shadow-none",
  }[variant] || "bg-accent text-accent-foreground border-2 border-white/60 shadow-[0_8px_22px_rgba(245,166,35,0.32)]";

  const combinedClasses = `
    group inline-flex items-center justify-center font-display font-bold rounded-full
    transition-all duration-300 ease-out cursor-pointer select-none text-center
    shine-sweep hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none
    ${sizeClasses}
    ${variantClasses}
    ${className}
  `.trim().replace(/\s+/g, " ");

  const content = (
    <>
      <span className="truncate">{children}</span>
      {icon ? (
        <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      ) : showArrow ? (
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5 shrink-0"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
            fillRule="evenodd"
          />
        </svg>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
