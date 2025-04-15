import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
} from "../slices/paymentsApiSlice";
import Message from "../components/Message";

const PaymentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: payment, isLoading, error } = useGetPaymentByIdQuery(id);
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const [formData, setFormData] = useState({
    amount: 0,
    paymentMethod: "Cash",
    note: "",
    status: "Received",
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        note: payment.note,
        status: payment.status,
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePayment({ id, updatedData: formData }).unwrap();
      navigate("/admin/payments");
    } catch (err) {
      console.error("Failed to update payment:", err);
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  if (error) return <Message type="error">Failed to load payment.</Message>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Edit Payment</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Method</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cheque">Cheque</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Received">Received</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {isUpdating ? "Updating..." : "Update Payment"}
      </button>
    </form>
  );
};

export default PaymentUpdate;