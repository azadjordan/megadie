import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Update Order Status (Admin)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}/status`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),
    // ✅ Toggle order payment status (Admin)
    toggleOrderPaymentStatus: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/toggle-pay`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),
    // ✅ Create a new order
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"], // ✅ Ensures MyOrders refetches automatically
    }),

    // ✅ Get a single order by ID
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 300, // ✅ Keeps order details cached for 5 minutes
    }),

    // ✅ Get logged-in user's orders
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
      keepUnusedDataFor: 600, // ✅ Keeps MyOrders cached for 10 minutes
    }),

    // ✅ Get all orders (Admin only)
    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
      keepUnusedDataFor: 120, // ✅ Keeps admin OrderList cached for 2 minutes
    }),
    // ✅ Deduct Stock (Admin)
    deductStock: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deduct-stock`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // ✅ Restore Stock (Admin)
    restoreStock: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/restore-stock`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useToggleOrderPaymentStatusMutation,
  useUpdateOrderStatusMutation,
  useDeductStockMutation,
  useRestoreStockMutation,
} = ordersApiSlice;
