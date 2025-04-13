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
      setMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  return (
    <div className="container mx-auto px-6 mt-20 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">My Profile</h1>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading profile...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load profile.</p>
      ) : (
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200"
        >
          {/* ✅ Success/Error Message */}
          {message && (
            <p className={`text-center p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </p>
          )}

          {/* ✅ Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            />
          </div>

          {/* ✅ Email (Disabled) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="text"
              value={userInfo.email}
              disabled
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* ✅ Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            />
          </div>

          {/* ✅ Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-purple-300"
            />
          </div>

          {/* ✅ Update Button */}
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition w-full"
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
