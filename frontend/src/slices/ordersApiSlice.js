import { ORDERS_URL } from "../constants";
import apiSlice from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrderFromQuote: builder.mutation({
      query: (quoteId) => ({
        url: `/api/orders/from-quote/${quoteId}`,
        method: "POST",
      }),
      invalidatesTags: ["Order", "Quote"],
    }),
    
    
    // ✅ Get all orders (Admin)
    getOrders: builder.query({
      query: () => ORDERS_URL,
      providesTags: ["Order"],
    }),

    // ✅ Get single order by ID
    getOrderById: builder.query({
      query: (id) => `${ORDERS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // ✅ Create a new order
    createOrder: builder.mutation({
      query: (data) => ({
        url: ORDERS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    // ✅ Update an existing order (Admin)
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),

    // ✅ Delete order (Admin)
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

    // ✅ Get my orders (client)
    getMyOrders: builder.query({
      query: () => `${ORDERS_URL}/my`,
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderFromQuoteMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetMyOrdersQuery,
} = ordersApiSlice;
