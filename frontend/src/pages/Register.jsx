import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({}); // ✅ Stores field validation errors

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading, error }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // ✅ Check for empty fields
    if (!name) validationErrors.name = "Name is required.";
    if (!phoneNumber) validationErrors.phoneNumber = "Phone number is required.";
    if (!email) validationErrors.email = "Email is required.";
    if (!password) validationErrors.password = "Password is required.";
    if (!confirmPassword) validationErrors.confirmPassword = "Confirm password is required.";

    // ✅ Check if passwords match
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.password = "Passwords do not match.";
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    // ✅ Set errors and prevent submission if there are any
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({}); // ✅ Clear previous validation errors
      const res = await register({ name, phoneNumber, email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      setErrors({ apiError: err?.data?.message || "Registration failed." });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

      {/* ✅ API Error Message */}
      {errors.apiError && <p className="text-red-500 text-sm text-center">{errors.apiError}</p>}

      <form onSubmit={submitHandler} className="space-y-4">
        {/* ✅ Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className={`w-full p-2 border rounded-md cursor-text focus:outline-none focus:ring ${
              errors.name ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-purple-200"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* ✅ Phone Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className={`w-full p-2 border rounded-md cursor-text focus:outline-none focus:ring ${
              errors.phoneNumber ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-purple-200"
            }`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
        </div>

        {/* ✅ Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full p-2 border rounded-md cursor-text focus:outline-none focus:ring ${
              errors.email ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-purple-200"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* ✅ Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full p-2 border rounded-md cursor-text focus:outline-none focus:ring ${
              errors.password ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-purple-200"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* ✅ Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className={`w-full p-2 border rounded-md cursor-text focus:outline-none focus:ring ${
              errors.confirmPassword ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-purple-200"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-500 text-white font-bold py-3 mt-4 rounded-md hover:bg-purple-600 transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
