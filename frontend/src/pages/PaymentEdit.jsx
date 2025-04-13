import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPaymentByIdQuery, useUpdatePaymentMutation } from "../slices/paymentsApiSlice";
import { toast } from "react-toastify";

const PaymentEdit = () => {
  const { id: paymentId } = useParams();
  const navigate = useNavigate();
  const { data: payment, isLoading, error } = useGetPaymentByIdQuery(paymentId);
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const [formData, setFormData] = useState({
    paymentMethod: "Cash",
    status: "Received",
    note: "",
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        note: payment.note || "",
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePayment({ id: paymentId, updatedData: formData }).unwrap();
      toast.success(response.message); // ✅ Show backend message in toast
      setTimeout(() => navigate("/admin/payments"), 1000);
    } catch (error) {
      toast.error("Failed to update payment.");
    }
  };

  return (
    <div className="container mx-auto px-6 mt-18 max-w-2xl">
      {/* ✅ Back Button at the Top Left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-1 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit Payment</h1>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading payment details...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error fetching payment</p>
      ) : (
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200"
        >
          {/* ✅ Payment Date (Disabled) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Payment Date</label>
            <input
              type="text"
              value={new Date(payment.paymentDate).toLocaleDateString()}
              disabled
              className=" bg-gray-300 w-full border border-gray-300 p-3 rounded-lg  cursor-not-allowed"
            />
          </div>

          {/* ✅ Amount (Disabled) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Amount ($)</label>
            <input
              type="number"
              value={payment.amount}
              disabled
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-300 cursor-not-allowed"
            />
          </div>

          {/* ✅ Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            >
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Other</option>
            </select>
          </div>

          {/* ✅ Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            >
              <option>Received</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* ✅ Note */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Note (Optional)</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300 resize-none"
            />
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition w-full"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentEdit;
