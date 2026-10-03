import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
  Inbox,
  FileSpreadsheet,
  Truck,
  Receipt,
  FileText,
  LogOut,
  ShieldCheck,
  PanelLeft,
  X,
  ChevronRight,
  ExternalLink,
  Settings,
  Users,
  TrendingUp,
  Menu,
  Search,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { companyConfig } from "../../configs/company.config";
import CommandPalette from "./shared/components/CommandPalette";
import { useGetLeadsQuery } from "../../store/apiSlices/leadsApiSlice";
import { useGetJobsQuery } from "../../store/apiSlices/jobsApiSlice";

const AdminPanelLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar toggle: expanded (w-64) vs collapsed icon rail (w-16)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(() => {
    return localStorage.getItem("admin_sidebar_open") !== "false";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Live queries for navigation notification badges
  const { data: leads = [] } = useGetLeadsQuery({});
  const { data: jobs = [] } = useGetJobsQuery({});
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const activeJobsCount = jobs.filter((j) => j.status === "scheduled" || j.status === "in_transit").length;

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_open", String(next));
      return next;
    });
  };

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen((prev) => !prev);
    } else {
      toggleDesktopSidebar();
    }
  };

  // Keyboard shortcut Ctrl+B (sidebar) and Ctrl+K (command palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggle();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navSections = [
    {
      title: "Sales Pipeline",
      items: [
        { to: "/leads", label: "Leads", icon: Inbox },
        { to: "/quotes", label: "Quotes", icon: FileSpreadsheet },
      ],
    },
    {
      title: "Operations & Fleet",
      items: [
        { to: "/jobs", label: "Jobs", icon: Truck },
        { to: "/fleet", label: "Fleet", icon: Truck },
        { to: "/team", label: "Team", icon: Users },
      ],
    },
    {
      title: "Finance & Accounts",
      items: [
        { to: "/finance", label: "Finance", icon: TrendingUp },
        { to: "/invoices", label: "Invoices", icon: Receipt },
        { to: "/bilties", label: "Bilty (LR)", icon: FileText },
      ],
    },
    {
      title: "Configuration",
      items: [
        { to: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const mobileBottomNavItems = [
    { to: "/leads", label: "Leads", icon: Inbox },
    { to: "/quotes", label: "Quotes", icon: FileSpreadsheet },
    { to: "/jobs", label: "Jobs", icon: Truck },
    { to: "/fleet", label: "Fleet", icon: Truck },
    { to: "/finance", label: "Finance", icon: TrendingUp },
    { to: "/invoices", label: "Invoices", icon: Receipt },
  ];

  // Helper to get active page title & breadcrumbs
  const getPageInfo = () => {
    const p = location.pathname;
    if (p.startsWith("/leads")) return { title: "Inquiries & Leads", category: "Sales", desc: "Real-time web requests & customer calls" };
    if (p.startsWith("/quotes")) return { title: "Quotations", category: "Sales", desc: "Estimates & rate quotes issued" };
    if (p.startsWith("/jobs")) return { title: "Active Jobs & Moves", category: "Operations", desc: "Scheduled relocations, dispatch & crew assignment" };
    if (p.startsWith("/fleet")) return { title: "Fleet Management", category: "Operations", desc: "Vehicles, maintenance & document expiries" };
    if (p.startsWith("/team")) return { title: "Crew & Team", category: "Operations", desc: "Drivers, packers, loaders & daily attendance" };
    if (p.startsWith("/finance")) return { title: "Financial Overview", category: "Finance", desc: "Revenue collections, payroll & move profitability" };
    if (p.startsWith("/invoices")) return { title: "Billing & Invoices", category: "Finance", desc: "Tax invoices, customer payments & balance ledger" };
    if (p.startsWith("/bilties")) return { title: "Consignment Notes (LR)", category: "Logistics", desc: "Official transport bilties & driver dispatch" };
    if (p.startsWith("/settings")) return { title: "System & Company Settings", category: "System", desc: "Manage company identity, tax compliance, payments, and account preferences" };
    return { title: "Dashboard", category: "Operations", desc: "Overview & metrics" };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="h-screen overflow-hidden bg-slate-50/70 flex flex-row font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Desktop Left-Docked Sidebar (Smooth transition between Expanded w-64 and Icon Rail w-16) */}
      <aside
        className={`hidden md:flex flex-col bg-white h-screen shrink-0 z-40 border-r border-slate-200/80 transition-all duration-300 ease-in-out ${
          desktopSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Brand Header (Exact h-16 matching topbar) */}
        <div className="h-16 px-3 border-b border-slate-200/80 flex items-center shrink-0 bg-white overflow-hidden">
          <div className={`flex items-center gap-3 min-w-0 ${desktopSidebarOpen ? "px-1" : "mx-auto justify-center"}`}>
            <div className="relative shrink-0">
              <img
                src={companyConfig.logo.icon}
                alt="Logo"
                className="w-9 h-9 rounded-xl object-contain bg-blue-50 border border-blue-100 p-1 shadow-2xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            {desktopSidebarOpen && (
              <div className="min-w-0 overflow-hidden">
                <h1 className="text-[13px] font-bold text-slate-900 leading-tight truncate" title={companyConfig.name}>
                  {companyConfig.name}
                </h1>
                <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5 truncate">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3 overflow-x-hidden">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {desktopSidebarOpen && (
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={!desktopSidebarOpen ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl font-medium text-xs sm:text-sm transition-all group ${
                        desktopSidebarOpen
                          ? "px-3 py-2 gap-3"
                          : "w-11 h-11 justify-center mx-auto"
                      } ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                          }`}
                        />
                        {desktopSidebarOpen && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User / Session Profile Footer */}
        <div className="p-2 border-t border-slate-100 bg-slate-50/50 mt-auto shrink-0">
          {desktopSidebarOpen ? (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shrink-0 shadow-xs">
                  {(admin?.username || "A")[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {admin?.username || "Account"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Sign Out"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs cursor-default"
                title={`Logged in as ${admin?.username || "Account"}`}
              >
                {(admin?.username || "A")[0]}
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10">
            <div className="h-16 px-4 border-b border-slate-200/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={companyConfig.logo.icon}
                  alt="Logo"
                  className="w-9 h-9 rounded-xl object-contain bg-blue-50 border border-blue-100 p-1 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="text-xs font-bold text-slate-900 leading-tight truncate" title={companyConfig.name}>
                    {companyConfig.name}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">Account Panel</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {navSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                    {sec.title}
                  </div>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                            isActive
                              ? "bg-blue-600 text-white font-semibold shadow-xs"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">{admin?.username || "Account"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header Bar (Scales down gracefully on mobile: h-14 sm:h-16) */}
        <header className="h-14 sm:h-16 shrink-0 bg-white border-b border-slate-200/80 flex items-center z-30">
          <div className="w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Single Sidebar Toggle Button & Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={handleToggle}
                className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                title={desktopSidebarOpen ? "Collapse to icon rail (Ctrl+B)" : "Expand sidebar (Ctrl+B)"}
                aria-label="Toggle navigation sidebar"
              >
                <PanelLeft className="w-5 h-5 text-slate-700 hover:text-blue-600 transition-colors" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium leading-none">
                  <span className="hidden sm:inline hover:text-slate-600 transition-colors shrink-0">{pageInfo.category}</span>
                  <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-300 shrink-0" />
                  <span className="text-slate-800 font-semibold truncate max-w-[140px] sm:max-w-xs">{pageInfo.title}</span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 truncate leading-none mt-1">
                  {pageInfo.desc}
                </p>
              </div>
            </div>

            {/* Right: Action & User Info */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Global Quick Search Button */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/80 cursor-pointer transition-colors"
                title="Quick Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search</span>
                <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-400">Ctrl K</kbd>
              </button>

              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="sm:hidden p-1.5 text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                title="Quick Search (Ctrl+K)"
                aria-label="Quick Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Install PWA Button (Visible when browser prompt is available) */}
              {deferredPrompt && (
                <button
                  onClick={handleInstallPWA}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                  title="Install Admin App on device"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}

              {/* View Public Website */}
              <a
                href={companyConfig.website || "http://localhost:5173"}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-slate-200/80"
                title="Open client-facing website"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* Account Profile Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 pl-2 border-l border-slate-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-2xs shrink-0">
                  {(admin?.username || "A")[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {admin?.username || "Account"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area (Fluid & Responsive with optimized mobile padding) */}
        <main className="flex-1 overflow-y-auto w-full p-3 sm:p-5 lg:p-8 pb-20 sm:pb-24 md:pb-12">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (5 thumb-accessible destinations) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 pb-[max(env(safe-area-inset-bottom),0.35rem)]">
        <div className="grid grid-cols-5 gap-0.5 text-center">
          {[
            { to: "/leads", label: "Leads", icon: Inbox, badge: newLeadsCount },
            { to: "/quotes", label: "Quotes", icon: FileSpreadsheet },
            { to: "/jobs", label: "Jobs", icon: Truck, dot: activeJobsCount > 0 },
            { to: "/finance", label: "Finance", icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 rounded-xl transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-xl transition-colors relative ${isActive ? "bg-blue-50" : ""}`}>
                      <Icon className="w-5 h-5" />
                      {item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full shadow-2xs">
                          {item.badge}
                        </span>
                      )}
                      {item.dot && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-600 rounded-full border border-white"></span>
                      )}
                    </div>
                    <span className="text-[10px] tracking-tight leading-none mt-0.5">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* 5th Tab: More / Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer ${
              ["/fleet", "/team", "/invoices", "/bilties", "/settings"].some((p) => location.pathname.startsWith(p))
                ? "text-blue-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors relative ${
                ["/fleet", "/team", "/invoices", "/bilties", "/settings"].some((p) => location.pathname.startsWith(p))
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <Menu className="w-5 h-5" />
              {["/fleet", "/team", "/invoices", "/bilties", "/settings"].some((p) => location.pathname.startsWith(p)) && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminPanelLayout;
