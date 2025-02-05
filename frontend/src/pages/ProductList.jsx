import { useGetProductsQuery, useAddProductMutation, useDeleteProductMutation } from "../slices/productsApiSlice";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from "react";

const ProductList = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [message, setMessage] = useState("");

  // Default product values
  const defaultProduct = {
    name: "New Product",
    source: "China",
    category: "Other",
    description: "Default description",
    price: 0,
    qty: 0,
    image: "https://via.placeholder.com/150",
    inStock: true,
    specifications: {},
  };

  // Create new product and redirect to edit page
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

  const deleteHandler = async (id) => {
    setMessage(`Deleting product ${id}...`);
    try {
      setDeletingProductId(id);
      await deleteProduct(id).unwrap();
      setMessage("Product deleted successfully.");
    } catch (error) {
      setMessage("Failed to delete product.");
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
        <button
          onClick={createProductHandler}
          disabled={isAdding}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          <FaPlus />
          {isAdding ? "Creating..." : "Create New Product"}
        </button>
      </div>

      {/* Display success/error messages */}
      {message && <p className="mb-4 text-gray-700">{message}</p>}

      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching products</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .slice() // Create a copy before sorting
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort newest first
                .map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{product._id}</td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3 flex space-x-4">
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
