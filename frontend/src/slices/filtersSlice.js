import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: null, // Immediately updates
  selectedSubcategories: [], // Updates only when "Apply Filters" is clicked
  selectedAttributes: {}, // Stores selected attribute options per filter
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategories = []; // Reset subcategories
      state.selectedAttributes = {}; // Reset attributes
    },
    applyFilters: (state, action) => {
      state.selectedSubcategories = action.payload.subcategories;
      state.selectedAttributes = action.payload.attributes;
    },
    resetFilters: (state) => {
      state.selectedSubcategories = [];
      state.selectedAttributes = {};
    },
  },
});

export const { setCategory, applyFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
