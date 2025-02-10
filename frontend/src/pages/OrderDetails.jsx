import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery, useUpdateOrderToPaidMutation, useUpdateOrderToDeliveredMutation } from "../slices/ordersApiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaShippingFast } from "react-icons/fa";

const orderStages = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId);
  const { userInfo } = useSelector((state) => state.auth);

  const [updateOrderToPaid, { isLoading: isPaying }] = useUpdateOrderToPaidMutation();
  const [updateOrderToDelivered, { isLoading: isDelivering }] = useUpdateOrderToDeliveredMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "Pending");

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      await action(orderId).unwrap();
      refetch();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (userInfo?.isAdmin) {
      setSelectedStatus(newStatus);
    }
  };

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading order details...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load order details.</p>;
  if (!order) return <p className="text-gray-500 text-center py-10">Order not found.</p>;

  return (
    <div className="container mx-auto px-6 py-12 mt-[80px]">
      <h2 className="text-3xl font-bold text-center mb-6">Order Details</h2>

      {/* ✅ Order Information */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total:</strong> <span className="text-xl font-bold text-purple-600">${order.totalPrice.toFixed(2)}</span></p>
          <p className="flex items-center">
            <strong>Paid:</strong> {order.isPaid ? <FaCheckCircle className="text-green-500 ml-2" /> : <FaTimesCircle className="text-red-500 ml-2" />}
          </p>
        </div>
      </div>

      {/* ✅ Order Status */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Status</h3>
        <div className="flex gap-2 flex-wrap">
          {orderStages.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStatusChange(stage)}
              disabled={!userInfo?.isAdmin}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                selectedStatus === stage
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700"
              } ${userInfo?.isAdmin ? "hover:bg-blue-500 hover:text-white cursor-pointer" : "cursor-not-allowed"}`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Order Note */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Note</h3>
        <p className="text-gray-700">{order.note?.trim() ? order.note : <span className="text-gray-500">No note provided</span>}</p>
      </div>

      {/* ✅ Shipping Address */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
        <p className="text-gray-700">{order.shippingAddress}</p>
      </div>

      {/* ✅ Ordered Items */}
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

      {/* ✅ Admin Actions (Only for Admins) */}
      {userInfo?.isAdmin && (!order.isPaid || order.status !== "Delivered") && (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">Admin Actions</h3>
          <div className="flex flex-col md:flex-row gap-4">
            {!order.isPaid && (
              <button
                onClick={() => handleAction(updateOrderToPaid)}
                className="bg-green-500 text-white px-5 py-2 rounded-md text-md flex items-center gap-2 hover:bg-green-600 transition"
                disabled={isPaying || isProcessing}
              >
                <FaMoneyBillWave />
                {isPaying || isProcessing ? "Processing..." : "Mark as Paid"}
              </button>
            )}
            {order.status !== "Delivered" && (
              <button
                onClick={() => handleAction(updateOrderToDelivered)}
                className="bg-purple-500 text-white px-5 py-2 rounded-md text-md flex items-center gap-2 hover:bg-purple-600 transition"
                disabled={isDelivering || isProcessing}
              >
                <FaShippingFast />
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
