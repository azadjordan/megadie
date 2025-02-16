import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery } from "../slices/ordersApiSlice";
import { FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";

const OrderList = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, refetch } = useGetAllOrdersQuery();

  const sortedOrders = Array.isArray(orders) 
    ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    : [];

  return (
    <div className="container mx-auto px-6 py-12 pt-[120px]">
      <h2 className="text-3xl font-bold text-center mb-6">Orders</h2>

      {/* ✅ Loading & Error Handling */}
      {isLoading && <p className="text-gray-500 text-center py-10">Loading orders...</p>}
      {isError && <p className="text-red-500 text-center py-10">Failed to load orders.</p>}

      {/* ✅ Table: Clean & Readable */}
      {sortedOrders.length > 0 ? (
        <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-purple-500 text-white">
              <tr>
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Paid</th>
                <th className="py-4 px-6 text-center">Stock Updated</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr 
                  key={order._id} 
                  className="border-b hover:bg-gray-50 transition cursor-pointer" 
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  {/* ✅ Order ID with icon */}
                  <td className="py-4 px-6 flex items-center">
                    <FaClipboardList className="text-gray-600 mr-2" />
                    {order._id.slice(0, 10)}...
                  </td>

                  {/* ✅ User Column: Show Admin Highlight */}
                  <td className="py-4 px-6">
                    {order.user?.name 
                      ? <span className={`${order.user.isAdmin ? "text-purple-600 font-bold" : ""}`}>
                          {order.user.name}
                        </span> 
                      : "Guest"}
                  </td>

                  {/* ✅ Total Price */}
                  <td className="py-4 px-6 font-semibold">${order.totalPrice?.toFixed(2)}</td>

                  {/* ✅ Order Status */}
                  <td className="py-4 px-6 font-medium">{order.status}</td>

                  {/* ✅ Paid Status */}
                  <td className="py-4 px-6 text-center">
                    {order.isPaid 
                      ? <FaCheckCircle className="text-green-500 mx-auto" /> 
                      : <FaTimesCircle className="text-red-500 mx-auto" />}
                  </td>

                  {/* ✅ Stock Updated Status */}
                  <td className="py-4 px-6 text-center">
                    {order.stockUpdated 
                      ? <FaCheckCircle className="text-blue-500 mx-auto" /> 
                      : <FaTimesCircle className="text-gray-500 mx-auto" />}
                  </td>

                  {/* ✅ Order Date */}
                  <td className="py-4 px-6">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && !isError && <p className="text-gray-500 text-center mt-10">No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
