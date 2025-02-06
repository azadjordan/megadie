import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useUpdateUserProfileMutation, useGetUserProfileQuery } from "../slices/usersApiSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: profile, isLoading, isError } = useGetUserProfileQuery(undefined, { skip: !!userInfo });
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const source = profile || userInfo;
    if (source) {
      setName(source.name || "");
      setPhoneNumber(source.phoneNumber || "");
      setAddress(source.address || "");
    }
  }, [profile, userInfo]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await updateUserProfile({ name, phoneNumber, address }).unwrap();
      dispatch(setCredentials({ ...userInfo, name, phoneNumber, address }));
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 pt-[80px]">
      <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>

      {isLoading && <p className="text-gray-500 text-center">Loading profile...</p>}
      {isError && <p className="text-red-500 text-center">Failed to load profile.</p>}

      {message && (
        <div className={`p-3 text-center rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {!isLoading && !isError && (
        <form onSubmit={handleUpdateProfile} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email (Disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
              value={userInfo.email}
              disabled
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className={`w-full bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
