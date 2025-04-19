import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
} from "../slices/paymentsApiSlice";

const PaymentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: payment, isLoading, error } = useGetPaymentByIdQuery(id);
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const [formState, setFormState] = useState({
    amount: "",
    paymentMethod: "Cash",
    paymentDate: "",
    note: "",
    status: "Received",
  });

  useEffect(() => {
    if (payment) {
      setFormState({
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate?.slice(0, 10) || "",
        note: payment.note || "",
        status: payment.status,
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePayment({ id, ...formState }).unwrap();
      alert("✅ Payment updated successfully");
      navigate("/admin/payments");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("❌ Failed to update payment");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-purple-700 mb-4">Update Payment</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load payment data.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (AED)</label>
            <input
              type="number"
              name="amount"
              value={formState.amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formState.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Cheque</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={formState.paymentDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <textarea
              name="note"
              value={formState.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="Received">Received</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Payment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentUpdate;
