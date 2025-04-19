import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
} from "../slices/invoicesApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";

const InvoiceList = () => {
  const {
    data: invoices = [],
    isLoading,
    error,
    refetch,
  } = useGetInvoicesQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirmDelete) return;

    try {
      await deleteInvoice(id).unwrap();
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete invoice", err);
      alert("Failed to delete invoice. Check console for details.");
    }
  };

  const handleShare = async (invoiceId) => {
    const url = `http://localhost:5000/api/invoices/${invoiceId}/pdf`;
    try {
      await navigator.clipboard.writeText(url);
      alert("📋 Invoice PDF link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
      alert("Could not copy invoice link.");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        All Invoices
      </h2>

      {isLoading ? (
        <p className="text-gray-500">Loading invoices...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load invoices.</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-600">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Invoice #</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Order Total</th>
                <th className="px-4 py-2">Amount Due</th>
                <th className="px-4 py-2">Amount Paid</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-2">{invoice.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    {invoice.originalOrderTotal?.toFixed(2) || "-"}
                  </td>
                  <td className="px-4 py-2">{invoice.amountDue.toFixed(2)}</td>
                  <td className="px-4 py-2">{invoice.amountPaid.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-medium rounded-md px-2 ${
                        invoice.status === "Paid"
                          ? "bg-green-200 text-green-800"
                          : invoice.status === "Partially Paid"
                          ? "bg-yellow-100 text-yellow-900"
                          : invoice.status === "Overdue"
                          ? "bg-red-100 text-red-900"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {invoice.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {invoice.order?._id && invoice.order?.orderNumber ? (
                      <Link
                        to={`/admin/orders/${invoice.order._id}`}
                        className="text-xs text-blue-600 underline hover:text-blue-800"
                      >
                        {invoice.order.orderNumber}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-1">
                      <Link to={`/admin/invoices/${invoice._id}/edit`}>
                        <button
                          title="Edit Invoice"
                          className="text-blue-600 p-2 hover:text-blue-800 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                      </Link>

                      <button
                        title="Delete Invoice"
                        onClick={() => handleDelete(invoice._id)}
                        className="text-red-600 p-2 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>

                      <button
                        title="Share Invoice"
                        onClick={() => handleShare(invoice._id)}
                        className="text-purple-600 p-2 hover:text-purple-800 cursor-pointer"
                      >
                        <FaShareAlt />
                      </button>

                      <Link to={`/admin/invoices/${invoice._id}/payment`}>
                        <button
                          title="Add Payment"
                          className="text-green-600 p-2 hover:text-green-800 cursor-pointer"
                        >
                          💵
                        </button>
                      </Link>
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

export default InvoiceList;
