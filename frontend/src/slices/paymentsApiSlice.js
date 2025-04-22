// ✅ paymentsApiSlice.js
import { PAYMENTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all payments (admin only)
    getPayments: builder.query({
      query: () => `${PAYMENTS_URL}`,
      providesTags: ["Payment"],
      keepUnusedDataFor: 300,
    }),

    // ✅ Get payment by ID (admin only)
    getPaymentById: builder.query({
      query: (id) => `${PAYMENTS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
      keepUnusedDataFor: 300,
    }),

    getMyPayments: builder.query({
      query: () => `${PAYMENTS_URL}/my`,
      providesTags: ["Payment"],
      keepUnusedDataFor: 300,
    }),
    

// ✅ Create payment from invoice
addPaymentFromInvoice: builder.mutation({
  query: ({ invoiceId, ...data }) => ({
    url: `${PAYMENTS_URL}/from-invoice/${invoiceId}`,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Payment", "Invoice"],
}),

    // ✅ Update payment (admin only)
    updatePayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Payment", id }],
    }),

    // ✅ Delete payment (admin only)
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),

    getPaymentsByInvoice: builder.query({
      query: (invoiceId) => `/api/payments?invoice=${invoiceId}`,
    }),
    
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentsByInvoiceQuery,
  useGetPaymentByIdQuery,
  useGetMyPaymentsQuery, // ✅ NEW HOOK
  useAddPaymentFromInvoiceMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApiSlice;


