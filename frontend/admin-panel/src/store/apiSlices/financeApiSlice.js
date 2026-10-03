import { baseApiSlice } from "./baseApiSlice";

export const financeApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceSummary: builder.query({
      query: () => "/finance/summary",
      providesTags: [{ type: "Finance", id: "DASHBOARD" }],
    }),
    getMonthlyRevenue: builder.query({
      query: () => "/finance/monthly",
      transformResponse: (response) => response.monthly || [],
      providesTags: [{ type: "Finance", id: "DASHBOARD" }],
    }),
    getTopRoutes: builder.query({
      query: () => "/finance/top-routes",
      transformResponse: (response) => response.routes || [],
      providesTags: [{ type: "Finance", id: "DASHBOARD" }],
    }),
    getPendingPayroll: builder.query({
      query: () => "/finance/pending-payroll",
      transformResponse: (response) => response.payroll || [],
      providesTags: [{ type: "Finance", id: "DASHBOARD" }],
    }),
  }),
});

export const {
  useGetFinanceSummaryQuery,
  useGetMonthlyRevenueQuery,
  useGetTopRoutesQuery,
  useGetPendingPayrollQuery,
} = financeApiSlice;
