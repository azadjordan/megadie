import { useEffect } from "react";
import {
  useGetAllPaymentsQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
} from "../slices/paymentsApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const PaymentList = () => {
  const { data: payments = [], isLoading, error, refetch } = useGetAllPaymentsQuery();
  const [createPayment] = useCreatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();

  const handleCreatePayment = async () => {
    try {
      await createPayment({
        userId: payments[0]?.user?._id, // Use an existing user if available
        amount: Math.floor(Math.random() * 1000) + 100,
        paymentMethod: "Cash",
        note: "Sample payment",
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("❌ Failed to create payment", err);
      alert("Failed to create payment");
    }
  };

  const handleDeletePayment = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this payment?");
    if (!confirm) return;

    try {
      await deletePayment(id).unwrap();
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete payment", err);
      alert("Failed to delete payment");
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-purple-700">All Payments</h2>
        <button
          onClick={handleCreatePayment}
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
        >
          <FaPlus /> Create Payment
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading payments...</p>
      ) : error ? (
        <p className="text-red-500">Error loading payments.</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Invoice</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{p.user?.name || "-"}</td>
                  <td className="px-4 py-2">{p.invoice || "-"}</td>
                  <td className="px-4 py-2">{p.amount} AED</td>
                  <td className="px-4 py-2">{p.paymentMethod}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`/admin/payments/${p._id}/edit`}>
                      <FaEdit className="inline text-purple-600 hover:text-purple-800" />
                    </Link>
                    <button onClick={() => handleDeletePayment(p._id)}>
                      <FaTrash className="inline text-red-600 hover:text-red-800" />
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
