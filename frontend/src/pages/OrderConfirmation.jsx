import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/ordersApiSlice";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);

  if (isLoading) return <p className="text-center text-gray-500">Loading order details...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load order.</p>;
  if (!order) return <p className="text-center text-gray-500">Order not found.</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Order Confirmation</h2>
      <p className="text-center text-gray-700">
        Thank you for your purchase! Your order ID is <strong>{order._id}</strong>.
      </p>

      {/* Order Summary */}
      <div className="bg-white p-6 shadow-md rounded-md mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Details</h3>
        {order.orderItems.map((item) => (
          <div key={item.product} className="flex items-center justify-between border-b py-2">
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
            <div className="flex-grow px-4">
              <h2 className="text-sm font-medium text-gray-900">{item.name}</h2>
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.qty}</p>
            </div>
            <p className="text-gray-900 font-semibold">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between text-lg font-semibold text-gray-900 mt-4">
          <span>Total Price:</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>

        {/* ✅ Display order note if it exists */}
        {order.note && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-md font-semibold text-gray-700">Order Note:</h3>
            <p className="text-gray-600">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
