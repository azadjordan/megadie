import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetProductsAdminQuery } from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminProductFilters from "../components/AdminProductFilters";

const ProductList = () => {
  const { selectedProductType, selectedCategoryIds, selectedAttributes } =
    useSelector((state) => state.adminFilters);

  const [page] = useState(1); // You can extend pagination later

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

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 max-w-screen-xl mx-auto">
      {/* 🔹 Sidebar Filters */}
      <aside className="w-full md:w-1/6">
        <AdminProductFilters />
      </aside>

      {/* 🔹 Product Table */}
      <main className="w-full md:w-5/6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          All Products
        </h2>

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
                      <button className="text-red-600 hover:text-red-800">
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
