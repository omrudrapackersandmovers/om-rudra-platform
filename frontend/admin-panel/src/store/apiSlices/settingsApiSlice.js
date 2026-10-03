import { baseApiSlice } from "./baseApiSlice";

export const settingsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      transformResponse: (response) => response.settings,
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation({
      query: (formData) => ({
        url: "/settings",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Settings"],
    }),
    getDataStatus: builder.query({
      query: () => "/data/status",
      providesTags: ["DataStatus"],
    }),
    loadSampleData: builder.mutation({
      query: () => ({
        url: "/data/load-sample",
        method: "POST",
      }),
      invalidatesTags: [
        "Leads",
        "Quotes",
        "Jobs",
        "Invoices",
        "Bilties",
        "Vehicles",
        "Staff",
        "JobResources",
        "InvoicePayments",
        "Finance",
        "DataStatus",
      ],
    }),
    resetData: builder.mutation({
      query: () => ({
        url: "/data/reset",
        method: "POST",
      }),
      invalidatesTags: [
        "Leads",
        "Quotes",
        "Jobs",
        "Invoices",
        "Bilties",
        "Vehicles",
        "Staff",
        "JobResources",
        "InvoicePayments",
        "Finance",
        "DataStatus",
      ],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetDataStatusQuery,
  useLoadSampleDataMutation,
  useResetDataMutation,
} = settingsApiSlice;

