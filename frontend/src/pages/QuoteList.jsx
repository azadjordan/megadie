import { useGetQuotesQuery } from "../slices/quotesApiSlice";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const QuoteList = () => {
  const { data: quotes = [], isLoading, error } = useGetQuotesQuery();

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        All Quotes / Requests
      </h2>

      {isLoading ? (
        <p className="text-gray-500">Loading quotes...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load quotes.</p>
      ) : quotes.length === 0 ? (
        <p className="text-gray-600">No quote requests found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total (AED)</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{quote.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">{quote.status}</td>
                  <td className="px-4 py-2">{quote.requestedItems.length}</td>
                  <td className="px-4 py-2">{quote.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/admin/quotes/${quote._id}/edit`}>
                      <FaEye className="text-purple-600 hover:text-purple-800" />
                    </Link>
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

export default QuoteList;
