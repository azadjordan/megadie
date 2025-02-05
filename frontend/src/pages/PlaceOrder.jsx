import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCart } from "../slices/cartSlice";
import { apiSlice } from "../slices/apiSlice"; 

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  
  // ✅ Create order mutation
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [errorMessage, setErrorMessage] = useState(null); // ✅ Store error message

  const handlePlaceOrder = async () => {
    setErrorMessage(null); // ✅ Reset any previous errors

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          qty: item.quantity,
          price: item.price,
          specifications: item.specifications || {},
        })),
        shippingAddress: {
          address: "N/A",
          city: "N/A",
          postalCode: "N/A",
          country: "N/A",
        },
        totalPrice,
      };

      // ✅ Attempt to create the order in the backend
      const newOrder = await createOrder(orderData).unwrap();

      // ✅ Update Redux cache only if API call was successful
      dispatch(
        apiSlice.util.updateQueryData("getMyOrders", undefined, (draftOrders) => {
          draftOrders.unshift(newOrder);
        })
      );

      dispatch(clearCart()); // ✅ Clear cart after successful order placement
      navigate(`/order-confirmation/${newOrder._id}`); // ✅ Redirect to confirmation page
    } catch (err) {
      console.error("Order placement failed:", err);
      setErrorMessage(err?.data?.message || "An error occurred while placing your order."); // ✅ Set error message
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Review Your Order</h2>

      {/* ✅ Show error message if order placement fails */}
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      <div className="bg-white p-6 shadow-sm rounded-md">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-4 border-b last:border-none">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
              <div className="flex-grow px-4">
                <h2 className="text-sm font-medium text-gray-900">{item.name}</h2>
                <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <p className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-6 shadow-sm mt-6 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
