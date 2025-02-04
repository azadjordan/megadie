import { PRODUCTS_URL } from '../constants';
import apiSlice from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => PRODUCTS_URL,
      providesTags: ['Product'],
      keepUnusedDataFor: 120, // Cache data for 2 minutes
    }),
    getProductById: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 60, // Cache data for 1 minute
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'], // Ensures fresh data after adding
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['Product'], // Ensures fresh data after updating
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'], // Ensures fresh data after deleting
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
