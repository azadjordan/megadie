import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/users/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <header className="bg-white shadow-xs">
      <nav className="container mx-auto flex justify-between items-center py-10 px-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-purple-800 cursor-pointer">
          Megadie.com
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks userInfo={userInfo} totalQuantity={totalQuantity} onLogout={logoutHandler} />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600 cursor-pointer text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white p-4">
          <NavLinks userInfo={userInfo} totalQuantity={totalQuantity} onLogout={logoutHandler} mobile onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ mobile, onClick, userInfo, totalQuantity, onLogout }) => (
  <div className={`flex flex-col md:flex-row ${mobile ? "space-y-4" : "space-x-6"}`}>
    {/* Cart Link */}
    <NavItem to="/cart" icon={<FaShoppingCart size={22} />} text={`Cart (${totalQuantity})`} onClick={onClick} />

    {/* Admin Links - Only visible to admins */}
    {userInfo?.isAdmin && (
      <>
        <NavItem to="/admin/orders" text="Orders" onClick={onClick} />
        <NavItem to="/admin/products" text="Products" onClick={onClick} />
        <NavItem to="/admin/users" text="Users" onClick={onClick} />
      </>
    )}

    {/* If user is logged in, show name, profile & logout */}
    {userInfo ? (
      <>
        <span className="text-gray-700 font-medium">{userInfo.name}</span>
        <NavItem to="/account/profile" icon={<FaUser size={22} />} text="Account" onClick={onClick} />
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium cursor-pointer">
          <FaSignOutAlt size={22} />
          Logout
        </button>
      </>
    ) : (
      <NavItem to="/login" icon={<FaUser size={22} />} text="Sign In" onClick={onClick} />
    )}
  </div>
);

const NavItem = ({ to, icon, text, onClick }) => (
  <Link to={to} className="flex items-center gap-2 text-gray-600 hover:text-violet-500 transition font-medium cursor-pointer" onClick={onClick}>
    {icon}
    <span>{text}</span>
  </Link>
);

export default Header;
