import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../slices/productsApiSlice";

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    source: "China",
    category: "Ribbons",
    description: "",
    price: 0,
    qty: 0,
    image: "",
    inStock: true,
    specifications: {},
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id: productId, ...formData }).unwrap();
      setMessage("✅ Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (error) {
      setMessage("❌ Failed to update product.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 pt-[120px]">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Product</h1>

      {message && (
        <p className={`text-center font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-500"} mb-4`}>
          {message}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-500 text-center py-10">Loading product details...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-10">Error fetching product.</p>
      ) : (
        <form onSubmit={submitHandler} className="bg-white p-6 shadow-md rounded-lg max-w-3xl mx-auto">
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
          </div>

          {/* Product Image */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Product Image URL:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Product Preview"
                className="w-32 h-32 mt-2 rounded-md object-cover border border-gray-200"
              />
            )}
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium">Price ($):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Quantity:</label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            >
              <option value="Ribbons">Ribbons</option>
              <option value="Tapes">Tapes</option>
              <option value="Creasing Channel">Creasing Channel</option>
              <option value="Die Ejection Rubber">Die Ejection Rubber</option>
              <option value="Magnets">Magnets</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* In Stock Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="mr-2 focus:ring focus:ring-purple-300"
            />
            <label className="text-gray-700 font-medium">In Stock</label>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded h-24 focus:ring focus:ring-purple-300"
            />
          </div>

          {/* Specifications */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Specifications</h2>
            {Object.keys(formData.specifications).map((key) => (
              <div key={key} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    if (!newKey.trim() || newKey in formData.specifications) return;
                    setFormData((prev) => {
                      const specs = { ...prev.specifications };
                      specs[newKey] = specs[key];
                      delete specs[key];
                      return { ...prev, specifications: specs };
                    });
                  }}
                  className="border p-2 w-1/3 focus:ring focus:ring-purple-300"
                />
                <input
                  type="text"
                  value={formData.specifications[key]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, [key]: e.target.value },
                    }))
                  }
                  className="border p-2 w-1/3 focus:ring focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => {
                      const newSpecs = { ...prev.specifications };
                      delete newSpecs[key];
                      return { ...prev, specifications: newSpecs };
                    })
                  }
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, specifications: { ...prev.specifications, "New Spec": "" } }))}
              className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Add Specification
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="mt-6 px-6 py-2 bg-green-500 text-white rounded w-full hover:bg-green-600 transition"
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEdit;
