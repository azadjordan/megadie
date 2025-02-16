import { useGetAllPaymentsQuery, useUpdatePaymentMutation } from "../slices/paymentsApiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentList = () => {
  const { data: payments, isLoading, isError, refetch } = useGetAllPaymentsQuery();
  const [updatePayment] = useUpdatePaymentMutation();
  const [showCashOnly, setShowCashOnly] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading payments...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load payments.</p>;

  const filteredPayments = showCashOnly
    ? payments.filter((payment) => payment.paymentMethod === "Cash")
    : payments;

  // ✅ Toggle Payment Status (Received <-> Cancelled)
  const togglePaymentStatus = async (payment) => {
    try {
      await updatePayment({
        id: payment._id,
        updatedData: { status: payment.status === "Received" ? "Cancelled" : "Received" },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update payment status", error);
    }
  };

  return (
    <div className="container mx-auto pt-20">
      
      {/* ✅ Header Section with Add Payment Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl font-bold">Payments</h2>
        
        {/* ✅ "Add a Payment" Button (ALWAYS VISIBLE) */}
        <button
          onClick={() => navigate("/admin/payments/create")}
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
        >
          + Add a Payment
        </button>
      </div>

      {/* ✅ Toggle Switch for Filtering Cash Payments */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-700">
          Total Payments: <strong>{filteredPayments.length}</strong>
        </p>
        <label className="flex items-center space-x-3 cursor-pointer">
          <span className="text-gray-700 text-sm font-medium">Show Cash Payments Only</span>
          <input
            type="checkbox"
            checked={showCashOnly}
            onChange={() => setShowCashOnly(!showCashOnly)}
            className="hidden"
          />
          <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-0.5 transition-all ${showCashOnly ? "bg-purple-500" : ""}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${showCashOnly ? "translate-x-5" : ""}`}></div>
          </div>
        </label>
      </div>

      {/* ✅ Payments Table */}
      {filteredPayments.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ✅ Table Header with Consistent Website Color */}
          <div className="grid grid-cols-8 bg-purple-500 text-white font-medium py-3 px-4">
            <span>ID</span>
            <span>Date</span>
            <span>Client</span>
            <span>Phone</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Status</span>
            <span>Note</span>
          </div>

          {/* ✅ Payments List */}
          <div>
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="grid grid-cols-8 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition items-center">
                
                {/* ✅ Payment ID */}
                <span className="text-purple-600 font-semibold">{payment._id.slice(0, 10)}...</span>

                {/* ✅ Payment Date */}
                <span className="text-gray-600">{new Date(payment.paymentDate).toLocaleDateString()}</span>

                {/* ✅ Client Name */}
                <span className="text-gray-800">{payment.user?.name || "Unknown"}</span>

                {/* ✅ Phone */}
                <span className="text-gray-600">{payment.user?.phone || "No phone"}</span>

                {/* ✅ Amount (Styled Value Box) */}
                <div className="w-fit">
                  <span className="text-gray-800 text-sm font-medium">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>

                {/* ✅ Payment Method Badge */}
                <div className="w-fit">
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    payment.paymentMethod === "Cash"
                      ? "bg-green-100 text-green-700"
                      : payment.paymentMethod === "Bank Transfer"
                      ? "bg-blue-100 text-blue-700"
                      : payment.paymentMethod === "Credit Card"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {payment.paymentMethod}
                  </span>
                </div>

                {/* ✅ Payment Status Badge (Admin can toggle it) */}
                <button
                  onClick={() => togglePaymentStatus(payment)}
                  className={`inline-block px-3 py-1 text-sm w-fit font-medium rounded-full transition ${
                    payment.status === "Received"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {payment.status}
                </button>

                {/* ✅ Payment Note */}
                <span className="text-gray-600">{payment.note || "No note"}</span>

              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          {showCashOnly ? "No cash payments found." : "No payments available."}
        </p>
      )}
    </div>
  );
};

export default PaymentList;
