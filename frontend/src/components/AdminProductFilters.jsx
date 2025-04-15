import { useDispatch, useSelector } from "react-redux";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import {
  setProductType,
  setCategoryId,
  toggleAttributeValue,
  resetFilters,
} from "../slices/adminFiltersSlice";
import { FaBoxOpen, FaFilter } from "react-icons/fa";

const AdminProductFilters = () => {
  const dispatch = useDispatch();
  const { selectedProductType, selectedCategoryIds, selectedAttributes } = useSelector(
    (state) => state.adminFilters
  );

  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  if (isLoading || error) return null;

  const productTypes = [...new Set(categories.map((cat) => cat.productType))];
  const relatedCategories = categories.filter((cat) => cat.productType === selectedProductType);

  const allFilters =
    selectedCategoryIds.length > 0
      ? relatedCategories.filter((cat) => selectedCategoryIds.includes(cat._id)).flatMap((cat) => cat.filters || [])
      : relatedCategories.flatMap((cat) => cat.filters || []);

  const merged = {};
  for (const filter of allFilters) {
    const key = filter.Key;
    if (!merged[key]) {
      merged[key] = { ...filter, values: [...filter.values] };
    } else {
      merged[key].values = [...new Set([...merged[key].values, ...filter.values])];
    }
  }

  const filterSource = Object.values(merged).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className=" text-xs text-gray-700 bg-white border border-gray-200 rounded-md p-3 space-y-4">
      {/* 🔹 Product Type */}
      <div>
        <h3 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
          <FaBoxOpen className="text-purple-500" /> Product Type
        </h3>
        <div className="flex flex-col gap-1">
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => dispatch(setProductType(type))}
              className={`text-left px-2 py-1 rounded text-xs font-medium transition ${
                selectedProductType === type
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-100 text-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Category */}
      {selectedProductType && (
        <div>
          <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
            <FaFilter className="text-purple-500" /> Categories
          </h4>
          <div className="flex flex-wrap gap-1">
            {relatedCategories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat._id);
              return (
                <span
                  key={cat._id}
                  onClick={() => dispatch(setCategoryId(cat._id))}
                  className={`cursor-pointer px-3 py-1 rounded text-xs transition ${
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
      )}

      {/* 🔹 Attributes */}
      {filterSource.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
            <FaFilter className="text-purple-500" /> Attributes
          </h4>
          <div className="space-y-2">
            {filterSource.map((filter) => (
              <div key={filter.Key}>
                <p className="font-medium text-gray-800 mb-1 text-xs">{filter.displayName}:</p>
                <div className="flex flex-wrap gap-1 ml-1">
                  {filter.values.map((value) => {
                    const isSelected = selectedAttributes[filter.Key]?.includes(value);
                    return (
                      <span
                        key={value}
                        onClick={() => dispatch(toggleAttributeValue({ key: filter.Key, value }))}
                        className={`cursor-pointer px-2 py-1 rounded text-xs transition ${
                          isSelected
                            ? "bg-purple-200 text-purple-800"
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
        </div>
      )}

      {/* 🔹 Reset Button */}
      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={() => dispatch(resetFilters())}
          className="mt-2 inline-block text-xs font-medium text-purple-600 hover:text-red-600 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default AdminProductFilters;
