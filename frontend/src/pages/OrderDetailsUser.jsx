import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/ordersApiSlice";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const statusColors = {
  Pending: "bg-yellow-500 text-white",
  Quoted: "bg-purple-500 text-white",
  Processing: "bg-blue-500 text-white",
  Shipped: "bg-indigo-500 text-white",
  Delivered: "bg-green-500 text-white",
  Cancelled: "bg-red-500 text-white",
};

const OrderDetailsUser = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);

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
    <div className="container mx-auto px-6">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
      >
        ← Back to Orders
      </button>
      {/* ✅ Order Header */}
      <div className="flex justify-between items-center mt-6 mb-1">
      <h2 className="text-3xl font-bold text-gray-900">Order Details</h2>

        {/* ✅ Status & Payment */}
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

      {/* ✅ Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-sm rounded-lg p-6">
        {/* ✅ Order Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Order Information
          </h3>
          <div className="space-y-2 text-gray-800">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Order ID:</span>
              <span>{order._id}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Client Name:</span>
              <span>{order.user.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Phone:</span>
              <span>
                {order.user.phone || (
                  <span className="text-gray-500">No phone number</span>
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

      {/* ✅ Order Pricing Breakdown */}
      <div className="bg-white shadow-sm rounded-lg p-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Pricing Breakdown
        </h3>
        <div className="space-y-2 text-gray-800">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Subtotal:</span>
            <span className="font-semibold text-gray-900">
              $
              {order.orderItems
                .reduce((sum, item) => sum + item.price * item.qty, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Delivery Charge:</span>
            <span className="font-semibold text-gray-900">
              ${order.deliveryCharge ? order.deliveryCharge.toFixed(2) : "0.00"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Extra Fee:</span>
            <span className="font-semibold text-gray-900">
              ${order.extraFee ? order.extraFee.toFixed(2) : "0.00"}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t pt-3">
            <span>Total:</span>
            <span className="text-purple-600">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Seller Note */}
      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
        <h3 className="text-md font-semibold mb-2 text-gray-900">
          Seller Note:
        </h3>
        <p>
          {order.sellerNote ? (
            order.sellerNote
          ) : (
            <span className="text-gray-500">No seller note available</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsUser;
