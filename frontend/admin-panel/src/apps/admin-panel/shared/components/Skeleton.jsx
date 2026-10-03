import React from "react";

/**
 * Base Skeleton Primitive
 */
export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200/70 rounded-xl ${className}`} />
);

/**
 * Skeleton for 4-Card KPI Metric Summary Rows
 */
export const KpiGridSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs animate-pulse space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-200 rounded-md" />
          <div className="w-8 h-8 rounded-xl bg-slate-100" />
        </div>
        <div className="h-7 w-16 bg-slate-200 rounded-lg mt-2" />
        <div className="h-2.5 w-32 bg-slate-100 rounded-md mt-1" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton for Operations Cards Grid (Leads, Quotes, Jobs, Fleet, Team, Invoices, Bilties)
 */
export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 animate-pulse flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-200 rounded-md" />
              <div className="h-3 w-24 bg-slate-100 rounded-md" />
            </div>
            <div className="h-5 w-20 bg-slate-100 rounded-full" />
          </div>

          {/* Card Middle Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
            <div className="h-3.5 w-3/4 bg-slate-200 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-100 rounded-md" />
          <div className="h-6 w-20 bg-slate-200 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton for Detail View Header & Stats
 */
export const DetailHeaderSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-slate-200 rounded-lg" />
        <div className="h-3.5 w-32 bg-slate-100 rounded-md" />
      </div>
      <div className="h-8 w-24 bg-slate-200 rounded-xl" />
    </div>
  </div>
);

export default Skeleton;
