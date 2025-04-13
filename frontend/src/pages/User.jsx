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
    <div className="container mx-auto px-6 mt-20 max-w-2xl">
      {/* ✅ Back Button at the Top Left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit User</h1>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading user details...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error fetching user</p>
      ) : (
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200"
        >
          {/* ✅ Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
              placeholder="Enter user name"
            />
          </div>

          {/* ✅ Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
              placeholder="Enter user email"
            />
          </div>

          {/* ✅ Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
              placeholder="Enter phone number"
            />
          </div>

          {/* ✅ Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
              placeholder="Enter address"
            />
          </div>

          {/* ✅ Wallet Balance */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Wallet Balance</label>
            <input
              type="number"
              name="wallet"
              value={formData.wallet}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            />
          </div>

          {/* ✅ Outstanding Balance */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Outstanding Balance (Debt)</label>
            <input
              type="number"
              name="outstandingBalance"
              value={formData.outstandingBalance}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            />
          </div>

          {/* ✅ Admin Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer"
            />
            <label className="text-gray-700 font-medium">Admin</label>
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

export default User;
