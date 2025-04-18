import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/account/profile`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Fetch all users (Admin only)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Users"],
    }),

    // ✅ Fetch a user by ID (Admin only)
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // ✅ Update user (Admin only)
    updateUser: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: updatedData,
        credentials: "include",
      }),
      invalidatesTags: ["User", "Users"],
    }),

    // ✅ Delete user (Admin only)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUsersQuery, // ✅ Keep this for fetching users
  useGetUserByIdQuery, // ✅ Keep this for editing users
  useUpdateUserMutation, // ✅ Keep this for updating users
  useDeleteUserMutation, // ✅ Keep this for deleting users
} = usersApiSlice;
