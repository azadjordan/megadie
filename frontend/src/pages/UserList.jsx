import { useGetUsersQuery } from "../slices/usersApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaUserShield, FaUser } from "react-icons/fa";

const UserList = () => {
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">All Users</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching users.</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phoneNumber}</td>
                  <td className="px-4 py-2">{user.address}</td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaUserShield className="text-green-600" title="Admin" />
                    ) : (
                      <FaUser className="text-gray-500" title="User" />
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`/admin/users/${user._id}/edit`}>
                      <button className="text-purple-600 hover:text-purple-800" title="Edit">
                        <FaEdit />
                      </button>
                    </Link>
                    <button className="text-red-600 hover:text-red-800" title="Delete">
                      <FaTrash />
                    </button>
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
