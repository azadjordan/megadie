import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const User = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    wallet: 0,
    outstandingBalance: 0,
    isAdmin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        wallet: user.wallet || 0,
        outstandingBalance: user.outstandingBalance || 0,
        isAdmin: user.isAdmin,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id: userId, ...formData }).unwrap();
      toast.success("User updated successfully.");
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  return (
    <div className="container mx-auto p-6 mt-[80px] max-w-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">User</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading user details...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error fetching user</p>
      ) : (
        <form onSubmit={submitHandler} className="bg-white p-6 shadow rounded-lg space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Email (Now Editable) */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Wallet (Money Paid) */}
          <div>
            <label className="text-sm font-medium">Wallet Balance</label>
            <input
              type="number"
              name="wallet"
              value={formData.wallet}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Outstanding Balance (Debt) */}
          <div>
            <label className="text-sm font-medium">Outstanding Balance (Debt)</label>
            <input
              type="number"
              name="outstandingBalance"
              value={formData.outstandingBalance}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Admin Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Admin</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default User;
