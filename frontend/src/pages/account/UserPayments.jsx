import { useGetMyPaymentsQuery } from "../../slices/paymentsApiSlice";
import { Link } from "react-router-dom";

const UserPayments = () => {
  const {
    data: payments = [],
    isLoading,
    error,
  } = useGetMyPaymentsQuery();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">My Payments</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading your payments...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load payments.</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-600">You haven’t made any payments yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="text-sm">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">{payment.amount.toFixed(2)} AED</td>
                  <td className="px-5 py-3">{payment.paymentMethod}</td>
                  <td className="px-5 py-3">
                    {payment.invoice?.invoiceNumber ? (
                      <Link
                        to={`/account/invoices/${payment.invoice._id}`}
                        className="text-purple-600 hover:underline font-medium"
                      >
                        {payment.invoice.invoiceNumber}
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3">{payment.note || <span className="text-gray-400">-</span>}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium rounded-md px-2 py-1 ${
                        payment.status === "Received"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status}
                    </span>
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

export default UserPayments;
