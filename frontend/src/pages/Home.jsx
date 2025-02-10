import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto py-10 px-6">
      {/* ✅ Hero Section */}
      <div className="relative bg-purple-500 text-white text-center py-16 px-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-3">Welcome to Megadie.com</h1>
        <p className="text-lg text-gray-200">
          Find high-quality products at unbeatable prices.
        </p>
        <Link
          to="/shop"
          className="mt-5 inline-block bg-white text-purple-500 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default Home;
