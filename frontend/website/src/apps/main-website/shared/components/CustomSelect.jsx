import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomSelect — accessible, single-border custom dropdown.
 * Eliminates browser-native dropdown quirks, double borders, and harsh default outlines.
 */
const CustomSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listboxRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(options.length - 1);
      } else {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && focusedIndex >= 0 && focusedIndex < options.length) {
        onChange(options[focusedIndex]);
        setIsOpen(false);
      } else {
        setIsOpen((prev) => !prev);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-text tracking-wide flex items-center justify-between"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>
            {label} {required && <span className="text-danger ml-0.5" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? undefined : id}
        className={`w-full flex items-center justify-between px-4 py-3.5 text-left bg-background rounded-[var(--radius-md)] border transition-all duration-150 cursor-pointer select-none text-[0.95rem] ${
          error
            ? "border-danger ring-4 ring-danger/10"
            : isOpen
            ? "border-primary ring-4 ring-primary/10 shadow-sm"
            : "border-border hover:border-text-muted/60"
        }`}
      >
        <span className={`block truncate ${value ? "text-text font-medium" : "text-text-muted"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-text-muted"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Options Menu */}
      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          className="absolute top-full left-0 right-0 mt-2 z-50 py-1.5 bg-background border border-border rounded-[var(--radius-md)] shadow-xl max-h-64 overflow-y-auto focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {options.map((option, index) => {
            const isSelected = value === option;
            const isFocused = focusedIndex === index;

            return (
              <div
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-colors duration-100 ${
                  isSelected
                    ? "bg-surface text-primary font-semibold"
                    : isFocused
                    ? "bg-surface/70 text-text"
                    : "text-text hover:bg-surface"
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && (
                  <Check size={16} strokeWidth={2.5} className="text-primary shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error text */}
      {error && (
        <p className="text-xs font-medium text-danger mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
