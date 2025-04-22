import { useGetUsersQuery } from "../slices/usersApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaUserShield, FaUser } from "react-icons/fa";

const UserList = () => {
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">All Users</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching users.</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-200 transition-colors duration-150"
                >
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phoneNumber || "-"}</td>
                  <td className="px-4 py-3">{user.address || "-"}</td>
                  <td className="px-4 py-3">
                    {user.isAdmin ? (
                      <span className="flex items-center gap-1 text-green-700 text-sm font-medium">
                        <FaUserShield /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-600 text-sm">
                        <FaUser /> User
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-end space-x-1">
                      <Link to={`/admin/users/${user._id}/edit`}>
                        <button
                          className="p-2 text-purple-600 hover:text-purple-800 cursor-pointer"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
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
