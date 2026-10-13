import { baseApiSlice } from "./baseApiSlice";

export const biltiesApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBilties: builder.query({
      query: () => "/bilties",
      transformResponse: (response) => response.bilties || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Bilties", id })),
              { type: "Bilties", id: "LIST" },
            ]
          : [{ type: "Bilties", id: "LIST" }],
    }),
    getBiltyById: builder.query({
      query: (id) => `/bilties/${id}`,
      transformResponse: (response) => response.bilty || response,
      providesTags: (result, error, id) => [{ type: "Bilties", id }],
    }),
    updateBilty: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/bilties/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Bilties", id }, { type: "Bilties", id: "LIST" }, { type: "Jobs", id: "LIST" }],
    }),
    createBilty: builder.mutation({
      query: (body) => ({
        url: "/bilties",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Bilties", id: "LIST" },
        { type: "Jobs", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBiltiesQuery,
  useGetBiltyByIdQuery,
  useCreateBiltyMutation,
  useUpdateBiltyMutation,
} = biltiesApiSlice;
