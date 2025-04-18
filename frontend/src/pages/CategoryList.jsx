import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "../slices/categoriesApiSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [creatingStatus, setCreatingStatus] = useState("");

  const handleCreate = async () => {
    setCreatingStatus("");
    try {
      await createCategory().unwrap();
      setCreatingStatus("Category created successfully.");
    } catch (err) {
      setCreatingStatus("Failed to create category.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 w-full ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Categories</h2>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create New Category"}
        </button>
      </div>

      {creatingStatus && (
        <div className="mb-4 text-sm text-gray-600 italic">{creatingStatus}</div>
      )}

      {/* States */}
      {isLoading ? (
        <p className="text-gray-500 italic">Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching categories.</p>
      ) : categories?.length === 0 ? (
        <p className="text-gray-600 italic">No categories found.</p>
      ) : (
        <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/admin/categories/${category._id}/edit`}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition block"
            >
              {/* Image */}
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Prefer displayName if available */}
                <h3 className="text-lg font-semibold text-purple-700">
                  {category.displayName || category.name}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Type:</span> {category.productType}
                </p>

                {category.description && (
                  <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                )}

                {category.filters?.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Filters:</span>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {[...category.filters]
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((filter, idx) => (
                          <li key={idx}>
                            {filter.displayName}:{" "}
                            <span className="text-gray-700">
                              {filter.values.join(", ")}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
