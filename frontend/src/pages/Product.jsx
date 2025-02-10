import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Message from "../components/Message";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  if (isLoading) {
    return <h2 className="text-2xl text-gray-500 text-center py-10">Loading product...</h2>;
  }

  if (error) {
    return <Message type="error">{error?.data?.message || "Product not found!"}</Message>;
  }

  return (
    <div className="container mx-auto py-12 px-6 pt-[80px]">
      {/* ✅ Back to Shop Button */}
      <Link
        to="/shop"
        className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition mb-6"
      >
        ← Back to Shop
      </Link>

      {/* ✅ Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ✅ Product Image with Hover */}
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-[500px] object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* ✅ Product Info */}
        <div className="space-y-5">
          <h1 className="text-4xl font-bold text-gray-900">{product?.name}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{product?.description || "No description available."}</p>
          <p className="text-3xl font-semibold text-purple-600">${product?.price?.toFixed(2)}</p>

          {/* ✅ Quantity Controls */}
          <div className="flex items-center gap-4 bg-gray-100 w-fit px-4 py-2 rounded-lg border border-gray-300">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity === 1}
              className="p-2 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
            >
              <FaMinus size={20} />
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-2 text-gray-500 hover:text-purple-500 cursor-pointer"
            >
              <FaPlus size={20} />
            </button>
          </div>

          {/* ✅ Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-purple-500 text-white text-lg py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
