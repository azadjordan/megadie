import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaStore } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
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

  // ✅ Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-purple-500 hover:text-purple-600 transition">
          Megadie.com
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks userInfo={userInfo} totalQuantity={totalQuantity} onLogout={logoutHandler} />
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
          <NavLinks 
            userInfo={userInfo} 
            totalQuantity={totalQuantity} 
            onLogout={logoutHandler} 
            mobile 
            onClick={() => setMenuOpen(false)} // ✅ Closes menu when clicking a link
          />
        </div>
      </div>
    </header>
  );
};

const NavLinks = ({ mobile, onClick, userInfo, totalQuantity, onLogout }) => (
  <div className={`flex ${mobile ? "flex-col space-y-6" : "space-x-6"}`}>
    <NavItem to="/shop" icon={<FaStore size={20} />} text="Shop" onClick={onClick} />
    <NavItem 
      to="/cart" 
      icon={<FaShoppingCart size={20} />} 
      text={`Cart${totalQuantity > 0 ? ` (${totalQuantity})` : ""}`} 
      onClick={onClick} 
    />
    
    {userInfo?.isAdmin && (
      <>
        <NavItem to="/admin/orders" text="Orders" onClick={onClick} />
        <NavItem to="/admin/products" text="Products" onClick={onClick} />
        <NavItem to="/admin/users" text="Users" onClick={onClick} />
      </>
    )}

    {userInfo ? (
      <>
        <span className="text-gray-700 font-medium">{userInfo.name}</span>
        <NavItem to="/account/profile" icon={<FaUser size={20} />} text="Account" onClick={onClick} />
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium cursor-pointer"
        >
          <FaSignOutAlt size={20} />
          Logout
        </button>
      </>
    ) : (
      <NavItem to="/login" icon={<FaUser size={20} />} text="Sign In" onClick={onClick} />
    )}
  </div>
);

const NavItem = ({ to, icon, text, onClick }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) =>
      `flex items-center gap-2 font-medium cursor-pointer transition px-4 py-3 
      ${isActive ? "text-purple-600 font-bold" : "text-gray-700 hover:text-purple-500"}`
    }
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </NavLink>
);

export default Header;
