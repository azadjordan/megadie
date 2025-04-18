import { useGetMyQuotesQuery } from "../../slices/quotesApiSlice";

const UserRequests = () => {
  const { data: quotes = [], isLoading, error } = useGetMyQuotesQuery();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-purple-700 mb-6">
        My Requests
      </h1>

      {isLoading ? (
        <p className="text-gray-500">Loading your quote requests...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load your requests.</p>
      ) : quotes.length === 0 ? (
        <p className="text-gray-600">
          You haven’t submitted any quote requests yet.
        </p>
      ) : (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
          {quotes.map((quote) => (
            <div
              key={quote._id}
              className="rounded-xl bg-white shadow-md border border-red-2 px-6 py-5 space-y-4"
            >
              {/* Status + Date */}
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
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

                <span className="text-sm text-gray-400">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Requested Items */}
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-500">Requested Items</p>
                {quote.requestedItems.map((item, i) => (
                  <div key={i}>
                    •{" "}
                    <span className="font-semibold">{item.product?.name}</span>{" "}
                    — {item.qty} pcs
                    {quote.status === "Quoted" &&
                      typeof item.unitPrice === "number" && (
                        <>
                          {" "}
                          ={" "}
                          <span className="font-medium">
                            {(item.qty * item.unitPrice).toFixed(2)} AED
                          </span>
                        </>
                      )}
                  </div>
                ))}
              </div>

              {/* Pricing Section */}
              {quote.status === "Quoted" && (
                <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {quote.requestedItems
                        .reduce(
                          (acc, item) => acc + item.qty * item.unitPrice,
                          0
                        )
                        .toFixed(2)}{" "}
                      AED
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{quote.deliveryCharge?.toFixed(2)} AED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Fee</span>
                    <span>{quote.extraFee?.toFixed(2)} AED</span>
                  </div>
                  <div className="flex justify-between font-semibold text-purple-700 pt-2">
                    <span>Total</span>
                    <span>{quote.totalPrice?.toFixed(2)} AED</span>
                  </div>
                </div>
              )}

              {(quote.status === "Confirmed" || quote.status === "Rejected") &&
                typeof quote.totalPrice === "number" && (
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 space-y-1">
                    <div className="flex justify-between font-semibold text-purple-700">
                      <span>Total</span>
                      <span>{quote.totalPrice.toFixed(2)} AED</span>
                    </div>
                  </div>
                )}

              {/* Notes */}
              {quote.clientToAdminNote && (
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-gray-500 mb-1">Your Note</p>
                  <p className="italic">{quote.clientToAdminNote}</p>
                </div>
              )}
              {quote.AdminToClientNote && (
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-gray-500 mb-1">
                    Seller Response
                  </p>
                  <p>{quote.AdminToClientNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequests;
