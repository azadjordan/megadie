import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import Message from "../components/Message";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    productType: "",
    category: "",
    size: "",
    color: "",
    code: "",
    stock: 0,
    moq: 1,
    isAvailable: true,
    origin: "",
    price: 0,
    unit: "roll",
    description: "",
    displaySpecs: "",
    storageLocation: "",
    images: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        productType: product.productType || "",
        category: product.category?._id || product.category || "",
        size: product.size || "",
        color: product.color || "",
        code: product.code || "",
        stock: product.stock || 0,
        moq: product.moq || 1,
        isAvailable: product.isAvailable,
        origin: product.origin || "",
        price: product.price || 0,
        unit: product.unit || "roll",
        description: product.description || "",
        displaySpecs: product.displaySpecs || "",
        storageLocation: product.storageLocation || "",
        images: product.images || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id, ...formData }).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  const productTypes = [...new Set(categories.map((cat) => cat.productType))];
  const relatedCategories = categories.filter(
    (cat) => cat.productType === formData.productType
  );

  if (isLoading) return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  if (error) return <Message type="error">Failed to load product.</Message>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Edit Product</h2>

      {/* 🔹 Product Type */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Product Type</label>
        <select
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
        >
          <option value="">Select a type</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Category */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border px-3 py-1 rounded text-sm"
        >
          <option value="">Select a category</option>
          {relatedCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.displayName || cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Other Fields */}
      {[
        "name",
        "size",
        "color",
        "code",
        "stock",
        "moq",
        "origin",
        "price",
        "unit",
        "description",
        "displaySpecs",
        "storageLocation",
      ].map((field) => (
        <div key={field}>
          <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded text-sm"
            type={["stock", "moq", "price"].includes(field) ? "number" : "text"}
          />
        </div>
      ))}

      {/* 🔹 Availability */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        <label className="text-sm text-gray-700">Is Available</label>
      </div>

      {/* 🔹 Image URLs + Preview */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Images</label>
        {formData.images.map((img, index) => (
          <div key={index} className="mb-3 flex items-center gap-4">
            <img
              src={img}
              alt={`img-${index}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <input
              type="text"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="flex-1 border px-2 py-1 rounded text-sm"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="text-red-500 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImage}
          className="text-sm text-purple-600 hover:underline mt-2"
        >
          + Add Image
        </button>
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {isUpdating ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default ProductUpdate;
