import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import QuantityControl from "./QuantityControl"; // Adjust path if needed

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const moq = product.moq || 1;
  const [quantity, setQuantity] = useState(moq);
  const [isAdded, setIsAdded] = useState(false);

  const isUnderMOQ = quantity < moq;
  const displaySpecs = product.displaySpecs || "";
  const image = product.images?.[0] || "/placeholder.jpg";

  const handleAddToCart = () => {
    if (isUnderMOQ || !product.isAvailable) return;
  
    dispatch(addToCart({ ...product, quantity }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
    setQuantity(moq);
  };
  
  return (
    <div className="relative bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition h-full border-gray-300 border">
      {/* ❌ Not Available Tooltip */}
      {!product.isAvailable && (
        <div className="absolute top-2 right-2 bg-white text-red-500 font-semibold text-xs px-3 py-1 z-10">
          Not Available
        </div>
      )}

      {/* ✅ Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>

      {/* ✅ Details Section */}
      <div className="p-4 pb-0 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-md font-semibold text-gray-800 hover:text-purple-600">
            {product.name}
          </h3>
        </Link>

        {displaySpecs && (
          <div className="flex flex-wrap gap-2 mt-2">
            {displaySpecs.split(",").map((spec, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-700 text-xs px-1 "
              >
                {spec.trim()}
              </span>
            ))}
          </div>
        )}

        {/* ✅ MOQ Tag with Conditional Style */}
        <p
          className={`text-xs mt-2 px-2 py-1 w-fit rounded transition-colors duration-200
            ${
              isUnderMOQ
                ? "bg-red-100 text-red-700"
                : "bg-yellow-50 text-gray-500"
            }`}
          style={{ minHeight: "1.75rem" }}
        >
          <span
            className={`font-medium ${
              isUnderMOQ ? "text-red-800" : "text-gray-700"
            }`}
          >
            {isUnderMOQ ? "Minimum is" : "MOQ:"}
          </span>{" "}
          {moq}
        </p>
      </div>

      {/* ✅ Bottom Section */}
      <div className="mt-2 px-1 sm:px-4 pb-4 flex items-center justify-between">
        <QuantityControl quantity={quantity} setQuantity={setQuantity} />

        <button
          disabled={!product.isAvailable || isAdded || isUnderMOQ}
          onClick={handleAddToCart}
          aria-label={isAdded ? "Added to cart" : "Add to cart"}
          className={`p-1 py-2 rounded-md sm:p-2 sm:rounded-full shadow-md transition flex items-center justify-center
            ${
              !product.isAvailable || isAdded || isUnderMOQ
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-400 text-white hover:bg-purple-500 cursor-pointer"
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
