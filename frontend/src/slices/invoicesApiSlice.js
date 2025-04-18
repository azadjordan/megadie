// ✅ invoicesApiSlice.js
import { INVOICES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all invoices (admin)
    getInvoices: builder.query({
      query: () => `${INVOICES_URL}`,
      providesTags: ["Invoice"],
      keepUnusedDataFor: 300,
    }),

    // ✅ Get single invoice by ID (admin or user)
    getInvoiceById: builder.query({
      query: (id) => `${INVOICES_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoice", id }],
      keepUnusedDataFor: 300,
    }),

    // ✅ Create invoice (admin only)
    createInvoice: builder.mutation({
      query: (data) => ({
        url: INVOICES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),

    // ✅ Update invoice (admin only)
    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${INVOICES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Invoice", id }],
    }),

    // ✅ Delete invoice (admin only)
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `${INVOICES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),

    // ✅ Get logged-in user's invoices
    getMyInvoices: builder.query({
      query: () => `${INVOICES_URL}/my`,
      providesTags: ["Invoice"],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetMyInvoicesQuery,
} = invoicesApiSlice;
