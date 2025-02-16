import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderPricesMutation,
} from "../slices/ordersApiSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditOrderPrices = () => {
  const { orderId } = useParams();
  const navigate = useNavigate(); // Initialize navigate

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(orderId);
  const [updateOrderPrices, { isLoading: isUpdating }] =
    useUpdateOrderPricesMutation();

  // Local state for editable prices
  const [items, setItems] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [extraFee, setExtraFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (order) {
      setItems(
        order.orderItems.map((item) => ({
          ...item,
          editablePrice: item.price,
        }))
      );
      setDeliveryCharge(order.deliveryCharge || 0);
      setExtraFee(order.extraFee || 0);
    }
  }, [order]);

  // Update item price in state
  const handleItemPriceChange = (index, newPrice) => {
    const updatedItems = [...items];
    updatedItems[index].editablePrice = newPrice;
    setItems(updatedItems);
  };

  // Update total price dynamically
  useEffect(() => {
    const itemTotal = items.reduce(
      (sum, item) => sum + item.editablePrice * item.qty,
      0
    );
    setTotalPrice(
      itemTotal + parseFloat(deliveryCharge) + parseFloat(extraFee)
    );
  }, [items, deliveryCharge, extraFee]);

  // Handle saving changes
  const handleSubmit = async () => {
    try {
      await updateOrderPrices({
        orderId,
        updatedItems: items.map((item) => ({
          product: item.product,
          price: item.editablePrice,
        })),
        deliveryCharge: parseFloat(deliveryCharge),
        extraFee: parseFloat(extraFee),
      }).unwrap();
      
      toast.success("Order prices updated successfully!");
      await refetch();
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update order prices.");
    }
  };

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
    <div className="container mx-auto px-6 py-10 mt-[80px] w-[85%] bg-white shadow-md rounded-lg p-8">
      {/* ✅ Back Button */}
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
        >
          ← Back to Order Details
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Edit Order Prices
      </h2>

      {/* ✅ Order Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-sm">
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Unit Price</th>
              <th className="p-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.product} className="border-t border-gray-200">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <span className="text-gray-900 text-md">{item.name}</span>
                </td>
                <td className="p-3 text-center text-gray-700">{item.qty}</td>
                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={item.editablePrice}
                    onChange={(e) =>
                      handleItemPriceChange(
                        index,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-20 px-2 py-1 border rounded-md text-center"
                  />
                </td>
                <td className="p-3 text-center text-gray-900 font-semibold">
                  ${(item.editablePrice * item.qty).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Compact Additional Prices & Total Section */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-gray-50 p-3 rounded-md">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm">Delivery Charge:</label>
            <input
              type="number"
              value={deliveryCharge}
              onChange={(e) =>
                setDeliveryCharge(parseFloat(e.target.value) || 0)
              }
              className="w-20 px-2 py-1 border rounded-md text-center text-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm">Extra Fee:</label>
            <input
              type="number"
              value={extraFee}
              onChange={(e) => setExtraFee(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border rounded-md text-center text-md"
            />
          </div>
        </div>

        {/* ✅ Compact Total Price & Save Button */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-purple-600">
            ${totalPrice.toFixed(2)}
          </span>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPrices;
