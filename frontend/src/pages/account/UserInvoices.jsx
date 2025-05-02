import { useGetMyInvoicesQuery } from "../../slices/invoicesApiSlice";

const UserInvoices = () => {
  const {
    data: invoices = [],
    isLoading,
    error,
  } = useGetMyInvoicesQuery();

  return (
    <div className="p-6 w-full">
      {isLoading ? (
        <p className="text-gray-500">Loading your invoices...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load invoices.</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-600">You have no invoices yet.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Invoice #</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payments</th>
                <th className="px-4 py-3 font-medium">Remaining Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => {
                const remaining = invoice.amountDue - invoice.amountPaid;

                return (
                  <tr
                    key={invoice._id}
                    className="hover:bg-gray-200 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">{invoice.invoiceNumber}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
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

                    <td className="px-4 py-3">{invoice.amountDue.toFixed(2)} AED</td>

                    <td className="px-4 py-3 text-xs text-gray-800">
                      {invoice.payments?.length > 0 ? (
                        <div className="space-y-1">
                          {invoice.payments.map((p) => (
                            <div
                              key={p._id}
                              className="bg-green-50 border border-green-200 text-green-700 rounded px-2 py-1"
                            >
                              <div className="font-medium">
                                {p.amount.toFixed(2)} AED – {p.paymentMethod}
                              </div>
                              <div className="text-[10px] text-gray-500">
                                {new Date(p.paymentDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-gray-400">No payments</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {remaining > 0 ? (
                        <span className="text-red-600">{remaining.toFixed(2)} AED</span>
                      ) : (
                        <span className="text-green-700">0.00 AED</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
