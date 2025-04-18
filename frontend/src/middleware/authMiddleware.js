import { setCredentials, logout } from "../slices/authSlice";

let sessionChecked = false; // ✅ Prevent repeated API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Get backend URL dynamically

const authMiddleware = (store) => (next) => async (action) => {
  const { userInfo } = store.getState().auth;

  if (userInfo && !sessionChecked) {
    sessionChecked = true; // ✅ Mark session as checked to prevent infinite calls
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/account/profile`, {
        method: "GET",
        credentials: "include", // ✅ Ensure JWT cookie is sent
      });

      if (!res.ok) {
        throw new Error("Session expired");
      }

      const data = await res.json();
      store.dispatch(setCredentials(data)); // ✅ Store user in Redux
    } catch (error) {
      sessionChecked = false; // ✅ Reset session check flag on failure
      store.dispatch(logout()); // ✅ Clear Redux state if session is invalid
    }
  }

  return next(action);
};

export default authMiddleware;
