import React from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Home, FileQuestion, Users, FileSpreadsheet, Truck } from "lucide-react";
import { companyConfig } from "../../../../configs/company.config";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl p-6 sm:p-8 text-center space-y-6">
        {/* Visual 404 Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-300 shadow-2xs">
          <FileQuestion className="w-10 h-10" />
          <span className="absolute -top-2 -right-2 bg-brand-600 text-white font-mono text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
            404
          </span>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page or operational resource you requested does not exist or has been relocated within {companyConfig.shortName}.
          </p>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/leads"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-300 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium group"
          >
            <Users className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span>Leads</span>
          </Link>
          <Link
            to="/quotes"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-300 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium group"
          >
            <FileSpreadsheet className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span>Quotes</span>
          </Link>
          <Link
            to="/jobs"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-300 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium group"
          >
            <Truck className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
            <span>Jobs</span>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <Link
            to="/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs shadow-brand-500/20 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
