import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

const MyOrders = () => {
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();

  if (isLoading) return <p className="text-gray-500 text-center">Loading orders...</p>;
  if (isError) return <p className="text-red-500 text-center">Failed to load orders.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {orders?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border">Order ID</th>
                <th className="py-3 px-4 border">Date</th>
                <th className="py-3 px-4 border">Total</th>
                <th className="py-3 px-4 border">Paid</th>
                <th className="py-3 px-4 border">Delivery</th>
                <th className="py-3 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-4 border">
                    <Link to={`/order/${order._id}`} className="text-blue-500 hover:underline">
                      {order._id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 border text-center">
                    {order.isPaid ? (
                      <FaCheckCircle className="text-green-500 mx-auto" size={18} title="Paid" />
                    ) : (
                      <FaTimesCircle className="text-red-500 mx-auto" size={18} title="Not Paid" />
                    )}
                  </td>
                  <td className="py-3 px-4 border text-center">
                    {order.isDelivered ? (
                      <FaCheckCircle className="text-green-500 mx-auto" size={18} title="Delivered" />
                    ) : (
                      <FaTruck className="text-gray-500 mx-auto" size={18} title="Pending Delivery" />
                    )}
                  </td>
                  <td className="py-3 px-4 border">{order.status || "Processing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">You have no orders yet.</p>
      )}
    </div>
  );
};

export default MyOrders;
