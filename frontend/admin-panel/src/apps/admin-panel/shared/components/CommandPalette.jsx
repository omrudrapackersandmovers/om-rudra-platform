import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  UserCheck,
  FileSpreadsheet,
  Truck,
  TrendingUp,
  Receipt,
  FileText,
  Users,
  Settings,
  Plus,
  ArrowRight,
  ExternalLink,
  Phone,
  Briefcase,
} from "lucide-react";
import { useGetLeadsQuery } from "../../../../store/apiSlices/leadsApiSlice";
import { useGetQuotesQuery } from "../../../../store/apiSlices/quotesApiSlice";
import { useGetJobsQuery } from "../../../../store/apiSlices/jobsApiSlice";
import { useGetInvoicesQuery } from "../../../../store/apiSlices/invoicesApiSlice";

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Prefetch data for instant searching
  const { data: leads = [] } = useGetLeadsQuery({}, { skip: !isOpen });
  const { data: quotes = [] } = useGetQuotesQuery({}, { skip: !isOpen });
  const { data: jobs = [] } = useGetJobsQuery({}, { skip: !isOpen });
  const { data: invoices = [] } = useGetInvoicesQuery({}, { skip: !isOpen });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Quick navigation pages with relevant specific icons
  const navItems = [
    { title: "Inquiries & Leads", category: "Navigation", path: "/leads", icon: UserCheck },
    { title: "Quotations & Estimates", category: "Navigation", path: "/quotes", icon: FileSpreadsheet },
    { title: "Active Jobs & Dispatch", category: "Navigation", path: "/jobs", icon: Briefcase },
    { title: "Fleet Management", category: "Navigation", path: "/fleet", icon: Truck },
    { title: "Crew & Team", category: "Navigation", path: "/team", icon: Users },
    { title: "Revenue & Finance", category: "Navigation", path: "/finance", icon: TrendingUp },
    { title: "Tax Invoices & Billing", category: "Navigation", path: "/invoices", icon: Receipt },
    { title: "Highway Bilties (LR)", category: "Navigation", path: "/bilties", icon: FileText },
    { title: "System Settings", category: "Navigation", path: "/settings", icon: Settings },
  ];

  // Quick action shortcuts with relevant document/billing icons instead of generic plus
  const actionItems = [
    { title: "Create New Quotation", category: "Quick Action", path: "/quotes/new", icon: FileSpreadsheet },
    { title: "Generate Tax Invoice", category: "Quick Action", path: "/invoices/new", icon: Receipt },
    { title: "New Consignment Note (Bilty)", category: "Quick Action", path: "/bilties/new", icon: FileText },
  ];

  // Search filtered results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...actionItems, ...navItems.slice(0, 4)];
    }

    const results = [];

    // Search Leads
    leads.forEach((l) => {
      const match =
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)) ||
        (l.movingFrom && l.movingFrom.toLowerCase().includes(q)) ||
        (l.movingTo && l.movingTo.toLowerCase().includes(q));
      if (match) {
        results.push({
          id: `lead-${l.id}`,
          title: l.name,
          subtitle: `Lead #${l.id} • +91 ${l.phone} (${l.movingFrom || "Local"} → ${l.movingTo || "Local"})`,
          category: "Leads",
          path: `/leads/${l.id}`,
          icon: UserCheck,
        });
      }
    });

    // Search Quotes
    quotes.forEach((item) => {
      const match =
        (item.quoteNumber && item.quoteNumber.toLowerCase().includes(q)) ||
        (item.customerName && item.customerName.toLowerCase().includes(q)) ||
        (item.customerPhone && item.customerPhone.includes(q));
      if (match) {
        results.push({
          id: `quote-${item.id}`,
          title: item.customerName,
          subtitle: `Quote #${item.quoteNumber || item.id} • ₹${(Number(item.totalAmount) || 0).toLocaleString("en-IN")}`,
          category: "Quotations",
          path: `/quotes/${item.id}`,
          icon: FileSpreadsheet,
        });
      }
    });

    // Search Jobs
    jobs.forEach((j) => {
      const match =
        (j.jobNumber && j.jobNumber.toLowerCase().includes(q)) ||
        (j.customerName && j.customerName.toLowerCase().includes(q)) ||
        (j.customerPhone && j.customerPhone.includes(q));
      if (match) {
        results.push({
          id: `job-${j.id}`,
          title: j.customerName,
          subtitle: `Job #${j.jobNumber || j.id} • Status: ${j.status}`,
          category: "Jobs",
          path: `/jobs/${j.id}`,
          icon: Briefcase,
        });
      }
    });

    // Search Invoices
    invoices.forEach((inv) => {
      const match =
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
        (inv.customerPhone && inv.customerPhone.includes(q));
      if (match) {
        results.push({
          id: `inv-${inv.id}`,
          title: inv.customerName,
          subtitle: `Invoice #${inv.invoiceNumber || inv.id} • ₹${(Number(inv.grandTotal) || 0).toLocaleString("en-IN")}`,
          category: "Invoices",
          path: `/invoices/${inv.id}`,
          icon: Receipt,
        });
      }
    });

    // Search Navigation
    navItems.forEach((n) => {
      if (n.title.toLowerCase().includes(q)) {
        results.push(n);
      }
    });

    return results.slice(0, 8);
  }, [query, leads, quotes, jobs, invoices]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          navigate(searchResults[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 sm:pt-20 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search leads, quotes, jobs, invoices, or type a page..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-400">Try searching by customer name, phone number, or job reference</p>
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const Icon = item.icon || ArrowRight;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || item.path}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "bg-blue-50 text-blue-900 font-medium" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate leading-snug">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                      isSelected
                        ? "bg-blue-200/60 text-blue-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>•</span>
            <span>↵ Select</span>
            <span>•</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center font-medium text-slate-400">
            <span>Instant Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
