import {
  useGetPaymentsQuery,
  useDeletePaymentMutation,
} from "../slices/paymentsApiSlice";
import { Link } from "react-router-dom";

const PaymentList = () => {
  const { data: payments = [], isLoading, error, refetch } = useGetPaymentsQuery();
  const [deletePayment] = useDeletePaymentMutation();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this payment?");
    if (!confirmDelete) return;

    try {
      await deletePayment(id).unwrap();
      alert("✅ Payment deleted.");
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete payment", err);
      alert("Failed to delete payment.");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">All Payments</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading payments...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load payments.</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Invoice</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Note</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{payment.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    {payment.invoice?.invoiceNumber ? (
                      <Link
                        to={`/admin/invoices/${payment.invoice._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {payment.invoice.invoiceNumber}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{payment.invoice}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{payment.amount.toFixed(2)} AED</td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                  <td className="px-4 py-2 text-gray-700">{payment.note || "-"}</td>
                  <td className="px-4 py-2">
                    {payment.status === "Received" ? (
                      <span className="text-green-600 font-medium">Received</span>
                    ) : (
                      <span className="text-red-500 font-medium">Refunded</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-4 text-sm">
                    <Link
                      to={`/admin/payments/${payment._id}/edit`}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
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

export default PaymentList;
