import { PAYMENTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch All Payments (Admin Only)
    getAllPayments: builder.query({
      query: () => ({
        url: PAYMENTS_URL,
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    // ✅ Fetch Payments for a Specific User
    getUserPayments: builder.query({
      query: (userId) => ({
        url: `${PAYMENTS_URL}/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "Payments", id: userId }],
    }),

    // ✅ Create a New Payment (Admin Only)
    createPayment: builder.mutation({
      query: ({ userId, amount, paymentMethod, note }) => ({
        url: PAYMENTS_URL,
        method: "POST",
        body: { userId, amount, paymentMethod, note }, // ✅ Ensure correct payload
      }),
      invalidatesTags: ["Payments"],
    }),

    // ✅ Fetch a Single Payment by ID
    getPaymentById: builder.query({
      query: (id) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payments", id }],
    }),

    // ✅ Update an Existing Payment (Admin Only)
    updatePayment: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Payments", id }, "Payments"],
    }),

    // ✅ Delete a Payment (Admin Only)
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetUserPaymentsQuery, 
  useCreatePaymentMutation,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApiSlice;
