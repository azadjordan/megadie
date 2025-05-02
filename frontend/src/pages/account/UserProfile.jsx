import { useGetUserProfileQuery } from "../../slices/usersApiSlice";
import Message from "../../components/Message";

const UserProfile = () => {
  const { data: user, isLoading, error } = useGetUserProfileQuery();

  return (
    <div className="p-6 w-full">
      {isLoading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : error ? (
        <Message type="error">Failed to load profile.</Message>
      ) : (
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 p-6">
            <InfoField label="Full Name" value={user.name} />
            <InfoField label="Email" value={user.email} />
            <InfoField label="Phone Number" value={user.phoneNumber || "Not provided"} />
            <InfoField label="Address" value={user.address || "Not provided"} />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);

export default UserProfile;
