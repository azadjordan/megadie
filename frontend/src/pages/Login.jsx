import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();

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
      navigate("/");
    } catch (err) {
      setErrors({ apiError: err?.data?.message || "Login failed." });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12 bg-white shadow-md rounded-lg mt-[100px]">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>

      {errors.apiError && <p className="text-red-500 text-center mb-4">{errors.apiError}</p>}

      <form onSubmit={submitHandler} className="space-y-4">
        {["email", "password"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
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
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Not registered?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register Now
        </Link>
      </p>
    </div>
  );
};

export default Login;
