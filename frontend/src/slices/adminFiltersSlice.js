import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProductType: null,
  selectedCategoryIds: [],
  selectedAttributes: {},
};

const adminFiltersSlice = createSlice({
  name: "adminFilters",
  initialState,
  reducers: {
    setProductType: (state, action) => {
      state.selectedProductType = action.payload;
      state.selectedCategoryIds = [];
      state.selectedAttributes = {};
    },
    toggleCategoryId: (state, action) => {
      const id = action.payload;
      if (state.selectedCategoryIds.includes(id)) {
        state.selectedCategoryIds = state.selectedCategoryIds.filter((c) => c !== id);
      } else {
        state.selectedCategoryIds.push(id);
      }
    },
    toggleAttribute: (state, action) => {
      const { key, value } = action.payload;
      const current = state.selectedAttributes[key] || [];
      if (current.includes(value)) {
        const updated = current.filter((v) => v !== value);
        if (updated.length > 0) {
          state.selectedAttributes[key] = updated;
        } else {
          delete state.selectedAttributes[key];
        }
      } else {
        state.selectedAttributes[key] = [...current, value];
      }
    },
    resetFilters: () => initialState,
  },
});

export const {
  setProductType,
  toggleCategoryId,
  toggleAttribute,
  resetFilters,
} = adminFiltersSlice.actions;
export default adminFiltersSlice.reducer;
