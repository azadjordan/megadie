import { useGetMyOrdersQuery } from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const UserOrders = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">My Orders</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading your orders...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load your orders.</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Order Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total (AED)</th>
                <th className="px-4 py-2">Delivered?</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{order.orderNumber}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Returned"
                          ? "bg-yellow-100 text-yellow-900"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{order.orderItems.length}</td>
                  <td className="px-4 py-2">{order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {order.isDelivered ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/account/orders/${order._id}`}>
                      <button
                        title="View Order"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <FaEye />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
