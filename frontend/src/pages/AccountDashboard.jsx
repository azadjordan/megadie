import { Outlet, NavLink } from "react-router-dom";

const AccountDashboard = () => {
  return (
    <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 mt-8">
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md md:sticky md:top-20">
        <h3 className="text-xl font-bold mb-4">My Account</h3>
        <nav className="space-y-3">
          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              `block p-3 rounded-lg font-medium transition ${
                isActive ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `block p-3 rounded-lg font-medium transition ${
                isActive ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            My Orders
          </NavLink>
        </nav>
      </aside>
      <div className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountDashboard;
