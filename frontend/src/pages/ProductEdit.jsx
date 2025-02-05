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
      setFormData({
        name: product.name,
        source: product.source,
        category: product.category,
        description: product.description,
        price: product.price,
        qty: product.qty,
        image: product.image,
        inStock: product.inStock,
        specifications: product.specifications || {},
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

  // ✅ Handle changing specification values
  const handleSpecValueChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  // ✅ Handle changing specification keys (renaming)
  const handleSpecKeyChange = (oldKey, newKey) => {
    if (!newKey.trim() || newKey in formData.specifications) return; // Prevent empty or duplicate keys

    setFormData((prev) => {
      const updatedSpecs = { ...prev.specifications };
      updatedSpecs[newKey] = updatedSpecs[oldKey]; // Copy value to new key
      delete updatedSpecs[oldKey]; // Remove old key
      return { ...prev, specifications: updatedSpecs };
    });
  };

  // ✅ Add a new specification field
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, "New Spec": "" },
    }));
  };

  // ✅ Remove a specification
  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id: productId, ...formData }).unwrap();
      setMessage("Product updated successfully.");
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (error) {
      setMessage("Failed to update product.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      {message && <p className="mb-4 text-gray-700">{message}</p>}
      {isLoading ? (
        <p>Loading product details...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching product</p>
      ) : (
        <form onSubmit={submitHandler} className="bg-white p-6 shadow rounded-lg">
          {/* Name */}
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Source */}
          <label className="block mb-2">Source:</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Category */}
          <label className="block mb-2">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="Ribbons">Ribbons</option>
            <option value="Tapes">Tapes</option>
            <option value="Creasing Channel">Creasing Channel</option>
            <option value="Die Ejection Rubber">Die Ejection Rubber</option>
            <option value="Magnets">Magnets</option>
            <option value="Other">Other</option>
          </select>

          {/* Description */}
          <label className="block mb-2">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Price */}
          <label className="block mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Quantity */}
          <label className="block mb-2">Quantity:</label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Specifications */}
          <div className="mt-4">
            <h2 className="text-lg font-bold">Specifications</h2>
            {Object.keys(formData.specifications).map((key) => (
              <div key={key} className="flex items-center space-x-2 mt-2">
                {/* Editable Key */}
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleSpecKeyChange(key, e.target.value)}
                  className="border p-2 w-1/3"
                />
                {/* Editable Value */}
                <input
                  type="text"
                  value={formData.specifications[key]}
                  onChange={(e) => handleSpecValueChange(key, e.target.value)}
                  className="border p-2 w-1/3"
                />
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecification}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Specification
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded"
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEdit;
