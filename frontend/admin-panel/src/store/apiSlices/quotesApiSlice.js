import { baseApiSlice } from "./baseApiSlice";

export const quotesApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuotes: builder.query({
      query: () => "/quotes",
      transformResponse: (response) => response.quotes || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Quotes", id })),
              { type: "Quotes", id: "LIST" },
            ]
          : [{ type: "Quotes", id: "LIST" }],
    }),
    getQuoteById: builder.query({
      query: (id) => `/quotes/${id}`,
      transformResponse: (response) => response.quote || response,
      providesTags: (result, error, id) => [{ type: "Quotes", id }],
    }),
    createQuote: builder.mutation({
      query: (body) => ({
        url: "/quotes",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Quotes", id: "LIST" },
        { type: "Leads", id: "LIST" },
      ],
    }),
    updateQuote: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/quotes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Quotes", id },
        { type: "Quotes", id: "LIST" },
        { type: "Leads", id: "LIST" },
      ],
    }),
    updateQuoteStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/quotes/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Quotes", id },
        { type: "Quotes", id: "LIST" },
      ],
    }),
    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Quotes", id: "LIST" },
        { type: "Leads", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetQuotesQuery,
  useGetQuoteByIdQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useUpdateQuoteStatusMutation,
  useDeleteQuoteMutation,
} = quotesApiSlice;
