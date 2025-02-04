import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";

const Home = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold bg-amber-100 w-fit p-4 text-gray-700 mb-6 ml-6">Our Products</h1>

      {isLoading && <p className="text-center text-gray-500">Loading products...</p>}

      {error && (
        <Message type="error">
          <p>Failed to load products.</p>
          {error?.status && <p>Status: {error.status}</p>}
          {error?.error && <p>Error: {error.error}</p>}
        </Message>
      )}

      {!isLoading && !error && products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        !isLoading && !error && <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default Home;
