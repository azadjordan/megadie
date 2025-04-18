import { useParams } from "react-router-dom";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../slices/categoriesApiSlice";
import { useState, useEffect } from "react";
import CategoryFiltersUpdate from "../components/CategoryFiltersUpdate";

const CategoryUpdate = () => {
  const { id } = useParams();
  const { data: category, isLoading, error } = useGetCategoryByIdQuery(id);
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    productType: "",
    description: "",
    position: 0,
    isActive: true,
    image: "",
    filters: [],
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        displayName: category.displayName || "",
        productType: category.productType,
        description: category.description || "",
        position: category.position || 0,
        isActive: category.isActive,
        image: category.image || "",
        filters: category.filters || [],
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({ id, ...formData }).unwrap();
      alert("Category updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-sm text-red-500">Error loading category.</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-screen-sm mx-auto text-sm space-y-4"
    >
      <h2 className="text-xl font-semibold text-purple-700">Edit Category</h2>

      <div>
        <span className="font-medium text-gray-700">ID:</span> {id}
      </div>

      {/* ✅ Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
        />
      </div>

      {/* ✅ Display Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Display Name</label>
        <input
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
          placeholder="e.g., Satin Ribbon"
        />
      </div>

      {/* ✅ Product Type */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Product Type</label>
        <select
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
        >
          <option value="">Select a type</option>
          <option value="Ribbon">Ribbon</option>
          <option value="Creasing Matrix">Creasing Matrix</option>
          <option value="Double Face Tape">Double Face Tape</option>
        </select>
      </div>

      {/* ✅ Description */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
          rows={3}
          placeholder="Optional description..."
        />
      </div>

      {/* ✅ Position */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Position</label>
        <input
          type="number"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
          min={0}
        />
      </div>

      {/* ✅ Is Active */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
        />
        <label className="font-medium text-gray-700">Is Active</label>
      </div>

      {/* ✅ Image URL */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Image URL</label>
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
          placeholder="https://..."
        />
      </div>

      {/* ✅ Editable Filters Section */}
      <CategoryFiltersUpdate
        filters={formData.filters}
        setFilters={(updatedFilters) =>
          setFormData((prev) => ({ ...prev, filters: updatedFilters }))
        }
      />

      <div>
        <button
          type="submit"
          disabled={updating}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default CategoryUpdate;
