import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "../constants.js";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch all categories
    getCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Categories"],
    }),

    // ✅ Fetch a category by ID
    getCategoryById: builder.query({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // ✅ Create a new category (Admin only)
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORIES_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ✅ Update an existing category (Admin only)
    updateCategory: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: "PUT",
        body: updatedData,
        credentials: "include",
      }),
      invalidatesTags: ["Category", "Categories"],
    }),

    // ✅ Delete a category (Admin only)
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
