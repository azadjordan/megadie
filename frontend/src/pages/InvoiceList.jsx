import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
} from "../slices/invoicesApiSlice";
import { Link } from "react-router-dom";
import { FaTrash, FaShareAlt } from "react-icons/fa";

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

  const handleShare = (invoiceId) => {
    const url = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/invoices/${invoiceId}/pdf`;
    window.open(url, "_blank");
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
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
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Created At</th>
                <th className="px-4 py-3 font-medium">Invoice #</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Amount Due</th>
                <th className="px-4 py-3 font-medium">Amount Paid</th>
                <th className="px-4 py-3 font-medium">Payments</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="hover:bg-gray-200 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-3">{invoice.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">{invoice.amountDue.toFixed(2)}</td>
                  <td className="px-4 py-3">{invoice.amountPaid.toFixed(2)}</td>

                  <td className="px-4 py-3">
                    {invoice.payments && invoice.payments.length > 0 ? (
                      <div className="text-xs space-y-1">
                        {invoice.payments.map((p) =>
                          typeof p === "string" ? (
                            <div key={p}>{p}</div>
                          ) : (
                            <div key={p._id}>{p._id}</div>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        No payments
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "Partially Paid"
                            ? "bg-yellow-100 text-yellow-800"
                            : invoice.status === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`${
                        isOverdue(invoice.dueDate)
                          ? "text-red-600 font-semibold"
                          : ""
                      }`}
                    >
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {invoice.order?._id && invoice.order?.orderNumber ? (
                      <Link
                        to={`/admin/invoices/invoice-order/${invoice.order._id}`}
                        className="text-xs text-blue-600 underline hover:text-blue-800"
                      >
                        {invoice.order.orderNumber}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-end space-x-1">
                      <button
                        title="Delete Invoice"
                        onClick={() => handleDelete(invoice._id)}
                        className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>

                      <button
                        title="View Invoice PDF"
                        onClick={() => handleShare(invoice._id)}
                        className="p-2 hover:bg-purple-200 text-purple-600 hover:text-purple-800 cursor-pointer"
                      >
                        <FaShareAlt />
                      </button>

                      <Link to={`/admin/invoices/${invoice._id}/payment`}>
                        <button
                          title="Add/View Payments"
                          className={`text-xs px-3 py-1 rounded font-medium transition
                            ${
                              invoice.status === "Paid"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-green-300 text-green-900 hover:bg-green-500 cursor-pointer"
                            }`}
                          disabled={invoice.status === "Paid"}
                        >
                          Add Payment
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
