import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import { useSelector } from "react-redux";


const Shop = () => {
  const { selectedProductType, selectedCategoryIds, selectedAttributes } = useSelector(
    (state) => state.filters
  );
  
  const { data: products, isLoading, error } = useGetProductsQuery({
    productType: selectedProductType,
    categoryIds: selectedCategoryIds,
    attributes: selectedAttributes,
  });
  
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-screen-xl mx-auto">
      {/* 🔹 Left Filter Sidebar */}
      <aside className="w-full md:w-1/4  h-fit">
        <ShopFilters />
      </aside>

      {/* 🔹 Right Product Grid */}
      <main className="w-full md:w-3/4">
        {isLoading ? (
          <p className="text-gray-500 italic">Loading products...</p>
        ) : error ? (
          <p className="text-red-500">Error loading products.</p>
        ) : products?.length === 0 ? (
          <p className="text-gray-600 italic">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
