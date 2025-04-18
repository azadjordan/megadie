import { useGetUserProfileQuery } from "../../slices/usersApiSlice";
import Message from "../../components/Message";

const UserProfile = () => {
  const { data: user, isLoading, error } = useGetUserProfileQuery();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-purple-700 mb-6">My Profile</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : error ? (
        <Message type="error">Failed to load profile.</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm bg-white p-6 rounded shadow">
          <div>
            <p className="text-gray-500 font-medium mb-1">Full Name</p>
            <p className="text-gray-800">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium mb-1">Email</p>
            <p className="text-gray-800">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium mb-1">Phone Number</p>
            <p className="text-gray-800">{user.phoneNumber || "Not provided"}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium mb-1">Address</p>
            <p className="text-gray-800">{user.address || "Not provided"}</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium mb-1">Wallet Balance</p>
            <p className="text-green-600 font-semibold">{user.wallet?.toFixed(2)} AED</p>
          </div>

          <div>
            <p className="text-gray-500 font-medium mb-1">Outstanding Balance</p>
            <p className="text-red-600 font-semibold">{user.outstandingBalance?.toFixed(2)} AED</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
