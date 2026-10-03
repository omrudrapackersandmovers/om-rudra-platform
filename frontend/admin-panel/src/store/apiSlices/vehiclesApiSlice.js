import { baseApiSlice } from "./baseApiSlice";

export const vehiclesApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append("status", params.status);
        if (params?.date) queryParams.append("date", params.date);
        const qs = queryParams.toString();
        return `/vehicles${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response) => response.vehicles || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Vehicles", id })),
              { type: "Vehicles", id: "LIST" },
            ]
          : [{ type: "Vehicles", id: "LIST" }],
    }),
    getVehicleById: builder.query({
      query: (id) => `/vehicles/${id}`,
      transformResponse: (response) => response,
      providesTags: (result, error, id) => [{ type: "Vehicles", id }],
    }),
    addVehicle: builder.mutation({
      query: (body) => ({
        url: "/vehicles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vehicles", id: "LIST" }],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/vehicles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Vehicles", id },
        { type: "Vehicles", id: "LIST" },
      ],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Vehicles", id: "LIST" }],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehiclesApiSlice;
