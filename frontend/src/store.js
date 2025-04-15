import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice.js";
import cartReducer from "./slices/cartSlice.js";
import authReducer from "./slices/authSlice";
import filtersReducer from './slices/filtersSlice.js'
import authMiddleware from "./middleware/authMiddleware";
import adminFiltersReducer from './slices/adminFiltersSlice.js' 

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
    auth: authReducer,
    filters: filtersReducer,
    adminFilters: adminFiltersReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, authMiddleware), // ✅ Re-enable authMiddleware
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
