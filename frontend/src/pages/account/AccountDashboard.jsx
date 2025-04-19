import { NavLink, Outlet } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const navItems = [
  { label: "Profile", path: "profile", icon: <FaUser /> },
  { label: "Requests", path: "requests", icon: <FaClipboardList /> },
  { label: "Orders", path: "orders", icon: <FaShoppingCart /> },
  { label: "Invoices", path: "invoices", icon: <FaFileInvoiceDollar /> },
  { label: "Payments", path: "payments/my", icon: <FaMoneyCheckAlt /> },
];

const AccountDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-10">my Account</h2>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile notice */}
      <div className="md:hidden w-full text-center p-4 text-sm text-gray-500">
        📱 Sidebar available on desktop
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 bg-white rounded-tl-2xl shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountDashboard;
