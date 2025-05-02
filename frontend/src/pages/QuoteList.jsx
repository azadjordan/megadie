import {
  useGetQuotesQuery,
  useDeleteQuoteMutation,
} from "../slices/quotesApiSlice";
import { useCreateOrderFromQuoteMutation } from "../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const QuoteList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: quotes = [], isLoading, error, refetch } = useGetQuotesQuery();
  const [deleteQuote] = useDeleteQuoteMutation();
  const [createOrderFromQuote, { isLoading: isCreating }] =
    useCreateOrderFromQuoteMutation();

    useEffect(() => {
      if (location.state?.refetch) {
        refetch();
        window.history.replaceState({}, document.title); // optional: clears state
      }
    }, [location.state, refetch]);
    

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quote?"
    );
    if (!confirmDelete) return;

    try {
      await deleteQuote(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to delete quote", err);
      toast.error("Failed to delete quote.");
    }
  };

  const handleShare = (quoteId) => {
    const url = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/quotes/${quoteId}/pdf`;
    window.open(url, "_blank");
  };

  const handleCreateOrder = async (quote) => {
    if (quote.status !== "Confirmed") {
      toast.warn("Quote must be Confirmed to create an order.");
      return;
    }
  
    if (!quote.totalPrice || quote.totalPrice <= 0) {
      const confirmFree = window.confirm(
        "This order has a total price of 0 AED.\nAre you sure you want to create it as a free order?"
      );
      if (!confirmFree) return;
    }
  
    try {
      await createOrderFromQuote(quote._id).unwrap();
      toast.success("Order created successfully!");
      navigate("/admin/orders", { state: { fromQuoteOrderCreation: true } });
    } catch (err) {
      console.error("Order creation failed", err);
      toast.error("Failed to create order.");
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
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Created At</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Client Note</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total (AED)</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map((quote) => (
                <tr
                  key={quote._id}
                  className="hover:bg-gray-200 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{quote.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          quote.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : quote.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : quote.status === "Requested"
                            ? "bg-yellow-100 text-yellow-800"
                            : quote.status === "Quoted"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 max-w-xs truncate"
                    title={quote.clientToAdminNote}
                  >
                    {quote.clientToAdminNote || "-"}
                  </td>
                  <td className="px-4 py-3">{quote.requestedItems.length}</td>
                  <td className="px-4 py-3">
                    {(quote.totalPrice || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {quote.isOrderCreated ? (
                      <span className="text-green-700 text-sm font-medium">
                        Created
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCreateOrder(quote)}
                        disabled={isCreating}
                        className="cursor-pointer text-xs text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded disabled:opacity-50"
                      >
                        {isCreating ? "Creating..." : "Create"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-end space-x-1">
                      <Link to={`/admin/quotes/${quote._id}/edit`}>
                        <button
                          title="Edit Quote"
                          className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        title="Delete Quote"
                        onClick={() => handleDelete(quote._id)}
                        className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                      <button
                        title="Open Quote PDF"
                        onClick={() => handleShare(quote._id)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 cursor-pointer"
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
