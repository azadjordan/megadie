import { useGetUserProfileQuery } from "../../slices/usersApiSlice";
import Message from "../../components/Message";

const UserProfile = () => {
  const { data: user, isLoading, error } = useGetUserProfileQuery();

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-700 mb-6">My Profile</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : error ? (
        <Message type="error">Failed to load profile.</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md">
          <InfoField label="Full Name" value={user.name} />
          <InfoField label="Email" value={user.email} />
          <InfoField label="Phone Number" value={user.phoneNumber || "Not provided"} />
          <InfoField label="Address" value={user.address || "Not provided"} />
          <InfoField
            label="Wallet Balance"
            value={`${user.wallet?.toFixed(2)} AED`}
            valueClass="text-green-600 font-semibold"
          />
          <InfoField
            label="Outstanding Balance"
            value={`${user.outstandingBalance?.toFixed(2)} AED`}
            valueClass="text-red-600 font-semibold"
          />
        </div>
      )}
    </div>
  );
};

const InfoField = ({ label, value, valueClass = "text-gray-800" }) => (
  <div>
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <p className={`text-sm ${valueClass}`}>{value}</p>
  </div>
);

export default UserProfile;
