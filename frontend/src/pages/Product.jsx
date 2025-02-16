import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useState } from "react";
import { FaPlus, FaMinus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
    <div className="container mx-auto py-12 px-6 pt-[120px]">
      {/* ✅ Back to Shop Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition mb-6"
      >
        ← Back to Shop
      </Link>

      {/* ✅ Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ✅ Product Image - Fixed Layout with No Borders */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-[480px] object-cover rounded-lg"
          />
        </div>

        {/* ✅ Product Info */}
        <div className="space-y-6">
          {/* ✅ Product Name, Category, and Stock Status */}
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold text-gray-900">{product?.name}</h1>
            <p className="text-md text-gray-500">{product?.category}</p>

            {/* ✅ Stock Indicator (Smaller & Less Dominant) */}
            <div className="mt-2 flex items-center gap-2">
              {product?.stock > 0 ? (
                <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">
                  <FaCheckCircle size={14} />
                  In Stock
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">
                  <FaTimesCircle size={14} />
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* ✅ Product Price */}
          <p className="text-3xl font-semibold text-purple-600">${product?.price?.toFixed(2)}</p>

          {/* ✅ Product Description */}
          <p className="text-gray-700 text-md leading-relaxed">{product?.description}</p>

          {/* ✅ Product Specifications */}
          <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg text-gray-700">
            <p><strong>Material:</strong> {product?.material || "N/A"}</p>
            <p><strong>Size:</strong> {product?.size || "N/A"}</p>
            <p><strong>Color:</strong> {product?.color || "N/A"}</p>
            <p><strong>Product Code:</strong> {product?.code || "N/A"}</p>
          </div>

          {/* ✅ Quantity Controls */}
          <div className="flex items-center gap-4 bg-gray-100 w-fit px-4 py-2 rounded-lg border border-gray-300">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity === 1}
              className="p-3 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
            >
              <FaMinus size={20} />
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-3 text-gray-500 hover:text-purple-500 cursor-pointer"
            >
              <FaPlus size={20} />
            </button>
          </div>

          {/* ✅ Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product?.stock === 0}
            className={`w-full text-lg py-3 rounded-lg font-semibold transition ${
              product?.stock > 0
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {product?.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
