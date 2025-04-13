import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCart } from "../slices/cartSlice";
import { apiSlice } from "../slices/apiSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [note, setNote] = useState("");

  const handlePlaceOrder = async () => {
    setErrorMessage(null);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id, // ✅ Product ID (required)
          sku: item.sku, // ✅ Ensuring SKU is sent
          qty: item.quantity, // ✅ Sending quantity
          price: item.price, // ✅ Final price per unit (admin will adjust later)
        })),
        note, // ✅ Sending optional order note
      };
  
      const newOrder = await createOrder(orderData).unwrap();
  
      dispatch(
        apiSlice.util.updateQueryData("getMyOrders", undefined, (draftOrders) => {
          draftOrders.unshift(newOrder);
        })
      );
  
      dispatch(clearCart());
      navigate(`/order-confirmation/${newOrder._id}`);
    } catch (err) {
      console.error("Order placement failed:", err);
      setErrorMessage(err?.data?.message || "An error occurred while placing your order.");
    }
  };
  

  return (
    <div className="container mx-auto px-6 py-12 pt-[80px]">
      <h2 className="text-3xl font-bold text-center mb-6">Review Your Order</h2>

      {/* ✅ Error Message */}
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      {/* ✅ Order Items */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-4 border-b last:border-none">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-grow px-4">
                <h2 className="text-md font-medium text-gray-900">{item.name}</h2>
                <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <p className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ Order Summary */}
      <div className="bg-white p-6 shadow-md mt-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="flex justify-between text-3xl font-bold text-purple-600">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* ✅ Order Note (Optional) */}
      <div className="bg-white p-6 shadow-md mt-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Note (Optional)</h3>
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="Leave a note for your order (e.g., special instructions)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* ✅ Buttons Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 mt-6">
        {/* ✅ Back to Cart Button */}
        <Link
          to="/cart"
          className="w-full md:w-auto bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition text-center"
        >
          ← Back to Cart
        </Link>

        {/* ✅ Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full md:w-auto bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
