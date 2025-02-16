import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../slices/productsApiSlice";

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // ✅ Initialize form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    material: "",
    size: "",
    color: "",
    code: "",
    description: "",
    image: "",
    price: 0,
    stock: 0,
    isAvailable: true,
  });

  const [message, setMessage] = useState("");

  // ✅ Load product details into state
  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  // ✅ Handle form changes dynamically
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle form submission
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

  // ✅ Prevent blank page issue
  if (isLoading) {
    return <p className="text-gray-500 text-center py-10">Loading product details...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-10">Error fetching product.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Product</h1>

      {message && (
        <p className={`text-center font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-500"} mb-4`}>
          {message}
        </p>
      )}

      <form onSubmit={submitHandler} className="bg-white p-6 shadow-md rounded-lg">
        
        {/* ✅ Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
          />
        </div>

        {/* ✅ Product Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Product Image URL</label>
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

        {/* ✅ Price & Stock */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
          </div>
        </div>

        {/* ✅ Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category</label>
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

        {/* ✅ Material, Size & Color */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring focus:ring-purple-300"
            />
          </div>
        </div>

        {/* ✅ In Stock Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="mr-2 focus:ring focus:ring-purple-300"
          />
          <label className="text-gray-700 font-medium">Available</label>
        </div>

        {/* ✅ Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24 focus:ring focus:ring-purple-300"
          />
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded w-full hover:bg-green-600 transition"
        >
          {isUpdating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
