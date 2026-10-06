import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Custom Reusable Select Component
 * Sleek, fully-styled dropdown replacing native HTML <select>.
 *
 * Guarantees consistent min-height (42px), padding, border-radius, and text sizing
 * matching text inputs across the admin panel.
 */
export const Select = ({
  value,
  onChange,
  options,
  children,
  placeholder = "Select an option...",
  disabled = false,
  required = false,
  name,
  id,
  className = "",
  buttonClassName = "",
  containerClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  // Parse options from either `options` prop or `children`
  const parsedOptions = useMemo(() => {
    if (options && Array.isArray(options)) {
      return options.map((opt) => {
        if (typeof opt === "object" && opt !== null) {
          return {
            value: opt.value !== undefined ? opt.value : (opt.id !== undefined ? opt.id : ""),
            label: opt.label !== undefined ? opt.label : (opt.name !== undefined ? opt.name : String(opt.value ?? "")),
            disabled: Boolean(opt.disabled),
            icon: opt.icon,
            description: opt.description,
          };
        }
        return {
          value: String(opt),
          label: String(opt),
          disabled: false,
        };
      });
    }

    if (children) {
      const list = [];
      const extractOptions = (node) => {
        React.Children.forEach(node, (child) => {
          if (!child) return;
          if (Array.isArray(child)) {
            extractOptions(child);
            return;
          }
          if (React.isValidElement(child)) {
            if (child.type === "optgroup" && child.props.children) {
              extractOptions(child.props.children);
            } else if (child.props) {
              list.push({
                value: child.props.value !== undefined ? child.props.value : child.props.children,
                label: child.props.children !== undefined ? child.props.children : String(child.props.value ?? ""),
                disabled: Boolean(child.props.disabled),
              });
            }
          }
        });
      };
      extractOptions(children);
      return list;
    }

    return [];
  }, [options, children]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return parsedOptions.find((opt) => String(opt.value) === String(value));
  }, [parsedOptions, value]);

  // Toggle open and detect positioning relative to viewport & scrollable containers
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let spaceBelow = window.innerHeight - rect.bottom;
      let spaceAbove = rect.top;

      let parent = buttonRef.current.parentElement;
      while (parent && parent !== document.body) {
        const overflow = window.getComputedStyle(parent).overflowY;
        if (overflow === "auto" || overflow === "scroll") {
          const parentRect = parent.getBoundingClientRect();
          spaceBelow = Math.min(spaceBelow, parentRect.bottom - rect.bottom);
          spaceAbove = Math.min(spaceAbove, rect.top - parentRect.top);
          break;
        }
        parent = parent.parentElement;
      }

      setOpenUpwards(spaceBelow < 220 && spaceAbove > spaceBelow);
      const idx = parsedOptions.findIndex((opt) => String(opt.value) === String(value));
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
    setIsOpen((prev) => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex];
      if (item && item.scrollIntoView) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Select an option
  const handleSelect = (option) => {
    if (option.disabled) return;
    setIsOpen(false);
    if (onChange) {
      const syntheticEvent = {
        target: { name: name || "", value: option.value },
        currentTarget: { name: name || "", value: option.value },
        value: option.value,
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent, option.value);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
      } else if (highlightedIndex >= 0 && highlightedIndex < parsedOptions.length) {
        handleSelect(parsedOptions[highlightedIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
      } else {
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < parsedOptions.length && parsedOptions[next].disabled) {
            next++;
          }
          return next < parsedOptions.length ? next : prev;
        });
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
      } else {
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && parsedOptions[next].disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
      }
      return;
    }

    if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  // Computed classes to guarantee consistent height, radius, padding and font
  const hasBg = buttonClassName.includes("bg-");
  const hasBorder = buttonClassName.includes("border-");
  const defaultBg = hasBg ? "" : "bg-white dark:bg-slate-900";
  const defaultBorder = isOpen
    ? "ring-2 ring-brand-600 border-brand-600"
    : hasBorder
    ? ""
    : "border-slate-300 dark:border-slate-600 hover:border-slate-400";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full text-left ${containerClassName || className}`}
      {...restProps}
    >
      {/* Hidden input for HTML5 required form validation */}
      {required && (
        <input
          type="text"
          tabIndex={-1}
          required={required}
          value={value ?? ""}
          onChange={() => {}}
          className="sr-only"
          aria-hidden="true"
        />
      )}

      {/* Trigger Button with guaranteed min-height and padding */}
      <button
        ref={buttonRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[42px] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-normal transition-all duration-150 select-none cursor-pointer flex items-center justify-between gap-2 border text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 disabled:opacity-60 disabled:cursor-not-allowed ${defaultBg} ${defaultBorder} ${buttonClassName}`}
      >
        <span className={`truncate text-left flex-1 ${!selectedOption && !value ? "text-slate-400" : ""}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span>{selectedOption.label}</span>
            </span>
          ) : value !== undefined && value !== "" ? (
            String(value)
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-600 dark:text-brand-300" : ""
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={`absolute left-0 right-0 z-[100] min-w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-100 ${
            openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } ${dropdownClassName}`}
        >
          {parsedOptions.length === 0 ? (
            <div className="px-3.5 py-2.5 text-xs text-slate-400 text-center">
              No options available
            </div>
          ) : (
            parsedOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={`${opt.value}-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => !opt.disabled && setHighlightedIndex(idx)}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer transition-colors select-none ${
                    opt.disabled
                      ? "opacity-40 cursor-not-allowed text-slate-400"
                      : isSelected
                      ? "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold"
                      : isHighlighted
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
                  } ${optionClassName}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <div className="truncate">
                      <div>{opt.label}</div>
                      {opt.description && (
                        <div className="text-[11px] text-slate-400 font-normal truncate">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-brand-600 dark:text-brand-300 shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export const Option = ({ value, children, disabled, ...props }) => null;
Select.Option = Option;

export default Select;
