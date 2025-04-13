import { Outlet, NavLink } from "react-router-dom";

const AccountDashboard = () => {
  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 min-h-screen mt-18">
      {/* ✅ Sidebar Panel */}
      <aside className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-5 flex flex-col items-start">
        <h3 className="text-xl font-bold text-gray-800 pb-3 border-b w-full">My Account</h3>
        <nav className="w-full mt-4 space-y-2">
          <NavItem to="/account/profile" label="Profile" />
          <NavItem to="/account/orders" label="My Orders" />
          <NavItem to="/account/payments" label="My Payments" /> {/* ✅ Added My Payments */}
        </nav>
      </aside>

      {/* ✅ Main Content */}
      <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

/* ✅ Minimalistic & Reusable NavItem Component */
const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block w-full p-3 rounded-md font-medium transition ${
        isActive ? "bg-purple-500 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    {label}
  </NavLink>
);

export default AccountDashboard;
