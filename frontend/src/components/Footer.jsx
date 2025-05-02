import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 space-y-4 md:space-y-0">
        {/* Left Side - Brand */}
        <Link to="/" className="text-2xl font-semibold text-purple-500 hover:text-purple-600 transition">
          Megadie.com
        </Link>

        {/* Center - Links */}
        <div className="flex space-x-6 text-sm">
          <FooterLink href="/about" text="About" />
          <FooterLink href="/contact" text="Contact" />
          <FooterLink href="/privacy-policy" text="Privacy Policy" />
          <FooterLink href="/terms" text="Terms & Conditions" />
        </div>

        {/* Right Side - Copyright */}
        <p className="text-sm">&copy; {new Date().getFullYear()} Megadie.com</p>
      </div>
    </footer>
  );
};

/* ✅ Reusable Footer Link Component */
const FooterLink = ({ href, text }) => (
  <Link to={href} className="hover:text-purple-500 transition">
    {text}
  </Link>
);

export default Footer;
