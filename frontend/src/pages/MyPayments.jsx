import { useSelector } from "react-redux";
import { useGetUserPaymentsQuery } from "../slices/paymentsApiSlice";

const MyPayments = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: paymentsData, isLoading, isError } = useGetUserPaymentsQuery(userInfo?._id);
  // ✅ Ensure paymentsData is properly mapped
  const payments = Array.isArray(paymentsData) ? paymentsData : [];
  const wallet = paymentsData?.wallet ?? userInfo?.wallet ?? 0;
  const outstanding = paymentsData?.outstandingBalance ?? userInfo?.outstandingBalance ?? 0;

  if (isLoading) return <p className="text-gray-500 text-center py-10">Loading payments...</p>;
  if (isError) return <p className="text-red-500 text-center py-10">Failed to load payments.</p>;

  return (
    <div>
      {/* ✅ Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-4 gap-4">
        <h2 className="text-3xl font-bold">My Payments</h2>

        {/* ✅ Wallet & Outstanding Balance */}
        <div className="flex flex-col md:flex-row gap-4 bg-gray-100 p-3 rounded-md w-fit">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Wallet:</span>
            <span className="text-green-600 font-semibold">${wallet.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Outstanding:</span>
            <span className="text-red-600 font-semibold">${outstanding.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ✅ Payments Table */}
      {payments.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ✅ Table Header */}
          <div className="grid grid-cols-5 bg-gray-100 text-gray-700 font-medium py-3 px-4">
            <span>Date</span>
            <span>Method</span>
            <span>Amount</span>
            <span>Note</span>
            <span>Status</span>
          </div>

          {/* ✅ Payments List */}
          <div>
            {payments.map((payment) => (
              <div key={payment._id} className="grid grid-cols-5 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition">
                
                {/* ✅ Payment Date (Handle Undefined Dates) */}
                <span className="text-gray-600">
                  {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}
                </span>

                {/* ✅ Payment Method (Styled Badge) */}
                <div className="w-fit">
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                    payment.paymentMethod === "Cash"
                      ? "bg-green-100 text-green-700"
                      : payment.paymentMethod === "Bank Transfer"
                      ? "bg-blue-100 text-blue-700"
                      : payment.paymentMethod === "Credit Card"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {payment.paymentMethod || "Unknown"}
                  </span>
                </div>

                {/* ✅ Payment Amount */}
                <span className="text-gray-800 font-medium ">
                  ${payment.amount ? payment.amount.toFixed(2) : "0.00"}
                </span>

                {/* ✅ Payment Note */}
                <span className="text-gray-600">{payment.note || <span className="text-gray-500">No note</span>}</span>

                {/* ✅ Payment Status (Styled Badge) */}
                <div className="w-fit">
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                    payment.status === "Received"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {payment.status || "Pending"}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">You have no payments to show.</p>
      )}
    </div>
  );
};

export default MyPayments;
