import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetProductsAdminQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminProductFilters from "../components/AdminProductFilters";

const ProductList = () => {
  const { selectedProductType, selectedCategoryIds, selectedAttributes } =
    useSelector((state) => state.adminFilters);

  const [page] = useState(1);
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsAdminQuery({
    productType: selectedProductType,
    categoryIds: selectedCategoryIds,
    attributes: selectedAttributes,
  });

  useEffect(() => {
    refetch();
  }, [selectedProductType, selectedCategoryIds, selectedAttributes, refetch]);

  const handleCreateProduct = async () => {
    try {
      if (!selectedCategoryIds.length) {
        alert("Please select a category first.");
        return;
      }

      await createProduct({
        name: "Sample Product",
        productType: selectedProductType || "Ribbon",
        category: selectedCategoryIds[0],
        size: "1-inch",
        color: "Red",
        code: `CODE-${Math.floor(Math.random() * 10000)}`,
        displaySpecs: "Red | 1-inch",
        stock: 100,
        moq: 5,
        isAvailable: true,
        origin: "China",
        storageLocation: "Warehouse A - Shelf 1",
        price: 10.5,
        unit: "roll",
        images: [],
        description: "This is a sample product.",
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("❌ Failed to create product", err);
      alert("Failed to create product. Check console for details.");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id).unwrap();
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete product", err);
      alert("Failed to delete product. Check console for details.");
    }
  };

  return (
<div className="flex flex-col md:flex-row gap-4 p-6 w-full">
{/* 🔹 Sidebar Filters */}
      <aside className="w-full md:w-1/5">
        <AdminProductFilters />
      </aside>

      {/* 🔹 Product Table Section */}
      <main className="w-full md:w-4/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-purple-700">All Products</h2>
          <button
            onClick={handleCreateProduct}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
          >
            <FaPlus /> Create Product
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-red-500">Error loading products.</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{prod.name}</td>
                    <td className="px-4 py-2">{prod.category?.name || "-"}</td>
                    <td className="px-4 py-2">{prod.productType}</td>
                    <td className="px-4 py-2">{prod.code || "-"}</td>
                    <td className="px-4 py-2">{prod.size}</td>
                    <td className="px-4 py-2">{prod.stock}</td>
                    <td className="px-4 py-2">{prod.price?.toFixed(2)} AED</td>
                    <td className="px-4 py-2 space-x-2">
                      <Link to={`/admin/products/${prod._id}/edit`}>
                        <button className="text-purple-600 hover:text-purple-800">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
