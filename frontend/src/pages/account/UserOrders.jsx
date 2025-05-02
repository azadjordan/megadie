import { useGetMyOrdersQuery } from "../../slices/ordersApiSlice";

const UserOrders = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="p-6 w-full">
      {isLoading ? (
        <p className="text-gray-500">Loading your orders...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load your orders.</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-4">You have no orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Invoice Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-200 transition-colors duration-150"
                >
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2">{order.orderNumber}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
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

                  <td className="px-4 py-2 text-xs text-gray-800">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx}>
                        • {item.productName || "Unnamed Product"} × {item.qty}
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-2">
                    {order.invoice?.invoiceNumber ? (
                      <span>
                        {order.invoice.invoiceNumber}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs font-medium bg-gray-50 border border-gray-200 rounded px-3 py-1">
                        Not yet Generated
                      </span>
                    )}
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
