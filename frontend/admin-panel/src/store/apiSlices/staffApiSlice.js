import { baseApiSlice } from "./baseApiSlice";

export const staffApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.role) queryParams.append("role", params.role);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.date) queryParams.append("date", params.date);
        const qs = queryParams.toString();
        return `/staff${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response) => response.staff || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Staff", id })),
              { type: "Staff", id: "LIST" },
            ]
          : [{ type: "Staff", id: "LIST" }],
    }),
    getStaffById: builder.query({
      query: (id) => `/staff/${id}`,
      providesTags: (result, error, id) => [{ type: "Staff", id }],
    }),
    addStaff: builder.mutation({
      query: (body) => ({
        url: "/staff",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Staff", id: "LIST" }],
    }),
    updateStaff: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/staff/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Staff", id },
        { type: "Staff", id: "LIST" },
      ],
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Staff", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApiSlice;
