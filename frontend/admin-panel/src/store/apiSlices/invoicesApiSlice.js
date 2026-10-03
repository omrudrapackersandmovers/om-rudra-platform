import { baseApiSlice } from "./baseApiSlice";

export const invoicesApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => "/invoices",
      transformResponse: (response) => response.invoices || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Invoices", id })),
              { type: "Invoices", id: "LIST" },
            ]
          : [{ type: "Invoices", id: "LIST" }],
    }),
    getInvoiceById: builder.query({
      query: (id) => `/invoices/${id}`,
      transformResponse: (response) => response.invoice || response,
      providesTags: (result, error, id) => [{ type: "Invoices", id }],
    }),
    createInvoice: builder.mutation({
      query: (body) => ({
        url: "/invoices",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Invoices", id: "LIST" },
        { type: "Jobs", id: "LIST" },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    updateInvoicePayment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/invoices/${id}/payment`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Invoices", id },
        { type: "Invoices", id: "LIST" },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
    getInvoicePayments: builder.query({
      query: (invoiceId) => `/invoices/${invoiceId}/payments`,
      transformResponse: (response) => response.payments || [],
      providesTags: (result, error, invoiceId) => [
        { type: "InvoicePayments", id: invoiceId },
      ],
    }),
    recordInvoicePayment: builder.mutation({
      query: ({ invoiceId, ...body }) => ({
        url: `/invoices/${invoiceId}/payments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { invoiceId }) => [
        { type: "Invoices", id: invoiceId },
        { type: "Invoices", id: "LIST" },
        { type: "InvoicePayments", id: invoiceId },
        { type: "Finance", id: "DASHBOARD" },
      ],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoicePaymentMutation,
  useGetInvoicePaymentsQuery,
  useRecordInvoicePaymentMutation,
} = invoicesApiSlice;
