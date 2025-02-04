import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.qty > 0 ? 1 : 0); // Set to 0 if out of stock

  // Ensure quantity stays 0 if out of stock
  useEffect(() => {
    if (product.qty === 0) {
      setQuantity(0);
    }
  }, [product.qty]);

  const handleAddToCart = () => {
    if (product.qty > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
      setQuantity(1); // Reset to 1 only if in stock
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 p-3 transition hover:shadow-lg">
      <Link 
        to={`/product/${product._id}`} 
        className="block cursor-pointer"
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-52 object-cover rounded-sm"
        />
        <h2 className="mt-3 text-lg font-medium text-gray-900">{product.name}</h2>
      </Link>
      <p className="text-gray-500 text-sm mt-1">${product.price.toFixed(2)}</p>

      {/* Stock Status */}
      <p className={`text-sm font-semibold ${product.qty > 0 ? "text-green-500" : "text-red-500"} mt-2`}>
        {product.qty > 0 ? "In Stock" : "Out of Stock"}
      </p>

      {/* Quantity & Add to Cart Section */}
      <div className="flex items-center justify-between mt-2">
        {/* Quantity Controls */}
        <div className="flex items-center bg-white w-fit rounded border border-gray-300 px-2">
          <button 
            onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : prev))}
            disabled={product.qty === 0 || quantity <= 1}
            className="p-1 text-gray-500 hover:text-purple-800 disabled:opacity-50 cursor-pointer"
          >
            <FaMinus size={14} />
          </button>
          <span className="text-sm font-semibold px-2">{quantity}</span>
          <button 
            onClick={() => setQuantity(prev => (product.qty > 0 ? prev + 1 : prev))}
            disabled={product.qty === 0}
            className="p-1 text-gray-500 hover:text-purple-800 disabled:opacity-50 cursor-pointer"
          >
            <FaPlus size={14} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.qty === 0}
          className={`text-purple-800 font-medium py-2 px-4 rounded-md cursor-pointer transition ${
            product.qty > 0 
              ? "hover:bg-purple-700 hover:text-white" 
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
