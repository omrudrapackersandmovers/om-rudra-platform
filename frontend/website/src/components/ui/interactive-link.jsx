import { Link } from "react-router";

/**
 * InteractiveLink — Reusable animated action link / button.
 *
 * Features:
 * - Expanding underline animation on hover (left to right)
 * - Text color sweep overlay on hover (left to right)
 * - Arrow translation and color shift on hover
 * - Supports React Router `to`, standard `href`, or `onClick` button.
 * - Themed with brand navy (#203a64) and brand gold (#f5a623).
 */
export default function InteractiveLink({
  to,
  href,
  onClick,
  children,
  className = "",
  size = "md",
  primaryColor = "var(--color-primary, #203a64)",
  hoverColor = "var(--color-accent, #f5a623)",
  ...props
}) {
  const content = (
    <>
      <span className="relative inline-block whitespace-nowrap">
        {/* Base text */}
        <span
          className="transition-colors duration-200"
          style={{ color: primaryColor }}
        >
          {children}
        </span>

        {/* Sliding color sweep text */}
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap w-0 group-hover:w-full transition-all duration-300 ease-out select-none pointer-events-none"
          style={{ color: hoverColor }}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>

      {/* Arrow SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 transition-all duration-200 ease-out group-hover:translate-x-1 shrink-0"
        style={{ color: primaryColor }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>

      {/* Expanding underline */}
      <span
        className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
        style={{ backgroundColor: hoverColor }}
      />
    </>
  );

  const sizeClasses = {
    sm: "text-xs gap-1.5 font-semibold",
    md: "text-sm gap-2 font-bold",
    lg: "text-base gap-2.5 font-bold",
  }[size] || "text-sm gap-2 font-bold";

  const sharedClasses = `group relative inline-flex items-center cursor-pointer select-none py-1 focus:outline-none transition-colors duration-200 ${sizeClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={sharedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={sharedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={sharedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
