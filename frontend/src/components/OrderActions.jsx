import { useState } from "react";
import { useUpdateOrderToPaidMutation, useUpdateOrderToDeliveredMutation } from "../slices/ordersApiSlice";

const OrderActions = ({ orderId, isPaid, isDelivered, refetch }) => {
  const [updateOrderToPaid, { isLoading: isPaying }] = useUpdateOrderToPaidMutation();
  const [updateOrderToDelivered, { isLoading: isDelivering }] = useUpdateOrderToDeliveredMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      await action(orderId).unwrap();
      refetch(); // Refresh data after update
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Mark as Paid */}
      {!isPaid && (
        <button
          onClick={() => handleAction(updateOrderToPaid)}
          className="bg-green-500 w-full text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
          disabled={isPaying || isProcessing}
        >
          {isPaying || isProcessing ? "Processing..." : "Mark as Paid"}
        </button>
      )}

      {/* Mark as Delivered */}
      {!isDelivered && (
        <button
          onClick={() => handleAction(updateOrderToDelivered)}
          className="bg-purple-500 w-full text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition"
          disabled={isDelivering || isProcessing}
        >
          {isDelivering || isProcessing ? "Processing..." : "Mark as Delivered"}
        </button>
      )}
    </div>
  );
};

export default OrderActions;
