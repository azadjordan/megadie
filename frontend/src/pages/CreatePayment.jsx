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
      await createPayment({ userId, amount, paymentMethod, note }).unwrap();
      toast.success("Payment added successfully!");
      navigate("/admin/payments");
    } catch (error) {
      toast.error("Failed to create payment.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-lg bg-white shadow-md rounded-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Add a Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Select User */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Select User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a user</option>
            {isLoadingUsers ? (
              <option>Loading users...</option>
            ) : (
              users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.phone || "No phone"})
                </option>
              ))
            )}
          </select>
        </div>

        {/* ✅ Amount */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* ✅ Payment Method */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Credit Card</option>
            <option>Other</option>
          </select>
        </div>

        {/* ✅ Note */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition" disabled={isCreating}>
          {isCreating ? "Adding..." : "Add Payment"}
        </button>
      </form>
    </div>
  );
};

export default CreatePayment;
