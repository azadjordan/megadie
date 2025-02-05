import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../slices/usersApiSlice";

const UserEdit = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    isAdmin: false,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
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
      setMessage("User updated successfully.");
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (error) {
      setMessage("Failed to update user.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      {message && <p className="mb-4 text-gray-700">{message}</p>}
      {isLoading ? (
        <p>Loading user details...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching user</p>
      ) : (
        <form onSubmit={submitHandler} className="bg-white p-6 shadow rounded-lg">
          <label className="block mb-2">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

          <label className="block mb-2">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

          <label className="block mb-2">Phone:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

          <label className="block mb-2">Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

          <label className="block mb-2 flex items-center">
            <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} className="mr-2" />
            Admin
          </label>

          <button type="submit" disabled={isUpdating} className="mt-6 px-6 py-2 bg-green-600 text-white rounded">
            {isUpdating ? "Updating..." : "Update User"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserEdit;
