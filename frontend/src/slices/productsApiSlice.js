import { PRODUCTS_URL } from '../constants';
import apiSlice from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch all products (filtered)
    getProducts: builder.query({
      query: (filters = {}) => {
        const { category = null, subcategories = [], attributes = {} } = filters; // ✅ Safe destructuring
    
        const params = new URLSearchParams();
    
        if (category) params.append("category", category);
        subcategories.forEach((sub) => params.append("subcategories", sub));
    
        Object.entries(attributes).forEach(([key, values]) => {
          values.forEach((value) => params.append(`attributes[${key}]`, value));
        });
    
        return `${PRODUCTS_URL}?${params.toString()}`;
      },
      providesTags: (result, error, filters) => [{ type: "Product", id: filters?.category || "ALL" }],
    }),
    
    

    // ✅ Fetch a single product by ID with subcategory details
    getProductById: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 60, // Cache data for 1 minute
    }),

    // ✅ Add a new product
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: {
          ...newProduct,
          attributes: {
            t1: newProduct.attributes?.t1 || "",
            t2: newProduct.attributes?.t2 || "",
            t3: newProduct.attributes?.t3 || "",
            d1: newProduct.attributes?.d1 || "",
            d2: newProduct.attributes?.d2 || "",
            d3: newProduct.attributes?.d3 || "",
          },
        },
      }),
      invalidatesTags: ['Product'], // Ensures fresh data after adding
    }),

    // ✅ Update an existing product
    updateProduct: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
        body: {
          ...updatedData,
          attributes: {
            t1: updatedData.attributes?.t1 ?? "",
            t2: updatedData.attributes?.t2 ?? "",
            t3: updatedData.attributes?.t3 ?? "",
            d1: updatedData.attributes?.d1 ?? "",
            d2: updatedData.attributes?.d2 ?? "",
            d3: updatedData.attributes?.d3 ?? "",
          },
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }], // Ensures fresh data for updated product
    }),

    // ✅ Delete a product
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
