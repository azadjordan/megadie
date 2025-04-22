import { QUOTES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const quotesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ✅ Get all quotes (admin)
    getQuotes: builder.query({
      query: () => `${QUOTES_URL}/admin`,
      providesTags: ["Quote"],
      keepUnusedDataFor: 300,
    }),

    // ✅ Get single quote by ID
    getQuoteById: builder.query({
      query: (id) => `${QUOTES_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Quote", id }],
      keepUnusedDataFor: 300,
    }),

    // ✅ Create a quote (client)
    createQuote: builder.mutation({
      query: (data) => ({
        url: QUOTES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quote"],
    }),

    // ✅ Update quote (admin)
    updateQuote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${QUOTES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Quote", id }],
    }),

    // ✅ Delete quote (admin)
    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `${QUOTES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quote"],
    }),

    getMyQuotes: builder.query({
      query: () => `${QUOTES_URL}/my`,
      providesTags: ["Quote"],
      keepUnusedDataFor: 300,
    }),
    
  }),
});

export const {
  useGetQuotesQuery,
  useGetMyQuotesQuery,
  useGetQuoteByIdQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quotesApiSlice;
