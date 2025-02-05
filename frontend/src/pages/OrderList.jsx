import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery } from "../slices/ordersApiSlice";
import { FaCheckCircle, FaTimesCircle, FaTruck, FaBox } from "react-icons/fa";
import OrderActions from "../components/OrderActions"; // ✅ Import actions component

const OrderList = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, refetch } = useGetAllOrdersQuery();

  // ✅ Sort orders by date (newest first)
  const sortedOrders = orders ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {isLoading && <p className="text-gray-500 text-center">Loading orders...</p>}
      {isError && <p className="text-red-500 text-center">Failed to load orders.</p>}

      {!isLoading && !isError && sortedOrders.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3 w-40">Order ID</th>
              <th className="p-3 w-32">User</th>
              <th className="p-3 w-24">Total</th>
              <th className="p-3 text-center w-24">Paid</th>
              <th className="p-3 text-center w-24">Delivered</th>
              <th className="p-3 text-left w-32">Date</th>
              <th className="p-3 text-center w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                {/* Clickable Order ID */}
                <td className="p-3 w-40">
                  <div
                    className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/order/${order._id}`)}
                    title={order._id} // Shows full ID on hover
                  >
                    {order._id}
                  </div>
                </td>
                <td className="p-3 w-32">{order.user?.name || "Guest"}</td>
                <td className="p-3 w-24 font-semibold">${order.totalPrice.toFixed(2)}</td>

                {/* Paid Status */}
                <td className="p-3 text-center w-24">
                  {order.isPaid ? (
                    <FaCheckCircle className="text-green-500 mx-auto" size={18} title="Paid" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mx-auto" size={18} title="Not Paid" />
                  )}
                </td>

                {/* Delivered Status */}
                <td className="p-3 text-center w-24">
                  {order.isDelivered ? (
                    <FaBox className="text-green-500 mx-auto" size={18} title="Delivered" />
                  ) : (
                    <FaTruck className="text-gray-500 mx-auto" size={18} title="Pending Delivery" />
                  )}
                </td>

                {/* Date */}
                <td className="p-3 text-left w-32 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Actions Component */}
                <td className="p-3 text-center w-48">
                  <OrderActions
                    orderId={order._id}
                    isPaid={order.isPaid}
                    isDelivered={order.isDelivered}
                    refetch={refetch} // ✅ Pass refetch to update data after actions
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && !isError && sortedOrders.length === 0 && (
        <p className="text-gray-500 text-center">No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
