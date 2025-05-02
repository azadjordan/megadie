import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  // Optional: handle redirect if needed
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.phoneNumber)
      validationErrors.phoneNumber = "Phone number is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.password) validationErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      validationErrors.confirmPassword = "Confirm password is required.";
    if (formData.password !== formData.confirmPassword) {
      validationErrors.password = "Passwords do not match.";
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      const res = await register(formData).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (err) {
      setErrors({ apiError: err?.data?.message || "Registration failed." });
    }
  };

  return (
    <div className="flex justify-center mt-10 bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 text-center mb-6">
          Create Account
        </h2>

        {errors.apiError && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-2 rounded mb-4">
            {errors.apiError}
          </p>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          {["name", "phoneNumber", "email", "password", "confirmPassword"].map(
            (field, index) => {
              // Check matching logic
              const passwordsMatch =
                formData.password === formData.confirmPassword &&
                formData.password.length > 0;

              let borderColorClass = "border-gray-300 focus:ring-purple-300";

              if (field === "password" || field === "confirmPassword") {
                if (formData[field].length > 0) {
                  borderColorClass = passwordsMatch
                    ? "border-green-500 focus:ring-green-300"
                    : "border-red-500 ring-red-200";
                }
              }

              if (errors[field]) {
                borderColorClass = "border-red-500 ring-red-200";
              }

              return (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={
                      field === "password" || field === "confirmPassword"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    name={field}
                    placeholder={`Enter your ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-md text-sm border focus:outline-none transition focus:ring-2 ${borderColorClass}`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              );
            }
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold text-white rounded-md transition ${
              isLoading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 cursor-pointer"
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${redirect}`}
            className="text-purple-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
