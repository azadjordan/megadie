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
        url: `${USERS_URL}/profile`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"], // ✅ Ensure the profile is cached properly
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"], // ✅ This will trigger a refetch after updating
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation 
} = usersApiSlice;
