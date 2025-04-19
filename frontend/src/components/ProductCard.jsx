import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import QuantityControl from "./QuantityControl"; // Adjust path if needed

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
    setQuantity(product.moq || 1);
  };

  const displaySpecs = product.displaySpecs || "";
  const image = product.images?.[0] || "/placeholder.jpg";

  return (
    <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition h-full border-gray-300 border">
      {/* ✅ Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>

      {/* ✅ Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-md font-semibold text-gray-800 hover:text-purple-600">
            {product.name}
          </h3>
        </Link>

        {displaySpecs && (
  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
    {displaySpecs}
  </p>
)}

<p className="text-xs text-gray-500 mt-1">
  <span className="font-medium text-gray-700">MOQ:</span> {product.moq}
</p>


      </div>

      {/* ✅ Bottom Section: Quantity + Add to Cart */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <QuantityControl quantity={quantity} setQuantity={setQuantity} />

        <button
          disabled={!product.isAvailable || isAdded}
          onClick={handleAddToCart}
          className={`p-2 cursor-pointer rounded-full shadow-md transition flex items-center justify-center ${
            isAdded
              ? "bg-green-500 text-white"
              : "bg-purple-400 text-white hover:bg-purple-500"
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
