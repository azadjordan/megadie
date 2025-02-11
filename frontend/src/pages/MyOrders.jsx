import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

const MyOrders = () => {
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading orders...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load orders.</p>;

  const filteredOrders = showUnpaidOnly ? orders.filter((order) => !order.isPaid) : orders;

  return (
    <div className="container mx-auto px-6 py-12">
      {/* ✅ Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-3xl font-bold">My Orders</h2>
        <div className="flex items-center gap-6">
          {/* ✅ Show Number of Orders */}
          <p className="text-gray-700">Total Orders: <strong>{filteredOrders.length}</strong></p>
          
          {/* ✅ Toggle Switch for Filtering */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <span className="text-gray-700 text-sm font-medium">Show Unpaid Only</span>
            <input
              type="checkbox"
              checked={showUnpaidOnly}
              onChange={() => setShowUnpaidOnly(!showUnpaidOnly)}
              className="hidden"
            />
            <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-0.5 transition-all ${showUnpaidOnly ? "bg-purple-500" : ""}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${showUnpaidOnly ? "translate-x-5" : ""}`}></div>
            </div>
          </label>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-purple-500 text-white text-left">
              <th className="py-3 px-4 border">Order ID</th>
              <th className="py-3 px-4 border">Date</th>
              <th className="py-3 px-4 border">Total</th>
              <th className="py-3 px-4 border">Paid</th>
              <th className="py-3 px-4 border">Delivery</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 border">
                  <Link to={`/order/${order._id}`} className="text-purple-600 font-semibold hover:underline">
                    {order._id.slice(0, 10)}...
                  </Link>
                </td>
                <td className="py-3 px-4 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 border font-semibold">${order.totalPrice.toFixed(2)}</td>

                {/* Paid Status */}
                <td className="py-3 px-4 border text-center">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Paid</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Not Paid</span>
                  )}
                </td>

                {/* Delivery Status */}
                <td className="py-3 px-4 border text-center">
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Delivered</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Pending</span>
                  )}
                </td>

                {/* Order Status */}
                <td className="py-3 px-4 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status || "Processing"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          {showUnpaidOnly ? "No unpaid orders found." : "You have no orders yet."}
        </p>
      )}
    </div>
  );
};

export default MyOrders;
