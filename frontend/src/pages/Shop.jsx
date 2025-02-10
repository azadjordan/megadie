import { useState } from "react";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";

const Shop = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  return (
    <div className="mt-[80px] container mx-auto px-6 py-12">
      {/* ✅ Page Header */}
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Shop All Products</h2>

      {/* ✅ Loading & Error States */}
      {isLoading && <p className="text-center text-gray-500 text-lg">Loading products...</p>}
      {error && (
        <Message type="error">
          <p className="text-lg font-medium">Failed to load products.</p>
        </Message>
      )}

      {/* ✅ Products Grid*/}
      {!isLoading && !error && products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        !isLoading &&
        !error && <p className="text-center text-gray-500 text-lg">No products found.</p>
      )}
    </div>
  );
};

export default Shop;
