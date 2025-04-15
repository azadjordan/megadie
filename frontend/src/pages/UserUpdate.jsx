import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../slices/usersApiSlice";
import Message from "../components/Message";

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        isAdmin: user.isAdmin || false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id, ...formData }).unwrap();
      navigate("/admin/users");
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  if (error) return <Message type="error">Failed to load user.</Message>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Edit User</h2>

      {["name", "email", "phoneNumber", "address"].map((field) => (
        <div key={field}>
          <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
            {field === "phoneNumber" ? "Phone Number" : field}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
      ))}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isAdmin"
          checked={formData.isAdmin}
          onChange={handleChange}
        />
        <label className="text-sm text-gray-700">Is Admin</label>
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {isUpdating ? "Updating..." : "Update User"}
      </button>
    </form>
  );
};

export default UserUpdate;
