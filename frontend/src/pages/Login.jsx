import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  // Get redirect path from query string, fallback to "/"
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

    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.password) validationErrors.password = "Password is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      const res = await login(formData).unwrap();
      dispatch(setCredentials(res));
      // Redirect will happen automatically via useEffect
    } catch (err) {
      setErrors({ apiError: err?.data?.message || "Login failed." });
    }
  };

  return (
    <div className="flex justify-center mt-10 bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 text-center mb-6">
          Sign In
        </h2>

        {errors.apiError && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-2 rounded mb-4">
            {errors.apiError}
          </p>
        )}

        {/* Optional Info Banner */}
        {redirect === "/cart" && (
          <div className="text-sm text-center text-purple-700 bg-purple-50 border border-purple-200 p-3 rounded mb-4">
            Please login to continue with your quote request.
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          {["email", "password"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field}
              </label>
              <input
                type={field === "password" ? "password" : "email"}
                name={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full p-3 rounded-md text-sm border focus:outline-none transition focus:ring-2 ${
                  errors[field]
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:ring-purple-300"
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold text-white rounded-md transition ${
              isLoading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 cursor-pointer"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to={`/register?redirect=${redirect}`}
            className="text-purple-500 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
