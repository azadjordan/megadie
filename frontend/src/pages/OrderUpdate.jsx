import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../slices/ordersApiSlice";
import { useGetUsersQuery } from "../slices/usersApiSlice";

const UpdateOrder = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  const { data: users = [] } = useGetUsersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [form, setForm] = useState({
    user: "",
    totalPrice: 0,
    deliveryCharge: 0,
    extraFee: 0,
    deliveredBy: "",
    isDelivered: false,
    deliveredAt: "",
    status: "Processing",
    clientToAdminNote: "",
    adminToAdminNote: "",
    adminToClientNote: "",
    stockUpdated: false,
    invoiceGenerated: false,
  });

  useEffect(() => {
    if (order) {
      setForm({
        user: order.user?._id || "",
        totalPrice: order.totalPrice,
        deliveryCharge: order.deliveryCharge,
        extraFee: order.extraFee,
        deliveredBy: order.deliveredBy || "",
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt ? order.deliveredAt.split("T")[0] : "",
        status: order.status,
        clientToAdminNote: order.clientToAdminNote || "",
        adminToAdminNote: order.adminToAdminNote || "",
        adminToClientNote: order.adminToClientNote || "",
        stockUpdated: order.stockUpdated,
        invoiceGenerated: order.invoiceGenerated,
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrder({ id: orderId, ...form }).unwrap();
      alert("Order updated");
      navigate("/admin/orders", { state: { refetch: true } });
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update order");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Failed to load order.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold text-purple-700">Update Order</h2>

      {/* Read-Only Fields */}
      <div className="border p-3 bg-gray-50 rounded">
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p className="mt-2 font-semibold">Order Items:</p>
        <ul className="list-disc ml-5 mt-1">
          {order.orderItems.map((item, idx) => (
            <li key={idx}>
              {item.product?.name || "Product"} - {item.qty} x {item.unitPrice.toFixed(2)} AED
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>User</label>
            <select
              name="user"
              value={form.user}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
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
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Charges */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>Total Price (AED)</label>
            <input
              type="number"
              name="totalPrice"
              value={form.totalPrice}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Delivery Charge (AED)</label>
            <input
              type="number"
              name="deliveryCharge"
              value={form.deliveryCharge}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Extra Fee (AED)</label>
            <input
              type="number"
              name="extraFee"
              value={form.extraFee}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Delivered By</label>
            <input
              type="text"
              name="deliveredBy"
              value={form.deliveredBy}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Delivered At</label>
            <input
              type="date"
              name="deliveredAt"
              value={form.deliveredAt}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

{/* Delivery & Flags */}
<div className="grid grid-cols-3 gap-4">
  <div className="flex items-center space-x-2">
    <span className="font-medium">Delivered?</span>
    {form.isDelivered ? (
      <span className="text-green-600">✅</span>
    ) : (
      <span className="text-gray-500">❌</span>
    )}
  </div>

  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      name="stockUpdated"
      checked={form.stockUpdated}
      onChange={handleCheckbox}
    />
    <span>Stock Updated</span>
  </label>

  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      name="invoiceGenerated"
      checked={form.invoiceGenerated}
      onChange={handleCheckbox}
    />
    <span>Invoice Generated</span>
  </label>
</div>


        {/* Notes */}
        <div>
          <label>Client → Admin Note</label>
          <textarea
            name="clientToAdminNote"
            value={form.clientToAdminNote}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            rows="2"
          />
        </div>

        <div>
          <label>Admin → Admin Note</label>
          <textarea
            name="adminToAdminNote"
            value={form.adminToAdminNote}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            rows="2"
          />
        </div>

        <div>
          <label>Admin → Client Note</label>
          <textarea
            name="adminToClientNote"
            value={form.adminToClientNote}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            rows="2"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Order"}
        </button>
      </form>
    </div>
  );
};

export default UpdateOrder;
