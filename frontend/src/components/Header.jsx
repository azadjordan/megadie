import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaStore, FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef(null);
  const accountRef = useRef(null);

  const { totalQuantity } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      dispatch(logout());
      dispatch(clearCart());
      navigate("/");
    });
  };

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-purple-500 hover:text-purple-600 transition">
          Megadie.com
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavItem to="/shop" icon={<FaStore size={20} />} text="Shop" />
          
          {/* ✅ Cart Icon with Badge */}
          <div className="relative">
            <NavItem to="/cart" icon={<FaShoppingCart size={20} />} text="Cart" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalQuantity}
              </span>
            )}
          </div>

          {/* ✅ Account Dropdown */}
          {userInfo && (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 font-medium cursor-pointer transition text-gray-700 hover:text-purple-500 px-4 py-3"
              >
                <FaUser size={20} />
                Account
                <FaChevronDown size={14} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2">
                  <DropdownItem to="/account/profile" text="Profile" />
                  <DropdownItem to="/account/orders" text="My Orders" />
                  {userInfo.isAdmin && (
                    <>
                      <DropdownItem to="/admin/orders" text="Admin Orders" />
                      <DropdownItem to="/admin/products" text="Manage Products" />
                      <DropdownItem to="/admin/users" text="Manage Users" />
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ Logout Button */}
          {userInfo && (
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium cursor-pointer"
            >
              <FaSignOutAlt size={20} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600 text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 w-2/3 h-full bg-white shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="absolute top-4 right-4 text-gray-600 text-3xl" onClick={() => setMenuOpen(false)}>
          <FaTimes size={28} />
        </button>
        <div className="p-8 space-y-6">
          <NavItem to="/shop" icon={<FaStore size={20} />} text="Shop" onClick={() => setMenuOpen(false)} />
          
          {/* ✅ Cart Icon with Badge (Mobile) */}
          <div className="relative">
            <NavItem to="/cart" icon={<FaShoppingCart size={20} />} text="Cart" onClick={() => setMenuOpen(false)} />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalQuantity}
              </span>
            )}
          </div>

          {/* ✅ Account Dropdown (Mobile) */}
          {userInfo && (
            <div>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 font-medium cursor-pointer transition text-gray-700 hover:text-purple-500 px-4 py-3 w-full text-left"
              >
                <FaUser size={20} />
                Account
                <FaChevronDown size={14} />
              </button>
              {accountOpen && (
                <div className="pl-6 space-y-3">
                  <DropdownItem to="/account/profile" text="Profile" onClick={() => setMenuOpen(false)} />
                  <DropdownItem to="/account/orders" text="My Orders" onClick={() => setMenuOpen(false)} />
                  {userInfo.isAdmin && (
                    <>
                      <DropdownItem to="/admin/orders" text="Admin Orders" onClick={() => setMenuOpen(false)} />
                      <DropdownItem to="/admin/products" text="Manage Products" onClick={() => setMenuOpen(false)} />
                      <DropdownItem to="/admin/users" text="Manage Users" onClick={() => setMenuOpen(false)} />
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ Logout Button (Mobile) */}
          {userInfo && (
            <button
              onClick={() => {
                logoutHandler();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium cursor-pointer"
            >
              <FaSignOutAlt size={20} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

/** ✅ Navigation Link Component */
const NavItem = ({ to, icon, text, onClick }) => (
  <NavLink 
    to={to} 
    className="flex items-center gap-2 font-medium cursor-pointer transition text-gray-700 hover:text-purple-500 px-4 py-3"
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </NavLink>
);

/** ✅ Dropdown Item Component */
const DropdownItem = ({ to, text, onClick }) => (
  <NavLink to={to} onClick={onClick} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
    {text}
  </NavLink>
);

export default Header;
