// slices/adminFiltersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProductType: "Ribbon",
  selectedCategoryIds: [],
  selectedAttributes: {}, // e.g., { color: ["Red"], width: ["1-inch"] }
};

const adminFiltersSlice = createSlice({
  name: "adminFilters",
  initialState,
  reducers: {
    setProductType: (state, action) => {
      state.selectedProductType = action.payload;
      state.selectedCategoryIds = []; // ✅ Reset on product type change
      state.selectedAttributes = {};
    },
    setCategoryId: (state, action) => {
      const id = action.payload;
      let updatedIds;

      if (state.selectedCategoryIds.includes(id)) {
        updatedIds = state.selectedCategoryIds.filter(cid => cid !== id);
      } else {
        updatedIds = [...state.selectedCategoryIds, id];
      }

      state.selectedCategoryIds = updatedIds;
      state.selectedAttributes = {}; // ✅ Reset attributes on category change
    },
    toggleAttributeValue: (state, action) => {
      const { key, value } = action.payload;
      const current = state.selectedAttributes[key] || [];
      state.selectedAttributes[key] = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
    },
    resetFilters: () => initialState,
  },
});

export const {
  setProductType,
  setCategoryId,
  toggleAttributeValue,
  resetFilters,
} = adminFiltersSlice.actions;

export default adminFiltersSlice.reducer;
