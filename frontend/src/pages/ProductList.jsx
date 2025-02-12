import { useGetProductsQuery, useAddProductMutation, useDeleteProductMutation } from "../slices/productsApiSlice";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from "react";

const ProductList = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [message, setMessage] = useState("");

  const defaultProduct = {
    name: "New Product",
    category: "Other",
    material: "Unknown",
    size: "N/A",
    color: "N/A",
    code: `P-${Date.now()}`,
    description: "Default description",
    price: 0,
    stock: 0,
    image: "https://via.placeholder.com/150",
    isAvailable: true,
  };

  // ✅ Create a new product and redirect to edit page
  const createProductHandler = async () => {
    setMessage("Creating new product...");
    try {
      const newProduct = await addProduct(defaultProduct).unwrap();
      setMessage("Product created! Redirecting...");
      navigate(`/admin/product/edit/${newProduct._id}`);
    } catch (error) {
      setMessage("Failed to create product.");
    }
  };

  // ✅ Delete product
  const deleteHandler = async (id) => {
    setMessage(`Deleting product ${id}...`);
    try {
      setDeletingProductId(id);
      await deleteProduct(id).unwrap();
      setMessage("Product deleted successfully.");
      refetch(); // Refresh product list
    } catch (error) {
      setMessage("Failed to delete product.");
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 pt-[120px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={createProductHandler}
          disabled={isAdding}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          <FaPlus />
          {isAdding ? "Creating..." : "Add New Product"}
        </button>
      </div>

      {message && <p className="text-center text-purple-600">{message}</p>}

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading products...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error fetching products.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-purple-500 text-white">
              <tr>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Material</th>
                <th className="py-4 px-6">Size</th>
                <th className="py-4 px-6">Color</th>
                <th className="py-4 px-6">Code</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Available</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">{product.material || "N/A"}</td>
                  <td className="py-4 px-6">{product.size || "N/A"}</td>
                  <td className="py-4 px-6">{product.color || "N/A"}</td>
                  <td className="py-4 px-6">{product.code || "N/A"}</td>
                  <td className="py-4 px-6">{product.description}</td>
                  <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-6">{product.stock}</td>
                  <td className="py-4 px-6">{product.isAvailable ? "✅" : "❌"}</td>
                  <td className="py-4 px-6 flex space-x-4">
                    <button
                      onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      disabled={deletingProductId === product._id}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
