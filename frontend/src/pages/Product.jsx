import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Message from "../components/Message";

const Product = () => {
  const { id } = useParams(); // Get product ID from URL
  const dispatch = useDispatch();
  const { data: product, error, isLoading } = useGetProductByIdQuery(id); // Fetch product by ID

  const [quantity, setQuantity] = useState(1); // Track quantity input

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  if (isLoading) {
    return <h2 className="text-2xl text-gray-500 text-center">Loading product...</h2>;
  }

  if (error) {
    return <Message type="error">{error?.data?.message || "Product not found!"}</Message>;
  }

  return (
    <div className="container mx-auto py-10">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition mb-7 cursor-pointer"
      >
        Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-96 object-cover rounded-lg"
        />

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
          <p className="text-gray-600 text-lg">{product?.description || "No description available."}</p>
          <p className="text-2xl font-semibold text-violet-600">${product?.price?.toFixed(2)}</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white w-fit rounded border-1 border-gray-300">
            <button 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
              disabled={quantity === 1}
              className="p-1 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
            >
              <FaMinus size={18} />
            </button>
            <span className="text-md font-semibold">{quantity}</span>
            <button 
              onClick={() => setQuantity(prev => prev + 1)} 
              className="p-1 text-gray-500 hover:text-purple-500 cursor-pointer"
            >
              <FaPlus size={18} />
            </button>
          </div>

          <button 
            onClick={handleAddToCart} 
            className="bg-violet-500 text-white py-2 px-4 rounded hover:bg-violet-600 transition cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
