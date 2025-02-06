import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  return (
    <div className="container mx-auto py-10 px-6">
      {/* ✅ Hero Section */}
      <div className="relative bg-purple-500 text-white text-center py-16 px-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-3">Welcome to Megadie.com</h1>
        <p className="text-lg text-gray-200">
          Find high-quality products at unbeatable prices.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-block bg-white text-purple-500 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition"
        >
          Browse Products
        </Link>
      </div>

      {/* ✅ Section Title */}
      <h2 className="text-3xl font-semibold text-purple-500 mt-10 mb-6 text-center">
        Featured Products
      </h2>

      {/* ✅ Loading State */}
      {isLoading && (
        <p className="text-center text-gray-500 text-lg">Loading products...</p>
      )}

      {/* ✅ Error Handling */}
      {error && (
        <Message type="error">
          <p className="text-lg font-medium">Failed to load products.</p>
          {error?.status && <p>Status: {error.status}</p>}
          {error?.error && <p>Error: {error.error}</p>}
        </Message>
      )}

      {/* ✅ Product Grid */}
      {!isLoading && !error && products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        !isLoading &&
        !error && (
          <p className="text-center text-gray-500 text-lg">No products found.</p>
        )
      )}
    </div>
  );
};

export default Home;
