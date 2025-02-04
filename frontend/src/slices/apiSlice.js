import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // ✅ Ensures authentication cookies are sent
  }),
  tagTypes: ["Product", "Order", "User"], // ✅ Include all entities for caching & invalidation
  endpoints: () => ({}), // Empty, extended by feature slices
});

export default apiSlice;
