import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

const MyOrders = () => {
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading orders...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load orders.</p>;

  return (
    <div className="container mx-auto px-6 py-12 pt-[80px]">
      <h2 className="text-3xl font-bold text-center mb-6">My Orders</h2>

      {orders?.length > 0 ? (
        <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
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
              {orders.map((order) => (
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
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Paid
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                        Not Paid
                      </span>
                    )}
                  </td>

                  {/* Delivery Status */}
                  <td className="py-3 px-4 border text-center">
                    {order.isDelivered ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Delivered
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
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
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">You have no orders yet.</p>
      )}
    </div>
  );
};

export default MyOrders;
