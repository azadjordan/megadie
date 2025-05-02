import { useGetPaymentsQuery } from "../slices/paymentsApiSlice";

const PaymentList = () => {
  const { data: payments = [], isLoading, error } = useGetPaymentsQuery();

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        All Payments
      </h2>

      {isLoading ? (
        <p className="text-gray-500">Loading payments...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load payments.</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Paid To</th> {/* ✅ New column */}
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-200 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{payment.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    {payment.invoice?.invoiceNumber || payment.invoice || "-"}
                  </td>
                  <td className="px-4 py-3">{payment.amount.toFixed(2)} AED</td>
                  <td className="px-4 py-3">{payment.paymentMethod}</td>
                  <td className="px-4 py-3">{payment.paidTo || "-"}</td> {/* ✅ New value */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          payment.status === "Received"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {payment.note || "-"}
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
