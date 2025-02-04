import { Outlet, NavLink } from "react-router-dom";

const AccountDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto flex bg-white shadow-md rounded-md mt-12">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-100 p-6 rounded-l-md">
        <h3 className="text-lg font-semibold mb-4">My Account</h3>
        <nav className="space-y-2">
          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              `block p-3 rounded-md text-gray-700 hover:bg-gray-300 ${
                isActive ? "bg-gray-400 font-semibold" : ""
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `block p-3 rounded-md text-gray-700 hover:bg-gray-300 ${
                isActive ? "bg-gray-400 font-semibold" : ""
              }`
            }
          >
            My Orders
          </NavLink>
        </nav>
      </aside>

      {/* Right Content (Profile or Orders) */}
      <div className="flex-grow p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountDashboard;
