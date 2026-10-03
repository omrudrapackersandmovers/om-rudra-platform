import { baseApiSlice } from "./baseApiSlice";

export const jobsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => "/jobs",
      transformResponse: (response) => response.jobs || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Jobs", id })),
              { type: "Jobs", id: "LIST" },
            ]
          : [{ type: "Jobs", id: "LIST" }],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response) => response.job || response,
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
    }),
    createJob: builder.mutation({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Jobs", id: "LIST" },
        { type: "Quotes", id: "LIST" },
        { type: "Leads", id: "LIST" },
      ],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Jobs", id },
        { type: "Jobs", id: "LIST" },
        { type: "Vehicles", id: "LIST" },
        { type: "Staff", id: "LIST" },
      ],
    }),
    getJobResources: builder.query({
      query: (jobId) => `/jobs/${jobId}/resources`,
      providesTags: (result, error, jobId) => [{ type: "JobResources", id: jobId }],
    }),
    assignVehiclesToJob: builder.mutation({
      query: ({ jobId, vehicles }) => ({
        url: `/jobs/${jobId}/assign-vehicles`,
        method: "POST",
        body: vehicles,
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Vehicles", id: "LIST" },
      ],
    }),
    removeVehicleFromJob: builder.mutation({
      query: ({ jobId, vehicleId }) => ({
        url: `/jobs/${jobId}/vehicles/${vehicleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Vehicles", id: "LIST" },
      ],
    }),
    assignStaffToJob: builder.mutation({
      query: ({ jobId, staff }) => ({
        url: `/jobs/${jobId}/assign-staff`,
        method: "POST",
        body: staff,
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Staff", id: "LIST" },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    removeStaffFromJob: builder.mutation({
      query: ({ jobId, staffId }) => ({
        url: `/jobs/${jobId}/staff/${staffId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Staff", id: "LIST" },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    updateStaffPayment: builder.mutation({
      query: ({ jobId, staffId, ...body }) => ({
        url: `/jobs/${jobId}/staff/${staffId}/payment`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    addJobExpense: builder.mutation({
      query: ({ jobId, ...body }) => ({
        url: `/jobs/${jobId}/expenses`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    deleteJobExpense: builder.mutation({
      query: ({ jobId, expenseId }) => ({
        url: `/jobs/${jobId}/expenses/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "JobResources", id: jobId },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    getJobProfit: builder.query({
      query: (jobId) => `/jobs/${jobId}/profit`,
      providesTags: (result, error, jobId) => [{ type: "JobResources", id: jobId }],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useGetJobResourcesQuery,
  useAssignVehiclesToJobMutation,
  useRemoveVehicleFromJobMutation,
  useAssignStaffToJobMutation,
  useRemoveStaffFromJobMutation,
  useUpdateStaffPaymentMutation,
  useAddJobExpenseMutation,
  useDeleteJobExpenseMutation,
  useGetJobProfitQuery,
} = jobsApiSlice;
