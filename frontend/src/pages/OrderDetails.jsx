import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/ordersApiSlice";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import OrderActions from "../components/OrderActions"; // ✅ Import OrderActions

const statusColors = {
    Pending: "bg-yellow-500 text-white",
    Processing: "bg-blue-500 text-white",
    Shipped: "bg-indigo-500 text-white",
    Delivered: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
};

const OrderDetails = () => {
    const { id: orderId } = useParams();
    const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(orderId);
    const { userInfo } = useSelector((state) => state.auth);

    if (isLoading) return <p className="text-gray-500 text-center py-10">Loading order details...</p>;
    if (isError) return <p className="text-red-500 text-center py-10">Failed to load order details.</p>;
    if (!order) return <p className="text-gray-500 text-center py-10">Order not found.</p>;

    return (
        <div className="container mx-auto px-6 py-12 mt-[80px] w-[80%]">
            {/* ✅ Header with Status & Payment */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Order Details</h2>
                <div className="flex items-center gap-3">
                    {/* Order Status */}
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                    </span>

                    {/* Payment Status (Icon Only) */}
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

            {/* ✅ Combined Order Information & Ordered Items */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ✅ Order Information */}
                    <div className="space-y-4 text-gray-800">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> <span className="text-xl font-bold text-purple-600">${order.totalPrice.toFixed(2)}</span></p>
                        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                        <p><strong>Order Note:</strong> {order.note?.trim() ? order.note : <span className="text-gray-500">No note provided</span>}</p>
                    </div>

                    {/* ✅ Ordered Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Ordered Items</h3>
                        {order.orderItems.map((item) => (
                            <div key={item.product} className="flex items-center justify-between border-b py-4 last:border-none">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                <div className="flex-grow px-4">
                                    <h2 className="text-md font-medium truncate" title={item.name}>{item.name}</h2>
                                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.qty}</p>
                                </div>
                                <p className="text-gray-900 font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ Admin Actions (Separated Component) */}
            {userInfo?.isAdmin && (
                <OrderActions 
                orderId={orderId} 
                stockUpdated={order.stockUpdated}  // ✅ Ensure this is passed correctly
                currentStatus={order.status} 
                isPaid={order.isPaid} 
                refetch={refetch} 
            />
            
            )}
        </div>
    );
};

export default OrderDetails;
