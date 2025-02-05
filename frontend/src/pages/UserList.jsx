import { useGetUsersQuery, useDeleteUserMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

const UserList = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [message, setMessage] = useState("");

  const deleteHandler = async (id) => {
    setMessage(`Deleting user ${id}...`);
    try {
      setDeletingUserId(id);
      await deleteUser(id).unwrap();
      setMessage("User deleted successfully.");
    } catch (error) {
      setMessage("Failed to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User List</h1>

      {/* Display success/error messages */}
      {message && <p className="mb-4 text-gray-700">{message}</p>}

      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching users</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Admin</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Show newest first
                .map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{user._id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.isAdmin ? "✅" : "❌"}</td>
                    <td className="p-3 flex space-x-4">
                      <button
                        onClick={() => navigate(`/admin/user/edit/${user._id}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          disabled={deletingUserId === user._id}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
