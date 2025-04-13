import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux"; // ✅ Import useDispatch
import { addToCart } from "../slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch(); // ✅ Use Redux dispatch
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false); // ✅ State to track button feedback

  // ✅ Extract Dimensional & Textual Attributes
  const sizeAttributes = [product?.attributes?.d1, product?.attributes?.d2, product?.attributes?.d3]
    .filter(Boolean)
    .join(" x ");
  const textAttributes = [product?.attributes?.t1, product?.attributes?.t2, product?.attributes?.t3]
    .filter(Boolean)
    .join(" | ");

  // ✅ Handle Quantity Change
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta)); // Prevents going below 1
  };

  // ✅ Handle Add to Cart
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity })); // ✅ Dispatch Redux action
    setQuantity(1); // ✅ Reset quantity to 1

    // ✅ Show "Added" state for 2 seconds
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col h-full relative">
      {/* ✅ Product Image */}
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.images?.length > 0 ? product.images[0] : "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>

      {/* ✅ Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-500 transition">
            {product.name}
          </h3>
        </Link>

        {/* ✅ Display Size and Textual Attributes */}
        {(sizeAttributes || textAttributes) && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
            {sizeAttributes && <span className="font-medium">{sizeAttributes}</span>}
            {sizeAttributes && textAttributes && " | "}
            {textAttributes}
          </p>
        )}
      </div>

      {/* ✅ Bottom Section: Quantity Controls + Cart Button */}
      <div className="p-4 flex items-center justify-between">
        {/* 🔹 Quantity Selector (Bottom-Left) */}
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity === 1}
            className="p-1 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
          >
            <FaMinus size={12} />
          </button>

          <span className="text-sm font-semibold mx-2">{quantity}</span>

          <button
            onClick={() => handleQuantityChange(1)}
            className="p-1 text-gray-500 hover:text-purple-500 cursor-pointer"
          >
            <FaPlus size={12} />
          </button>
        </div>

        {/* 🔹 Add to Cart Button (Bottom-Right) */}
        <button
        disabled={!product?.isAvailable || isAdded}
          onClick={handleAddToCart}
          className={`p-2 rounded-full cursor-pointer flex items-center justify-center shadow-md transition ${
            isAdded
              ? "bg-green-500 text-white" // ✅ Show success feedback
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
