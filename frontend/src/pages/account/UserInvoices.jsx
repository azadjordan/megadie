import { useGetMyInvoicesQuery } from "../../slices/invoicesApiSlice";

const UserInvoices = () => {
  const {
    data: invoices = [],
    isLoading,
    error,
  } = useGetMyInvoicesQuery();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">My Invoices</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading your invoices...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load invoices.</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-600">You have no invoices.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="text-sm">
                <th className="px-5 py-3 font-medium">Invoice #</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Paid</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {invoices.map((invoice) => {
                const remaining = invoice.amountDue - invoice.amountPaid;

                return (
                  <tr key={invoice._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3">{invoice.invoiceNumber}</td>
                    <td className="px-5 py-3">{invoice.amountDue.toFixed(2)} AED</td>
                    <td className="px-5 py-3">{invoice.amountPaid.toFixed(2)} AED</td>
                    <td className="px-5 py-3">{remaining.toFixed(2)} AED</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium rounded-md px-2 py-1 ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Partially Paid"
                            ? "bg-yellow-100 text-yellow-800"
                            : invoice.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {new Date(invoice.createdAt).toLocaleDateString()}
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
