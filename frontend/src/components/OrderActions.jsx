import { useState } from "react";
import { toast } from "react-toastify";
import {
  useUpdateOrderStatusMutation,
  useToggleOrderPaymentStatusMutation,
  useDeductStockMutation,
  useRestoreStockMutation,
} from "../slices/ordersApiSlice";

const orderStages = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderActions = ({ orderId, stockUpdated, currentStatus, isPaid, refetch }) => {
  const [deductStock, { isLoading: isDeducting }] = useDeductStockMutation();
  const [restoreStock, { isLoading: isRestoring }] = useRestoreStockMutation();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [togglePaymentStatus, { isLoading: isTogglingPayment }] = useToggleOrderPaymentStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  // ✅ Handle Order Status Change
  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success("Order status updated successfully!");
      await refetch();
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  // ✅ Toggle Payment Status
  const handleTogglePayment = async () => {
    try {
      await togglePaymentStatus(orderId).unwrap();
      toast.success("Payment status updated successfully!");
      await refetch();
    } catch (error) {
      toast.error("Failed to toggle payment status.");
    }
  };

  // ✅ Handle Deduct Stock
  const handleDeductStock = async () => {
    try {
      await deductStock(orderId).unwrap();
      toast.success("Stock deducted successfully!");
      await refetch();
    } catch (error) {
      toast.error("Failed to deduct stock.");
    }
  };

  // ✅ Handle Restore Stock
  const handleRestoreStock = async () => {
    try {
      await restoreStock(orderId).unwrap();
      toast.success("Stock restored successfully!");
      await refetch();
    } catch (error) {
      toast.error("Failed to restore stock.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ Order Status Dropdown */}
        <div>
          <h4 className="text-md font-medium mb-2">Order Status</h4>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isUpdatingStatus}
          >
            {orderStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Toggle Payment Status */}
        <div>
          <h4 className="text-md font-medium mb-2">Payment Status</h4>
          <label className="flex items-center space-x-3 cursor-pointer">
            <span className="text-gray-700 text-sm font-medium">Mark as Paid</span>
            <input type="checkbox" checked={isPaid} onChange={handleTogglePayment} className="hidden" />
            <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-0.5 transition-all ${isPaid ? "bg-green-500" : ""}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${isPaid ? "translate-x-5" : ""}`}></div>
            </div>
          </label>
        </div>

        {/* ✅ Stock Management Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deduct Stock Button */}
          <button
            onClick={handleDeductStock}
            disabled={stockUpdated || isDeducting} // 🔥 Prevents duplicate API calls
            className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
          >
            {isDeducting ? "Processing..." : "Deduct Stock"}
          </button>

          {/* Restore Stock Button */}
          <button
            onClick={handleRestoreStock}
            disabled={!stockUpdated || isRestoring} // 🔥 Prevents duplicate API calls
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            {isRestoring ? "Processing..." : "Restore Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderActions;
