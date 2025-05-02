import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import { toast } from "react-toastify";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categories = [], isLoading: isCategoriesLoading, error } = useGetCategoriesQuery();

  const [formData, setFormData] = useState({
    productType: "Ribbon",
    category: "",
    size: "",
    color: "",
    code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      setTimeout(() => {
        navigate("/admin/products");
      }, 500); // Wait a bit to show success toast before redirect
    } catch (err) {
      console.error("Failed to create product", err);
      toast.error("Failed to create product. Please try again.");
    }
  };

  const sizeOptions = [
    "1-inch",
    "0.5-inch",
    "0.4x1.5",
    "0.5x1.5",
    "0.5x1.6",
    "6mm",
    "9mm",
    "10mm",
    "12mm",
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-700">Create Product</h2>
        <button
          form="product-create-form"
          type="submit"
          disabled={isLoading}
          className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-sm"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>

      <form id="product-create-form" onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <label className="block mb-1">Product Type</label>
          <select
            name="productType"
            required
            value={formData.productType}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option>Ribbon</option>
            <option>Creasing Matrix</option>
            <option>Double Face Tape</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Category</label>
          {isCategoriesLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.displayName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-1">Size</label>
          <select
            name="size"
            required
            value={formData.size}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Size</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Color</label>
          <input
            type="text"
            placeholder="White, Black…etc"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Code</label>
          <input
            type="text"
            placeholder="Catalog Code…"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
