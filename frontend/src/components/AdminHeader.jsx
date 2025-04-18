import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo?.isAdmin) return null; // ✅ Only show if admin is logged in

  return (
<div className="sticky top-[68px] z-40 bg-purple-900 text-white shadow-md py-2 w-full">
<div className="overflow-x-auto">

<nav className="container mx-auto flex justify-center md:justify-between items-center px-6">

        <h3 className="text-lg font-semibold text-purple-400 hidden lg:block">
          Hi, {userInfo.name || "Admin"}! 👋
        </h3>
        <div className="flex flex-wrap justify-center">
        <NavLink
            to="/admin/quotes"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Quotes/Requests
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/admin/invoices"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Invoices
          </NavLink>
          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Payments
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `px-4 py-1 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-purple-600 text-white" : "hover:bg-purple-500"
              }`
            }
          >
            Categories
          </NavLink>
        </div>
      </nav>
      </div>

    </div>
  );
};

export default AdminHeader;
