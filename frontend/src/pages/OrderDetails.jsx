import { useParams, Link } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/ordersApiSlice";
import { FaArrowLeft } from "react-icons/fa";

const OrderDetails = () => {
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByIdQuery(id);

  return (
    <div className="p-6 w-full">
      {isLoading ? (
        <p className="text-gray-500">Loading order details...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load order details.</p>
      ) : (
        <div className="border rounded p-4 space-y-6 bg-white shadow">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-purple-700">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Client: {order.user?.name || "N/A"} ({order.user?.email})
            </p>
            <p className="text-sm">
              Status:{" "}
              <span className="font-medium">{order.status}</span> | Delivered:{" "}
              {order.isDelivered ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-gray-500">No</span>
              )}
            </p>
            {order.deliveredBy && (
              <p className="text-sm">Delivered By: {order.deliveredBy}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Info</h3>
            <p className="text-gray-700">{order.shippingAddress}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Unit Price (AED)</th>
                    <th className="px-4 py-2">Subtotal (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">
                        {item.product?.name || item.product}
                      </td>
                      <td className="px-4 py-2">{item.qty}</td>
                      <td className="px-4 py-2">{item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {(item.qty * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold mb-2">Pricing Summary</h3>
            <p>Total Price: {order.totalPrice.toFixed(2)} AED</p>
            <p>Delivery Charge: {order.deliveryCharge.toFixed(2)} AED</p>
            <p>Extra Fee: {order.extraFee.toFixed(2)} AED</p>
            <p className="font-medium">
              Invoice Generated:{" "}
              {order.invoiceGenerated ? (
                <span className="text-green-700">Yes</span>
              ) : (
                <span className="text-gray-500">No</span>
              )}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p>
              <strong>Client → Admin:</strong>{" "}
              {order.clientToAdminNote || <span className="text-gray-500">-</span>}
            </p>
            <p>
              <strong>Admin → Client:</strong>{" "}
              {order.adminToClientNote || <span className="text-gray-500">-</span>}
            </p>
            <p>
              <strong>Admin Internal:</strong>{" "}
              {order.adminToAdminNote || <span className="text-gray-500">-</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
