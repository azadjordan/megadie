import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleDebtAssignment: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/toggle-debt`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    updateOrderPrices: builder.mutation({
      query: ({ orderId, updatedItems, deliveryCharge, extraFee }) => ({
        url: `${ORDERS_URL}/${orderId}/update-prices`,
        method: "PUT",
        body: { updatedItems, deliveryCharge, extraFee }, // ✅ Include extraFee
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    updateSellerNote: builder.mutation({
      query: ({ orderId, sellerNote }) => ({
        url: `${ORDERS_URL}/${orderId}/seller-note`,
        method: "PUT",
        body: { sellerNote },
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),
    // ✅ Update Admin Note
    updateAdminNote: builder.mutation({
      query: ({ orderId, adminNote }) => ({
        url: `${ORDERS_URL}/${orderId}/admin-note`,
        method: "PUT",
        body: { adminNote }, // ✅ Ensure adminNote is correctly sent
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

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

    // ✅ Toggle Order Payment Status (Admin)
    toggleOrderPaymentStatus: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/toggle-pay`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // ✅ Create a New Order (Ensure it uses `clientNote`)
    createOrder: builder.mutation({
      query: ({ orderItems, totalPrice, clientNote }) => ({
        url: `${ORDERS_URL}/`,
        method: "POST",
        body: { orderItems, totalPrice, clientNote }, // ✅ Correct field name
        credentials: "include",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Get a Single Order by ID (Includes `clientNote` & `adminNote`)
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 300, // ✅ Keeps order details cached for 5 minutes
    }),

    // ✅ Get Logged-in User's Orders
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
      keepUnusedDataFor: 600, // ✅ Keeps MyOrders cached for 10 minutes
    }),

    // ✅ Get All Orders (Admin Only)
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

// ✅ Export Hooks
export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useToggleOrderPaymentStatusMutation,
  useUpdateOrderStatusMutation,
  useDeductStockMutation,
  useRestoreStockMutation,
  useUpdateAdminNoteMutation,
  useUpdateSellerNoteMutation,
  useUpdateOrderPricesMutation,
  useToggleDebtAssignmentMutation,
} = ordersApiSlice;
