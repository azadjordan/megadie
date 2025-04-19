import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../slices/ordersApiSlice";
import { useGetUsersQuery } from "../slices/usersApiSlice";

const OrderUpdate = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  const { data: users = [] } = useGetUsersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [formState, setFormState] = useState({
    user: "",
    status: "Processing",
    clientToAdminNote: "",
    adminToAdminNote: "",
    adminToClientNote: "",
  });

  useEffect(() => {
    if (order) {
      setFormState({
        user: order.user?._id || "",
        status: order.status,
        clientToAdminNote: order.clientToAdminNote || "",
        adminToAdminNote: order.adminToAdminNote || "",
        adminToClientNote: order.adminToClientNote || "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrder({ id: orderId, ...formState }).unwrap();
      alert("✅ Order updated successfully");
      navigate("/admin/orders");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("❌ Failed to update order");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-purple-700 mb-6">
        Update Order
      </h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load order.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only Order Info */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded">
            <div>
              <strong>Order Number:</strong> {order.orderNumber}
            </div>
            <div>
              <strong>User:</strong> {order.user?.name || "N/A"}
            </div>
            <div>
              <strong>Total:</strong> {order.totalPrice.toFixed(2)} AED
            </div>
            <div>
              <strong>Delivery Charge:</strong>{" "}
              {order.deliveryCharge.toFixed(2)} AED
            </div>
            <div>
              <strong>Extra Fee:</strong> {order.extraFee.toFixed(2)} AED
            </div>
            <div>
              <strong>Shipping Address:</strong> {order.shippingAddress}
            </div>
            <div>
              <strong>Delivered?</strong>{" "}
              {order.isDelivered ? "✅ Yes" : "❌ No"}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-sm">
                Change User
              </label>
              <select
                name="user"
                value={formState.user}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">
                Order Status
              </label>
              <select
                name="status"
                value={formState.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Client → Admin Note
            </label>
            <textarea
              name="clientToAdminNote"
              value={formState.clientToAdminNote}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Admin → Admin Note
            </label>
            <textarea
              name="adminToAdminNote"
              value={formState.adminToAdminNote}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Admin → Client Note
            </label>
            <textarea
              name="adminToClientNote"
              value={formState.adminToClientNote}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Order"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OrderUpdate;
