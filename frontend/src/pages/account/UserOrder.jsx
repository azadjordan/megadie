import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../slices/ordersApiSlice";

const UserOrder = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id);

  if (isLoading) return <p className="text-gray-500 p-6">Loading order...</p>;
  if (error || !order) return <p className="text-red-500 p-6">Order not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-purple-700">Order {order.orderNumber}</h1>

      {/* Status & Date */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Returned"
              ? "bg-yellow-100 text-yellow-900"
              : order.status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {order.status}
        </span>
        <span className="text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Ordered Items</h2>
        <div className="space-y-2 text-sm text-gray-800">
          {order.orderItems.map((item, i) => (
            <div key={i}>
              • <span className="font-medium">{item.product?.name || "Unnamed Product"}</span> —{" "}
              {item.qty} pcs ={" "}
              <span className="text-purple-700 font-semibold">
                {(item.qty * item.unitPrice).toFixed(2)} AED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-800 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {order.orderItems
              .reduce((acc, item) => acc + item.qty * item.unitPrice, 0)
              .toFixed(2)}{" "}
            AED
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{order.deliveryCharge.toFixed(2)} AED</span>
        </div>
        <div className="flex justify-between">
          <span>Extra Fee</span>
          <span>{order.extraFee.toFixed(2)} AED</span>
        </div>
        <div className="flex justify-between font-semibold text-purple-700 pt-2">
          <span>Total</span>
          <span>{order.totalPrice.toFixed(2)} AED</span>
        </div>
      </div>

      {/* Notes */}
      {order.clientToAdminNote && (
        <div className="text-sm text-gray-700">
          <p className="font-medium text-gray-500 mb-1">Your Note</p>
          <p className="italic">{order.clientToAdminNote}</p>
        </div>
      )}
      {order.adminToClientNote && (
        <div className="text-sm text-gray-700">
          <p className="font-medium text-gray-500 mb-1">Seller Response</p>
          <p>{order.adminToClientNote}</p>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
