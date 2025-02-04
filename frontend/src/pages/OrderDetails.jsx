import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/ordersApiSlice";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);

  if (isLoading) return <p className="text-gray-500 text-center">Loading order details...</p>;
  if (isError) return <p className="text-red-500 text-center">Failed to load order details.</p>;
  if (!order) return <p className="text-gray-500 text-center">Order not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md mt-12">
      <h2 className="text-2xl font-semibold text-center mb-6">Order Details</h2>

      {/* Order Info */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}</p>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Ordered Items</h3>
        {order.orderItems.map((item) => (
          <div key={item.product} className="flex items-center justify-between border-b py-2">
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
            <div className="flex-grow px-4">
              <h2 className="text-sm font-medium">{item.name}</h2>
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.qty}</p>
            </div>
            <p className="text-gray-900 font-semibold">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
