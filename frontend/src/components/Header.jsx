import { useRef, useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaStore } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bounce, setBounce] = useState(false); // 🔥 State to track animation trigger

  // Detect quantity change and trigger animation
  useEffect(() => {
    if (totalQuantity > 0) {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }
  }, [totalQuantity]);

  // Logout handler
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

  return (
    <>
      {/* ✅ Fixed Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="text-3xl font-extrabold text-purple-500 hover:text-purple-600 transition">
            Megadie.com
          </Link>

          {/* ✅ Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks userInfo={userInfo} totalQuantity={totalQuantity} bounce={bounce} onLogout={logoutHandler} />
          </div>

          {/* ✅ Mobile Menu Button */}
          <button className="md:hidden text-gray-600 text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </nav>

        {/* ✅ Mobile Sidebar Menu */}
        {menuOpen && (
          <div className="md:hidden fixed top-0 right-0 w-2/3 h-full bg-white shadow-lg transition-transform duration-300">
            <button className="cursor-pointer absolute top-4 right-4 text-gray-600 text-3xl hover:text-red-500" onClick={() => setMenuOpen(false)}>
              <FaTimes size={28} />
            </button>
            <div className="p-8 space-y-6">
              <NavLinks userInfo={userInfo} totalQuantity={totalQuantity} bounce={bounce} onLogout={logoutHandler} mobile onClick={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

    </>
  );
};

// ✅ Navigation Links Component (With Active Styling)
const NavLinks = ({ mobile, onClick, userInfo, totalQuantity, bounce, onLogout }) => {
  const firstName = userInfo?.name?.split(" ")[0] || "Account";

  return (
    <div className={`flex ${mobile ? "flex-col space-y-6" : "space-x-9"}`}>
      <NavLink to="/shop" className={navLinkClass} onClick={onClick}>
        <FaStore size={24} /> Shop
      </NavLink>

      {/* ✅ Cart with Badge & Conditional Bounce Animation */}
      <NavLink to="/cart" className={navLinkClass} onClick={onClick} style={{ position: "relative" }}>
        <div className="relative flex items-center">
          <FaShoppingCart size={24} />
          {totalQuantity > 0 && (
            <span
              key={totalQuantity} // 🔥 Ensures re-render on update
              className={`absolute -top-2.5 -right-2.5 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full 
              transition-transform transform scale-100 ${bounce ? "animate-bounce" : ""}`}
            >
              {totalQuantity}
            </span>
          )}
        </div>
        <span>Cart</span>
      </NavLink>

      {userInfo ? (
        <>
          <NavLink to="/account" className={navLinkClass} onClick={onClick}>
            <FaUser size={22} /> {firstName}
          </NavLink>

          <button onClick={onLogout} className={`${navLinkBase} text-red-300 hover:text-red-600 transition`}>
            <FaSignOutAlt size={22} /> Logout
          </button>
        </>
      ) : (
        <NavLink to="/login" className={navLinkClass} onClick={onClick}>
          <FaUser size={20} /> Sign In
        </NavLink>
      )}
    </div>
  );
};

// ✅ Reusable Navigation Link Styling (Handles Active Pages)
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 font-medium transition relative ${
    isActive ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-500"
  }`;

// ✅ Base class for Logout button (Doesn't need active state)
const navLinkBase = "flex items-center gap-2 font-medium transition cursor-pointer";

export default Header;
