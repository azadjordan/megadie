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
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const source = profile || userInfo; 
    if (source) {
      setName(source.name || "");
      setEmail(source.email || "");
      setPhoneNumber(source.phoneNumber || "");
      setAddress(source.address || "");
    }
  }, [profile, userInfo]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(null);
  
    try {
      await updateUserProfile({ name, phoneNumber, address }).unwrap();
      dispatch(setCredentials({ ...userInfo, name, phoneNumber, address })); // Only update state after success
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md mt-12">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      {isLoading && <p className="text-gray-500">Loading profile...</p>}
      {isError && <p className="text-red-500">Failed to load profile.</p>}

      {message && (
        <div className={`p-2 text-center mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {!isLoading && !isError && (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="text" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" value={email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="text" className="w-full p-2 border rounded" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" className="w-full p-2 border rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <button type="submit" className={`w-full bg-blue-500 text-white p-2 rounded mt-4 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
