import { Link } from "react-router-dom";
import { useGetMyQuotesQuery } from "../../slices/quotesApiSlice";

const UserRequests = () => {
  const { data: quotes = [], isLoading, error } = useGetMyQuotesQuery();

  return (
    <div className="p-6 w-full">
      {isLoading ? (
        <p className="text-gray-500">Loading your quote requests...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load your requests.</p>
      ) : quotes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-4">
            No requests found. You can create a new request by browsing our products.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-6 py-2 rounded transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
          {quotes.map((quote) => (
            <div
              key={quote._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 hover:shadow-md transition"
            >
              {/* Header: Status + Date */}
              <div className="flex justify-between items-center mb-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full font-medium text-xs ${
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
                <span className="text-gray-400 text-sm">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Items List */}
              <div className="text-sm text-gray-700 mb-4">
                <p className="text-gray-500 font-medium mb-2">Requested Items</p>
                {quote.requestedItems.map((item, i) => (
                  <div key={i}>
                    • <span className="font-semibold">{item.product?.name}</span> — {item.qty} pcs{" "}
                    {quote.status === "Quoted" &&
                      typeof item.unitPrice === "number" && (
                        <>
                          ={" "}
                          <span className="font-medium">
                            {(item.qty * item.unitPrice).toFixed(2)} AED
                          </span>
                        </>
                      )}
                  </div>
                ))}
              </div>

              {/* Optional Message for Requested */}
              {quote.status === "Requested" && (
                <div className="w-fit text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-4 py-3 mb-4">
                  We’ll get back to you soon with the best offer, stay tuned!
                </div>
              )}

              {/* Pricing Summary */}
              {(quote.status === "Quoted" ||
                quote.status === "Confirmed" ||
                quote.status === "Rejected") && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1 border border-gray-200 mb-4">
                  {quote.status === "Quoted" && (
                    <>
                      <Row
                        label="Subtotal"
                        value={quote.requestedItems
                          .reduce((acc, item) => acc + item.qty * item.unitPrice, 0)
                          .toFixed(2)}
                      />
                      <Row label="Delivery" value={quote.deliveryCharge?.toFixed(2)} />
                      <Row label="Extra Fee" value={quote.extraFee?.toFixed(2)} />
                    </>
                  )}
                  <Row label="Total" value={quote.totalPrice?.toFixed(2)} highlight />
                </div>
              )}

              {/* Notes */}
              {quote.clientToAdminNote?.trim() && (
                <NoteBlock
                  label="Your Note"
                  content={
                    quote.clientToAdminNote
                      .split("\n")
                      .map((line, idx) => (
                        <p key={idx} className="italic mb-1 last:mb-0">{line}</p>
                      ))
                  }
                />
              )}
              {quote.AdminToClientNote?.trim() && (
                <NoteBlock
                  label="Seller Response"
                  content={<p className="italic">{quote.AdminToClientNote}</p>}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, highlight = false }) => (
  <div
    className={`flex justify-between ${
      highlight ? "font-semibold text-purple-700 pt-2" : ""
    }`}
  >
    <span>{label}</span>
    <span>{value} AED</span>
  </div>
);

const NoteBlock = ({ label, content }) => (
  <div className="text-sm text-gray-700 mb-3">
    <p className="font-medium text-gray-500 mb-1">{label}</p>
    {content}
  </div>
);

export default UserRequests;
