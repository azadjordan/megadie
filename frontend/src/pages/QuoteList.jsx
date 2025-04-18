import {
  useGetQuotesQuery,
  useDeleteQuoteMutation,
} from "../slices/quotesApiSlice";
import { useCreateOrderFromQuoteMutation } from "../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";

const QuoteList = () => {
  const { data: quotes = [], isLoading, error, refetch } = useGetQuotesQuery();
  const [deleteQuote] = useDeleteQuoteMutation();
  const [createOrderFromQuote, { isLoading: isCreating }] =
    useCreateOrderFromQuoteMutation();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quote?"
    );
    if (!confirmDelete) return;

    try {
      await deleteQuote(id).unwrap();
      refetch();
    } catch (err) {
      console.error("❌ Failed to delete quote", err);
      alert("Failed to delete quote. Check console for details.");
    }
  };

  const handleShare = (quoteId) => {
    const shareUrl = `${window.location.origin}/admin/quotes/${quoteId}/edit`;
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  const handleCreateOrder = async (quoteId) => {
    try {
      await createOrderFromQuote(quoteId).unwrap();
      alert("✅ Order created successfully!");
      refetch();
    } catch (err) {
      console.error("❌ Order creation failed", err);
      alert("Failed to create order.");
    }
  };

  return (
    <div className="p-6 w-full">
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
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Client Note</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total (AED)</th>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{quote.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-medium rounded-md px-2 ${
                        quote.status === "Confirmed"
                          ? "bg-green-200 text-green-800"
                          : quote.status === "Rejected"
                          ? "bg-red-100 text-red-900"
                          : quote.status === "Requested"
                          ? "bg-yellow-100 text-yellow-900"
                          : quote.status === "Quoted"
                          ? "bg-purple-200 text-purple-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>

                  <td
                    className="px-4 py-2 max-w-xs truncate"
                    title={quote.clientToAdminNote}
                  >
                    {quote.clientToAdminNote || "-"}
                  </td>
                  <td className="px-4 py-2">{quote.requestedItems.length}</td>
                  <td className="px-4 py-2">{quote.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {quote.isOrderCreated ? (
                      <span className="text-green-700 font-medium">
                        Created 
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCreateOrder(quote._id)}
                        disabled={isCreating}
                        className="text-white text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded disabled:opacity-50"
                      >
                        {isCreating ? "Creating..." : "Create"}
                      </button>
                    )}
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-1 ">
                      <Link to={`/admin/quotes/${quote._id}/edit`}>
                        <button
                          title="Edit Quote"
                          className="text-blue-600 p-2 hover:text-blue-800 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                      </Link>

                      <button
                        title="Delete Quote"
                        onClick={() => handleDelete(quote._id)}
                        className="text-red-600 p-2 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>

                      <button
                        title="Share Quote"
                        onClick={() => handleShare(quote._id)}
                        className="text-purple-600 p-2 hover:text-purple-800 cursor-pointer"
                      >
                        <FaShareAlt />
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

export default QuoteList;
