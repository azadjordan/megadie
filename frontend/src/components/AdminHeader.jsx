import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo?.isAdmin) return null; // ✅ Only show if admin is logged in

  return (
    <div className="bg-purple-900 text-white shadow-md fixed top-[65px] w-full z-40">
      <nav className="container mx-auto flex justify-between items-center px-6">
        <h3 className="text-lg font-semibold text-purple-400">
          Hi, {userInfo.name || "Admin"}! 👋
        </h3>
        <div className="flex space-x-4">
          <NavLink
            to="/admin/orders"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition"
          >
            Orders
          </NavLink>
          <NavLink
            to="/admin/products"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition"
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/users"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition"
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/payments"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition"
          >
            Payments
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default AdminHeader;
