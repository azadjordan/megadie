import { useGetUsersQuery, useDeleteUserMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

const UserList = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [message, setMessage] = useState("");

  const deleteHandler = async (id) => {
    setMessage(`Deleting user ${id}...`);
    try {
      setDeletingUserId(id);
      await deleteUser(id).unwrap();
      setMessage("User deleted successfully.");
      refetch(); // ✅ Refresh user list
    } catch (error) {
      setMessage("Failed to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 pt-[120px]">
      <h1 className="text-3xl font-bold text-center mb-6">User List</h1>

      {message && <p className="text-center text-purple-600">{message}</p>}

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading users...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error fetching users.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-purple-500 text-white">
              <tr>
                <th className="py-4 px-6 w-1/4">ID</th>
                <th className="py-4 px-6 w-1/4">Name</th>
                <th className="py-4 px-6 w-1/4">Email</th>
                <th className="py-4 px-6 w-1/6">Role</th>
                <th className="py-4 px-6 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">{user._id.slice(0, 10)}...</td>
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex space-x-4">
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
