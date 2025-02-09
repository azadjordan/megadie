import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery, useUpdateOrderToPaidMutation, useUpdateOrderToDeliveredMutation } from "../slices/ordersApiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle, FaBox, FaTruck } from "react-icons/fa";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId);
  
  const { userInfo } = useSelector((state) => state.auth); // ✅ Get user info from Redux
  
  const [updateOrderToPaid, { isLoading: isPaying }] = useUpdateOrderToPaidMutation();
  const [updateOrderToDelivered, { isLoading: isDelivering }] = useUpdateOrderToDeliveredMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      await action(orderId).unwrap();
      refetch(); // Refresh data after update
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading order details...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load order details.</p>;
  if (!order) return <p className="text-gray-500 text-center py-10">Order not found.</p>;

  return (
    <div className="container mx-auto px-6 py-12 pt-[120px]">
      <h2 className="text-3xl font-bold text-center mb-6">Order Details</h2>

      {/* Order Info Section */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Information</h3>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        <p className="flex items-center">
          <strong>Status:</strong>
          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${order.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {order.status || "Processing"}
          </span>
        </p>
        <p className="flex items-center">
          <strong>Paid:</strong> {order.isPaid ? <FaCheckCircle className="text-green-500 ml-2" /> : <FaTimesCircle className="text-red-500 ml-2" />}
        </p>
        <p className="flex items-center">
          <strong>Delivered:</strong> {order.isDelivered ? <FaBox className="text-green-500 ml-2" /> : <FaTruck className="text-gray-500 ml-2" />}
        </p>
      </div>

      {/* ✅ Always Display Order Note Section */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Note</h3>
        <p className="text-gray-700">
          {order.note && order.note.trim() !== "" ? order.note : <span className="text-gray-500">No note provided</span>}
        </p>
      </div>

      {/* Shipping Address Section */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
        <p>{order.shippingAddress}</p>
      </div>

      {/* Order Items Section */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Ordered Items</h3>
        {order.orderItems.map((item) => (
          <div key={item.product} className="flex items-center justify-between border-b py-4 last:border-none">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-grow px-4">
              <h2 className="text-md font-medium">{item.name}</h2>
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.qty}</p>
            </div>
            <p className="text-gray-900 font-semibold">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* ✅ Show Admin Actions Only for Admins */}
      {userInfo?.isAdmin && (!order.isPaid || !order.isDelivered) && (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">Admin Actions</h3>
          <div className="flex flex-col space-y-3">
            {!order.isPaid && (
              <button
                onClick={() => handleAction(updateOrderToPaid)}
                className="bg-green-500 text-white px-4 py-2 rounded-md text-md hover:bg-green-600 transition"
                disabled={isPaying || isProcessing}
              >
                {isPaying || isProcessing ? "Processing..." : "Mark as Paid"}
              </button>
            )}
            {!order.isDelivered && (
              <button
                onClick={() => handleAction(updateOrderToDelivered)}
                className="bg-purple-500 text-white px-4 py-2 rounded-md text-md hover:bg-purple-600 transition"
                disabled={isDelivering || isProcessing}
              >
                {isDelivering || isProcessing ? "Processing..." : "Mark as Delivered"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
