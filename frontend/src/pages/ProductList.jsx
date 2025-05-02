import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteProductMutation,
  useGetProductsAdminQuery,
} from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminProductFilters from "../components/AdminProductFilters";

const ProductList = () => {
  const {
    selectedProductType,
    selectedCategoryIds,
    selectedAttributes,
  } = useSelector((state) => state.adminFilters);

  const query = {
    ...(selectedProductType && { productType: selectedProductType }),
    ...(selectedCategoryIds.length > 0 && { categoryIds: selectedCategoryIds }),
    ...(Object.keys(selectedAttributes).length > 0 && { attributes: selectedAttributes }),
  };

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsAdminQuery(query);

  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProductType, selectedCategoryIds, selectedAttributes]);

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
      <aside className="w-full md:w-1/4 h-fit">
        <AdminProductFilters />
      </aside>

      {/* 🔹 Product Table Section */}
      <main className="w-full md:w-3/4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-purple-700">All Products</h2>
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
          >
            <FaPlus /> Create Product
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-red-500">Error loading products.</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 text-left">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Specs</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr
                    key={prod._id}
                    className="hover:bg-gray-200 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">{prod.name}</td>
                    <td className="px-4 py-3 whitespace-pre-wrap">
                      {prod.displaySpecs || "-"}
                    </td>
                    <td className="px-4 py-3">{prod.code || "-"}</td>
                    <td className="px-4 py-3">{prod.size}</td>
                    <td className="px-4 py-3">{prod.stock}</td>
                    <td className="px-4 py-3">{prod.price?.toFixed(2)} AED</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-end space-x-1">
                        <Link to={`/admin/products/${prod._id}/edit`}>
                          <button
                            className="p-2 text-purple-600 hover:text-purple-800 cursor-pointer"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete Product"
                        >
                          <FaTrash />
                        </button>
                      </div>
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
