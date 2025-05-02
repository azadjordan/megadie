import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
} from "../slices/ordersApiSlice";
import { useCreateInvoiceMutation } from "../slices/invoicesApiSlice";
import { Link, useLocation } from "react-router-dom";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderList = () => {
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery();
  const [createInvoice] = useCreateInvoiceMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const location = useLocation();

  const [generatingForOrderId, setGeneratingForOrderId] = useState(null);

  useEffect(() => {
    if (location.state?.fromQuoteOrderCreation || location.state?.refetch) {
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch]);
  

  const handleGenerateInvoice = async (order) => {
    setGeneratingForOrderId(order._id);

    try {
      await createInvoice({
        order: order._id,
        user: order.user._id,
        amountDue: order.totalPrice,
      }).unwrap();

      toast.success("Invoice created successfully!");
      refetch();
    } catch (err) {
      console.error("Failed to create invoice", err);
      toast.error("Failed to create invoice.");
    } finally {
      setGeneratingForOrderId(null);
    }
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await deleteOrder(orderId).unwrap();
      toast.success("Order deleted.");
      refetch();
    } catch (err) {
      console.error("Failed to delete order", err);
      toast.error("Failed to delete order.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-700";
      case "Processing":
        return "text-yellow-600";
      case "Returned":
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-700";
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
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Order No</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium text-center">Delivered</th>
                <th className="px-4 py-3 font-medium text-center">Stock</th>
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-200 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.orderItems.length}</td>
                  <td className="px-4 py-3">{order.totalPrice.toFixed(2)} AED</td>
                  <td className="px-4 py-3 text-center">
                    {order.isDelivered ? (
                      <FaCheck className="text-green-600 inline" />
                    ) : (
                      <FaTimes className="text-gray-400 inline" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.stockUpdated ? (
                      <FaCheck className="text-green-600 inline" />
                    ) : (
                      <FaTimes className="text-gray-400 inline" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                  {order.invoiceGenerated ? (
  <span className="text-green-700 text-sm font-medium">
    Generated
  </span>
) : order.totalPrice === 0 ? (
  <span className="text-gray-500 text-sm font-medium">Free Order</span>
) : (
  <button
    onClick={() => handleGenerateInvoice(order)}
    disabled={generatingForOrderId === order._id}
    className="cursor-pointer text-xs text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded disabled:opacity-50"
  >
    {generatingForOrderId === order._id ? "Generating..." : "Generate"}
  </button>
)}

                  </td>
                  <td className="text-center">
                    <div className="flex justify-center items-end space-x-1">
                      <Link to={`/admin/orders/${order._id}`}>
                        <button
                          title="View"
                          className="p-2 cursor-pointer text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>
                      </Link>
                      <Link to={`/admin/orders/${order._id}/edit`}>
                        <button
                          title="Edit"
                          className="p-2 cursor-pointer text-indigo-600 hover:text-indigo-800"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(order._id)}
                        className="p-2 cursor-pointer text-red-600 hover:text-red-800"
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
