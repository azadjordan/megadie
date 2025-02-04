import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      console.error("Login Failed:", err?.data?.message || err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

      {error && <p className="text-red-500 text-sm text-center">{error?.data?.message || "Login failed"}</p>}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded-md cursor-text focus:outline-none focus:ring focus:ring-purple-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border border-gray-300 rounded-md cursor-text focus:outline-none focus:ring focus:ring-purple-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white font-bold py-3 mt-4 rounded-md hover:bg-purple-600 transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Not Registered?{" "}
        <Link to="/register" className="text-blue-600 hover:underline cursor-pointer">
          Register Now!
        </Link>
      </p>
    </div>
  );
};

export default Login;
