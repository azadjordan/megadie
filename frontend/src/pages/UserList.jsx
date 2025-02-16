import { useGetUsersQuery, useDeleteUserMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
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
    <div className="container mx-auto px-6 py-12">
      {/* ✅ Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-4 gap-4">
        <h2 className="text-3xl font-bold">User List</h2>
      </div>

      {message && <p className="text-center text-purple-600">{message}</p>}

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading users...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error fetching users.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ✅ Table Header */}
          <div className="grid grid-cols-6 bg-gray-100 text-gray-700 font-medium py-3 px-4">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Wallet</span>
            <span>Debt</span>
            <span>Role</span>
          </div>

          {/* ✅ Users List (Clickable Rows) */}
          <div>
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/admin/user/${user._id}`)} // ✅ Click entire row to navigate
                className="grid grid-cols-6 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer items-center"
              >
                {/* ✅ User ID */}
                <span className="text-purple-600 font-semibold">{user._id.slice(0, 10)}...</span>

                {/* ✅ Name */}
                <span className="text-gray-800">{user.name}</span>

                {/* ✅ Email */}
                <span className="text-gray-600 truncate">{user.email}</span>

                {/* ✅ Wallet (Styled Value Box) */}
                <div className="w-fit">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                    ${user.wallet.toFixed(2)}
                  </span>
                </div>

                {/* ✅ Outstanding Balance (Styled Value Box) */}
                <div className="w-fit">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                    ${user.outstandingBalance.toFixed(2)}
                  </span>
                </div>

                {/* ✅ Role (Styled Badge) */}
                <div className="w-fit">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      user.isAdmin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
