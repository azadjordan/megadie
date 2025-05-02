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
      const currentValues = state.selectedAttributes[key] || [];

      if (currentValues.includes(value)) {
        state.selectedAttributes[key] = currentValues.filter((v) => v !== value);
        if (state.selectedAttributes[key].length === 0) delete state.selectedAttributes[key];
      } else {
        state.selectedAttributes[key] = [...currentValues, value];
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
