import { useState } from "react";
import { useCreatePaymentMutation } from "../slices/paymentsApiSlice";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePayment = () => {
  const navigate = useNavigate();
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();

  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createPayment({
        userId,
        amount: Number(amount), // Ensure amount is a number
        paymentMethod,
        note,
      }).unwrap();

      toast.success(response.message);
      setTimeout(() => navigate("/admin/payments"), 1000);
    } catch (error) {
      toast.error("Failed to create payment.");
    }
  };

  return (
    <div className="container mx-auto px-6 mt-20 max-w-2xl">
      {/* ✅ Back Button at the Top Left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Add a Payment</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200"
      >
        {/* ✅ Select User */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            required
          >
            <option value="">Select a user</option>
            {isLoadingUsers ? (
              <option disabled>Loading users...</option>
            ) : (
              users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.phoneNumber || "No phone"})
                </option>
              ))
            )}
          </select>
        </div>

        {/* ✅ Amount */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            required
          />
        </div>

        {/* ✅ Payment Method */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
          >
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Credit Card</option>
            <option>Other</option>
          </select>
        </div>

        {/* ✅ Note */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300 resize-none"
            placeholder="Enter additional notes"
          />
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition w-full"
          disabled={isCreating}
        >
          {isCreating ? "Adding..." : "Add Payment"}
        </button>
      </form>
    </div>
  );
};

export default CreatePayment;
