import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
} from "../slices/ordersApiSlice";
import { useCreateInvoiceMutation } from "../slices/invoicesApiSlice";
import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";

const OrderList = () => {
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery();
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleGenerateInvoice = async (order) => {
    if (!order._id || !order.user?._id || !order.totalPrice) {
      alert("Missing order, user, or total.");
      return;
    }

    try {
      await createInvoice({
        order: order._id,
        user: order.user._id,
        amountDue: order.totalPrice,
      }).unwrap();

      alert("✅ Invoice created successfully!");
      refetch();
    } catch (err) {
      console.error("❌ Failed to create invoice", err);
      alert("Failed to create invoice.");
    }
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await deleteOrder(orderId).unwrap();
      alert("✅ Order deleted.");
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete order", err);
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">All Orders</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load orders.</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Order No</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Delivered?</th>
                <th className="px-4 py-2">Invoice</th>
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
                  <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.orderItems.length}</td>
                  <td className="px-4 py-2">{order.totalPrice.toFixed(2)} AED</td>
                  <td className="px-4 py-2">
                    {order.isDelivered ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {order.invoiceGenerated ? (
                      <span className="text-green-700 font-medium">Generated</span>
                    ) : (
                      <button
                        onClick={() => handleGenerateInvoice(order)}
                        disabled={isCreating}
                        className="text-xs text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded disabled:opacity-50"
                      >
                        {isCreating ? "Generating..." : "Generate"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <Link to={`/admin/orders/${order._id}`}>
                        <button
                          title="View Order"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>
                      </Link>
                      <button
                        title="Delete Order"
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
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

export default OrderList;
