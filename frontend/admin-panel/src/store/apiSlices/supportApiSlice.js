import { baseApiSlice } from "./baseApiSlice";

const supportApi = baseApiSlice.enhanceEndpoints({ addTagTypes: ["Support"] }).injectEndpoints({
  endpoints: builder => ({
    searchSupportReferences: builder.query({
      query: query => `/support/references?q=${encodeURIComponent(query)}`,
      transformResponse: response => response.references || [],
    }),
    createComplaint: builder.mutation({
      query: body => ({ url: "/support", method: "POST", body }),
      invalidatesTags: ["Support"],
    }),
    getSupport: builder.query({
      query: () => "/support",
      transformResponse: response => response.messages || [],
      providesTags: ["Support"],
    }),
    updateSupport: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/support/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const { useGetSupportQuery, useUpdateSupportMutation, useCreateComplaintMutation, useSearchSupportReferencesQuery } = supportApi;
