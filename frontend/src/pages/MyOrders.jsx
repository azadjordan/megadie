import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading orders...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load orders.</p>;

  const filteredOrders = showUnpaidOnly ? orders.filter((order) => !order.isPaid) : orders;

  return (
    <div>
      {/* ✅ Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-4 gap-4">
        <h2 className="text-3xl font-bold">My Orders</h2>
        <div className="flex items-center gap-6">
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ✅ Table Header */}
          <div className="grid grid-cols-5 bg-gray-100 text-gray-700 font-medium py-3 px-4">
            <span>Order ID</span>
            <span>Date</span>
            <span>Total</span>
            <span>Paid</span>
            <span>Status</span>
          </div>

          {/* ✅ Orders List */}
          <div>
            {filteredOrders.map((order) => (
              <Link 
                to={`${order._id}`} 
                key={order._id} 
                className="grid grid-cols-5 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {/* ✅ Order ID */}
                <span className="text-purple-600 font-semibold">{order._id.slice(0, 10)}...</span>
                
                {/* ✅ Order Date */}
                <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                
                {/* ✅ Total Price */}
                <span className="text-gray-800 font-medium">${order.totalPrice.toFixed(2)}</span>

                {/* ✅ Paid Status (✅ Fixed Background Issue) */}
                <div className="w-fit">
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                    order.isPaid ? "bg-green-100 text-green-600 px-6" : "bg-red-100 text-red-600"
                  }`}>
                    {order.isPaid ? " Paid " : "Not Paid"}
                  </span>
                </div>

                {/* ✅ Order Status (✅ Fixed Background Issue) */}
                <div className="w-fit">
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status || "Processing"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          {showUnpaidOnly ? "No unpaid orders found." : "You have no orders yet."}
        </p>
      )}
    </div>
  );
};

export default MyOrders;
