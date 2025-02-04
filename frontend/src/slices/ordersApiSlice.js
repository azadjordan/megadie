import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create a new order (Invalidate My Orders after creation)
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"], // ✅ Ensures MyOrders refetches automatically
    }),

    // ✅ Get a single order by ID (for order details)
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Order"],
    }),

    // ✅ Get logged-in user's orders
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"], // ✅ Allows automatic refetching
    }),

    // ✅ Get all orders (Admin only)
    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Update order to paid (Admin only)
    updateOrderToPaid: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Order"],
    }),

    // ✅ Update order to delivered (Admin only)
    updateOrderToDelivered: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
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
  useUpdateOrderToPaidMutation, 
  useUpdateOrderToDeliveredMutation 
} = ordersApiSlice;
