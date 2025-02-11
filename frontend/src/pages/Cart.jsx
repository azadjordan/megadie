import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../slices/cartSlice";
import { FaPlus, FaMinus, FaShoppingCart, FaTrash } from "react-icons/fa";

const Cart = () => {
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto px-6 py-12 pt-[110px]">
      
      {/* ✅ Back to Shop Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition mb-6"
        >
        ← Back to Shop
      </Link>

      {/* ✅ Cart Header */}
      <div className="flex items-center justify-between text-gray-800 pb-4 border-b">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaShoppingCart className="text-purple-500" /> Shopping Cart
        </h2>
      </div>

      {/* ✅ Empty Cart State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-gray-500">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-5 bg-purple-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-purple-600 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          
          {/* ✅ Cart Items Section */}
          <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center py-5 border-b border-gray-200 last:border-none">
                
                {/* ❌ Remove Button */}
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-gray-400 hover:text-red-500 text-xl px-2 cursor-pointer"
                >
                  ×
                </button>

                {/* 🖼️ Product Image */}
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />

                {/* 📌 Product Details */}
                <div className="flex flex-col flex-grow px-4">
                  <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                  <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                  <p className="text-gray-900 font-bold text-lg">= ${ (item.price * item.quantity).toFixed(2) }</p>
                </div>

                {/* 🔢 Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                  <button
                    onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity - 1 }))}
                    disabled={item.quantity === 1}
                    className="p-3 text-gray-500 hover:text-purple-500 disabled:opacity-50 cursor-pointer"
                  >
                    <FaMinus size={18} />
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))}
                    className="p-3 text-gray-500 hover:text-purple-500 cursor-pointer"
                  >
                    <FaPlus size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* ✅ Clear Cart Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => dispatch(clearCart())}
                className="flex items-center gap-2 text-red-500 text-md font-semibold transition hover:text-red-600"
              >
                <FaTrash size={18} />
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          {/* ✅ Checkout Summary */}
          <div className="bg-white p-6 shadow-md rounded-lg flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="flex justify-between text-lg font-medium text-gray-800 border-b pb-2">
              <span>Items in Cart:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-purple-600 mt-4">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {/* ✅ Buttons - Proceed to Checkout & Continue Shopping */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => navigate("/place-order")}
                className="w-full bg-purple-500 text-white text-lg py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/shop"
                className="text-center text-gray-700 hover:text-purple-500 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
