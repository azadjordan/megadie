import { PRODUCTS_URL } from "../constants";
import apiSlice from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all products (with longer cache duration)
    getProducts: builder.query({
      query: ({ productType, categoryIds, attributes }) => {
        const params = new URLSearchParams();

        if (productType) params.append("productType", productType);

        if (categoryIds?.length > 0) {
          for (const id of categoryIds) {
            params.append("categoryIds", id);
          }
        }

        if (attributes) {
          for (const key in attributes) {
            for (const value of attributes[key]) {
              params.append(`attributes[${key}]`, value);
            }
          }
        }

        return `${PRODUCTS_URL}?${params.toString()}`;
      },
    }),

    getProductsAdmin: builder.query({
      query: ({ productType, categoryIds, attributes }) => {
        const params = new URLSearchParams();
    
        if (productType) params.append("productType", productType);
    
        if (categoryIds?.length > 0) {
          for (const id of categoryIds) {
            params.append("categoryIds", id);
          }
        }
    
        if (attributes) {
          for (const key in attributes) {
            for (const value of attributes[key]) {
              params.append(`attributes[${key}]`, value);
            }
          }
        }
    
        return `/api/products/admin?${params.toString()}`;
      },
    }),
    
    
    // ✅ Add this
    getProductById: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
    }),

    // ✅ Create a new product
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // ✅ Update an existing product
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    // ✅ Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsAdminQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
