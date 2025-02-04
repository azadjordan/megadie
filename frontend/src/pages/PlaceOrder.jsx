import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation, useGetMyOrdersQuery } from "../slices/ordersApiSlice"; // ✅ Import useGetMyOrdersQuery
import { clearCart } from "../slices/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get cart items from Redux store
  const { cartItems, totalPrice } = useSelector((state) => state.cart);

  // ✅ Create order mutation
  const [createOrder, { isLoading, isError, error, isSuccess, data }] = useCreateOrderMutation();

  // ✅ Get My Orders and Refetch Function
  const { refetch } = useGetMyOrdersQuery(); // ✅ Import refetch function

  // ✅ Handle order confirmation
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          qty: item.quantity,
          price: item.price,
          specifications: item.specifications || {}
        })),
        shippingAddress: {
          address: "N/A",
          city: "N/A",
          postalCode: "N/A",
          country: "N/A"
        },
        totalPrice
      };

      const res = await createOrder(orderData).unwrap();
      
      dispatch(clearCart()); // ✅ Clear cart after order is placed
      await refetch(); // ✅ Force refresh My Orders immediately
      navigate(`/order-confirmation/${res._id}`); // ✅ Redirect to Order Confirmation
    } catch (err) {
      console.error("Order placement failed:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Review Your Order</h2>

      {isError && <p className="text-red-500 text-center">{error?.data?.message || "Failed to place order"}</p>}

      {/* Order Items List */}
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

      {/* Order Summary */}
      <div className="bg-white p-6 shadow-sm mt-6 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirm Order Button */}
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
