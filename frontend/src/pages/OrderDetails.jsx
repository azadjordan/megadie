import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/ordersApiSlice";
import { useGetUserByIdQuery } from "../slices/usersApiSlice"; // ✅ Fetch latest user info
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import OrderActions from "../components/OrderActions"; // ✅ Import OrderActions

const statusColors = {
  Pending: "bg-yellow-500 text-white",
  Quoted: "bg-purple-500 text-white",
  Processing: "bg-blue-500 text-white",
  Shipped: "bg-indigo-500 text-white",
  Delivered: "bg-green-500 text-white",
  Cancelled: "bg-red-500 text-white",
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(orderId);

  // ✅ Fetch the latest user data separately
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch: refetchUser, // ✅ Extract refetchUser correctly
  } = useGetUserByIdQuery(order?.user._id, {
    skip: !order?.user._id, // Avoid calling if order isn't loaded yet
  });
  

  if (isLoading)
    return (
      <p className="text-gray-500 text-center py-10">
        Loading order details...
      </p>
    );
  if (isError)
    return (
      <p className="text-red-500 text-center py-10">
        Failed to load order details.
      </p>
    );
  if (!order)
    return <p className="text-gray-500 text-center py-10">Order not found.</p>;

  return (
    <div className="container mx-auto px-6 py-12 w-[85%]">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      {/* ✅ Order Information & Ordered Items */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* ✅ Order Header (Title + Status + Payment) */}
        <div className="flex justify-between items-center mb-6 bg-purple-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900">
            Order: <span>{order._id}</span>
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </span>
            <span className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-full">
              {order.isPaid ? (
                <>
                  <FaCheckCircle className="text-green-500 mr-2" size={18} />
                  Paid
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-red-500 mr-2" size={18} />
                  Not Paid
                </>
              )}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ Order Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Order Information
            </h3>
            <div className="space-y-2 text-gray-800">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Client Name:</span>
                <span>{order.user.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Email:</span>
                <span>{order.user.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Phone:</span>
                <span>
                  {order.user.phone || (
                    <span className="text-gray-500">
                      No phone number provided
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">
                  Shipping Address:
                </span>
                <span>{order.shippingAddress}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Buyer Note:</span>
                <span>
                  {order.clientNote || (
                    <span className="text-gray-500">No note provided</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">
                  Delivery Charge:
                </span>
                <span className="font-semibold text-gray-700">
                  $
                  {order.deliveryCharge
                    ? order.deliveryCharge.toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Extra Fee:</span>
                <span className="font-semibold text-gray-700">
                  ${order.extraFee ? order.extraFee.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="font-bold text-purple-600">
                  ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>

            {/* ✅ Seller Note */}
            <div className="bg-yellow-50 p-4 rounded-lg mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-900">
                Seller Note:
              </h3>
              <p>
                {order.sellerNote || (
                  <span className="text-gray-500">
                    No seller note available
                  </span>
                )}
              </p>
            </div>

            {/* ✅ Admin Information */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-900">
                Admin Information
              </h3>

              {isUserLoading ? (
                <p className="text-gray-500">Loading client info...</p>
              ) : isUserError ? (
                <p className="text-red-500">Failed to load client info.</p>
              ) : (
                <>
                  <p>
                    <strong>Client Wallet:</strong>{" "}
                    <span className="text-green-600 font-semibold">
                      ${user?.wallet ? user.wallet.toFixed(2) : "0.00"}
                    </span>
                  </p>
                  <p>
                    <strong>Client Debt:</strong>{" "}
                    <span className="text-red-500 font-semibold">
                      $
                      {user?.outstandingBalance
                        ? user.outstandingBalance.toFixed(2)
                        : "0.00"}
                    </span>
                  </p>
                </>
              )}

              {/* ✅ Keep Admin Note (from Order Model) */}
              <p className="pt-3">
                <strong>Admin Note:</strong>{" "}
                {order.adminNote ? (
                  order.adminNote
                ) : (
                  <span className="text-gray-500">No admin note</span>
                )}
              </p>

              {/* ✅ Keep Delivered By (from Order Model) */}
              <p>
                <strong>Delivered By:</strong>{" "}
                {order.deliveredBy ? (
                  order.deliveredBy
                ) : (
                  <span className="text-gray-500">Not Assigned</span>
                )}
              </p>
            </div>
          </div>

          {/* ✅ Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Order Items
            </h3>
            {order.orderItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center justify-between border-b py-4 last:border-none"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-grow px-4">
                  <h2 className="text-md font-medium truncate">{item.name}</h2>
                  <p className="text-gray-600 text-sm">
                    ${item.price.toFixed(2)} × {item.qty}
                  </p>
                </div>
                <p className="text-gray-900 font-semibold">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Admin Actions */}
      <div className="mt-6">
        <OrderActions
          orderId={orderId}
          stockUpdated={order.stockUpdated}
          currentStatus={order.status}
          isPaid={order.isPaid}
          isDebtAssigned={order.isDebtAssigned} // ✅ Pass Debt Assignment Status
          adminNote={order.adminNote}
          sellerNote={order.sellerNote}
          refetch={refetch} // ✅ Order Refetch
          refetchUser={refetchUser} // ✅ NEW: Refetch user data to update wallet & debt
        />
      </div>
    </div>
  );
};

export default OrderDetails;
