import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../slices/cartSlice";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingCart, FaTrash } from "react-icons/fa";

const Cart = () => {
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Cart Items Section */}
        <div className="md:w-2/3 bg-white p-6 shadow-sm">
          
          {/* Cart Header with Clear Cart Button */}
          <div className="flex items-center justify-between text-gray-700 w-full px-4 py-2 mb-4">
            {/* Left side: Cart title and icon */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Cart</h2>
              <FaShoppingCart className="text-xl" />
            </div>

            {/* Right side: Clear Cart Button */}
            <button 
              onClick={() => dispatch(clearCart())} 
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 text-md font-semibold transition cursor-pointer"
            >
              <FaTrash size={16} />
              <span>Clear Cart</span>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>Your cart is empty.</p>
              <Link to="/" className="mt-3 text-purple-500 hover:underline cursor-pointer">Shop Now</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex items-center py-4 border-b border-gray-200 last:border-none">
                
                {/* Remove Button */}
                <button 
                  onClick={() => dispatch(removeFromCart(item._id))} 
                  className="text-gray-400 hover:text-red-500 text-xl font-semibold px-2 cursor-pointer"
                >
                  ×
                </button>

                {/* Product Image */}
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />

                {/* Product Details */}
                <div className="flex flex-col flex-grow px-4">
                  <h2 className="text-sm font-medium text-gray-900">{item.name}</h2>
                  <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                  <p className="text-gray-900 font-semibold text-md">= ${ (item.price * item.quantity).toFixed(2) }</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-white w-fit rounded border-1 border-gray-300">
                  <button 
                    onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity - 1 }))} 
                    disabled={item.quantity === 1}
                    className="p-1 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
                  >
                    <FaMinus size={18} />
                  </button>
                  <span className="text-sm font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))} 
                    className="p-1 text-gray-500 hover:text-purple-500 cursor-pointer"
                  >
                    <FaPlus size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Summary Section */}
        {cartItems.length > 0 && (
          <div className="md:w-1/3 h-fit bg-white p-6 shadow-sm flex flex-col justify-between">
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
              <div className="flex justify-between text-gray-600 text-sm border-b pb-2 border-gray-200">
                <span>Items in cart:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 mt-2">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={() => navigate("/place-order")} 
                className="bg-purple-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-800 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
