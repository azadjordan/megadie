import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading, error }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.phoneNumber) validationErrors.phoneNumber = "Phone number is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.password) validationErrors.password = "Password is required.";
    if (!formData.confirmPassword) validationErrors.confirmPassword = "Confirm password is required.";
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
      navigate("/");
    } catch (err) {
      setErrors({ apiError: err?.data?.message || "Registration failed." });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12 bg-white shadow-md rounded-lg mt-[100px]">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>

      {errors.apiError && <p className="text-red-500 text-center mb-4">{errors.apiError}</p>}

      <form onSubmit={submitHandler} className="space-y-4">
        {["name", "phoneNumber", "email", "password", "confirmPassword"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={`Enter your ${field}`}
              className={`w-full p-3 border rounded-md focus:ring focus:ring-purple-200 ${
                errors[field] ? "border-red-500 ring-red-200" : "border-gray-300"
              }`}
              value={formData[field]}
              onChange={handleChange}
            />
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-purple-500 text-white font-bold py-3 rounded-md hover:bg-purple-600 transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
