import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(product.moq || 1, prev + delta));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
    setQuantity(product.moq || 1);
  };

  const displaySpecs = product.displaySpecs || "";
  const image = product.images?.[0] || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition h-full">
      {/* ✅ Product Image */}
      <Link to={`/product/${product._id}`}>
        <img src={image} alt={product.name} className="h-48 w-full object-cover" />
      </Link>

      {/* ✅ Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-md font-semibold text-gray-800 hover:text-purple-600">
            {product.name}
          </h3>
        </Link>

        {displaySpecs && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{displaySpecs}</p>
        )}

        <div className="mt-3 text-sm text-gray-700">
          <span className="font-bold">{product.price.toFixed(2)} AED</span> / {product.unit}
        </div>

        <div className="mt-1 text-xs text-gray-500">
          MOQ: {product.moq} &middot; Stock: {product.stock}
        </div>

        {!product.isAvailable && (
          <p className="text-red-500 text-xs mt-2 font-medium">Not Available</p>
        )}
      </div>

      {/* ✅ Bottom Section: Quantity + Add to Cart */}
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= (product.moq || 1)}
            className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-40"
          >
            <FaMinus size={12} />
          </button>
          <span className="text-sm font-semibold mx-2">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-1 text-gray-500 hover:text-purple-600"
          >
            <FaPlus size={12} />
          </button>
        </div>

        <button
          disabled={!product.isAvailable || isAdded}
          onClick={handleAddToCart}
          className={`p-2 rounded-full shadow-md transition flex items-center justify-center ${
            isAdded
              ? "bg-green-500 text-white"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          {isAdded ? <FaCheck size={14} /> : <FaShoppingCart size={14} />}
          {!isAdded && <FaPlus size={10} className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
