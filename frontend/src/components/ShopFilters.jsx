import { useDispatch, useSelector } from "react-redux";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import {
  setProductType,
  setCategoryId,
  toggleAttributeValue,
  resetFilters,
} from "../slices/filtersSlice";

import { FaBoxOpen, FaFilter } from "react-icons/fa";

const ShopFilters = () => {
  const dispatch = useDispatch();
  const { selectedProductType, selectedCategoryIds, selectedAttributes } = useSelector(
    (state) => state.filters
  );

  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <p className="text-sm italic p-4">Loading filters...</p>;
  if (error) return <p className="text-sm text-red-500 p-4">Failed to load filters.</p>;

  const productTypes = [...new Set(categories.map((cat) => cat.productType))];
  const relatedCategories = categories.filter(cat => cat.productType === selectedProductType);

  const allFilters = selectedCategoryIds.length > 0
    ? relatedCategories.filter(cat => selectedCategoryIds.includes(cat._id)).flatMap(cat => cat.filters || [])
    : relatedCategories.flatMap(cat => cat.filters || []);

  const merged = {};
  for (const filter of allFilters) {
    const key = filter.Key;
    if (!merged[key]) {
      merged[key] = { ...filter, values: [...filter.values] };
    } else {
      const combined = [...merged[key].values, ...filter.values];
      merged[key].values = [...new Set(combined)].sort();
    }
  }

  const filterSource = Object.values(merged).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 text-sm divide-gray-300 divide-y">
      {/* 🔹 Product Types */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaBoxOpen className="text-purple-500" /> Product Type
        </h3>
        <div className="flex flex-col gap-2">
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => dispatch(setProductType(type))}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                selectedProductType === type
                  ? "bg-purple-500 text-white"
                  : "hover:bg-purple-100 text-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Filters Section */}
      {selectedProductType && (
        <div className="p-5 space-y-6">
          <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <FaFilter className="text-purple-500" /> Filter Results
          </h4>

          {/* 🔸 Categories */}
          <div>
            <p className="font-medium text-gray-700 mb-2">Categories:</p>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat._id);
                return (
                  <span
                    key={cat._id}
                    onClick={() => dispatch(setCategoryId(cat._id))}
                    className={`cursor-pointer px-4 py-2 rounded-md text-sm transition ${
                      isSelected
                        ? "bg-purple-200 text-purple-800"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {cat.displayName || cat.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 🔸 Attribute Filters */}
          {filterSource.length > 0 && (
            <div className="space-y-5">
              {filterSource.map((filter, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-gray-700 mb-1">{filter.displayName}:</p>
                  <div className="flex flex-wrap gap-2 ml-1">
                    {filter.values.map((value) => {
                      const isSelected = selectedAttributes[filter.Key]?.includes(value) || false;
                      return (
                        <span
                          key={value}
                          onClick={() => dispatch(toggleAttributeValue({ key: filter.Key, value }))}
                          className={`cursor-pointer px-3 py-1 rounded-md text-sm transition ${
                            isSelected
                              ? "bg-purple-200 text-purple-500"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {value}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Reset Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => dispatch(resetFilters())}
              className="mt-3 inline-block text-sm font-medium bg-gray-50 border border-gray-300 px-4 py-2 text-gray-500 hover:text-red-500 hover:border-red-300 transition rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopFilters;
