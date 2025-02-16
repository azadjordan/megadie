import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateOrderStatusMutation,
  useToggleOrderPaymentStatusMutation,
  useDeductStockMutation,
  useRestoreStockMutation,
  useUpdateAdminNoteMutation,
  useUpdateSellerNoteMutation, // ✅ Import Seller Note Mutation
  useToggleDebtAssignmentMutation,
} from "../slices/ordersApiSlice";

const orderStages = [
  "Pending",
  "Quoted",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const OrderActions = ({
  orderId,
  stockUpdated,
  currentStatus,
  isPaid,
  isDebtAssigned,
  adminNote,
  sellerNote,
  refetch,
  refetchUser,
}) => {
  const navigate = useNavigate();
  const [deductStock, { isLoading: isDeducting }] = useDeductStockMutation();
  const [restoreStock, { isLoading: isRestoring }] = useRestoreStockMutation();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [togglePaymentStatus, { isLoading: isTogglingPayment }] =
    useToggleOrderPaymentStatusMutation();
  const [updateAdminNote, { isLoading: isUpdatingNote }] =
    useUpdateAdminNoteMutation();
  const [updateSellerNote, { isLoading: isUpdatingSellerNote }] =
    useUpdateSellerNoteMutation(); // ✅ Seller Note Mutation
  const [toggleDebtAssignment, { isLoading: isTogglingDebt }] =
    useToggleDebtAssignmentMutation();

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [adminNoteText, setAdminNoteText] = useState(adminNote || "");
  const [sellerNoteText, setSellerNoteText] = useState(sellerNote || ""); // ✅ Track Seller Note

  const handleToggleDebtAssignment = async () => {
    try {
      await toggleDebtAssignment(orderId).unwrap();
      toast.success("Debt assignment updated!");

      await refetch(); // ✅ Refresh order data
      await refetchUser(); // ✅ NEW: Refresh user data to reflect wallet & debt changes
    } catch {
      toast.error("Failed to update debt assignment.");
    }
  };

  // ✅ Handle Order Status Change
  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success("Order status updated!");
      await refetch();
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  // ✅ Toggle Payment Status
  const handleTogglePayment = async () => {
    try {
      await togglePaymentStatus(orderId).unwrap();
      toast.success("Payment status updated!");
      await refetch();
    } catch {
      toast.error("Failed to update payment status.");
    }
  };

  // ✅ Handle Admin Note Update
  const handleAdminNoteUpdate = async () => {
    try {
      await updateAdminNote({ orderId, adminNote: adminNoteText }).unwrap();
      toast.success("Admin note updated!");
      await refetch();
    } catch {
      toast.error("Failed to update admin note.");
    }
  };

  // ✅ Handle Seller Note Update
  const handleSellerNoteUpdate = async () => {
    try {
      await updateSellerNote({ orderId, sellerNote: sellerNoteText }).unwrap();
      toast.success("Seller note updated!");
      await refetch();
    } catch {
      toast.error("Failed to update seller note.");
    }
  };

  // ✅ Handle Deduct Stock
  const handleDeductStock = async () => {
    try {
      await deductStock(orderId).unwrap();
      toast.success("Stock deducted!");
      await refetch();
    } catch {
      toast.error("Failed to deduct stock.");
    }
  };

  // ✅ Handle Restore Stock
  const handleRestoreStock = async () => {
    try {
      await restoreStock(orderId).unwrap();
      toast.success("Stock restored!");
      await refetch();
    } catch {
      toast.error("Failed to restore stock.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Admin Actions
      </h3>

      {/* ✅ Actions in One Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ✅ Payment Status */}
        <div className="flex flex-col">
          <label className="text-md font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-2xl">
            <span className="text-gray-700 text-md">Mark as Paid</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={handleTogglePayment}
                className="hidden"
              />
              <div
                className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-0.5 transition-all ${
                  isPaid ? "bg-green-500" : ""
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                    isPaid ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        {/* ✅ Order Status Dropdown */}
        <div className="flex flex-col">
          <label className="text-md font-medium text-gray-700 mb-1">
            Order Status
          </label>
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

        {/* ✅ Stock Management Buttons */}
        <div className="flex flex-col">
          <label className="text-md font-medium text-gray-700 mb-1">
            Stock Management
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleDeductStock}
              disabled={stockUpdated || isDeducting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50 transition hover:bg-red-600"
            >
              {isDeducting ? "Processing..." : "Deduct"}
            </button>
            <button
              onClick={handleRestoreStock}
              disabled={!stockUpdated || isRestoring}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50 transition hover:bg-green-600"
            >
              {isRestoring ? "Processing..." : "Restore"}
            </button>
          </div>
        </div>

        {/* ✅ Admin Note Section */}
        <div className="flex flex-col">
          <label className="text-md font-medium text-gray-700 mb-1">
            Admin Note
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={adminNoteText}
              onChange={(e) => setAdminNoteText(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAdminNoteUpdate}
              disabled={isUpdatingNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 transition hover:bg-blue-700"
            >
              {isUpdatingNote ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* ✅ Seller Note Section */}
        <div className="flex flex-col">
          <label className="text-md font-medium text-gray-700 mb-1">
            Seller Note
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sellerNoteText}
              onChange={(e) => setSellerNoteText(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSellerNoteUpdate}
              disabled={isUpdatingSellerNote}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md disabled:opacity-50 transition hover:bg-yellow-700"
            >
              {isUpdatingSellerNote ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Update Prices Button */}
        <div className="flex flex-col">
        <label className="text-md font-medium text-gray-700 mb-1">
            Quote / Pricing 
          </label>
          <button
            onClick={() => navigate(`/admin/order/edit-prices/${orderId}`)}
            className=" py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Update Order Prices
          </button>
        </div>

        {/* ✅ Debt Assignment Section */}
        <div className="flex flex-col">
          <label className="text-md font-medium text-gray-700 mb-1">
            Assign Order Total to Debt
          </label>
          <div className="flex gap-2">
            {/* ✅ Assign as Debt Button */}
            <button
              onClick={() => handleToggleDebtAssignment()}
              disabled={isDebtAssigned || isTogglingDebt}
              className={`flex-1 px-4 py-2 rounded-md text-white transition ${
                isDebtAssigned
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isTogglingDebt ? "Processing..." : "Assign"}
            </button>

            {/* ✅ Remove from Debt Button */}
            <button
              onClick={() => handleToggleDebtAssignment()}
              disabled={!isDebtAssigned || isTogglingDebt}
              className={`flex-1 px-4 py-2 rounded-md text-white transition ${
                !isDebtAssigned
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isTogglingDebt ? "Processing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderActions;
