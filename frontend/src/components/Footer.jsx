const Footer = () => {
    return (
      <footer className="bg-gray-100 text-gray-700 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Left Side - Brand */}
          <a href="/" className="text-2xl font-semibold text-violet-500">
            megadie.com
          </a>
  
          {/* Center - Links */}
          <div className="flex space-x-6 text-sm mt-4 md:mt-0">
            <FooterLink href="/about" text="About" />
            <FooterLink href="/contact" text="Contact" />
            <FooterLink href="/privacy" text="Privacy Policy" />
          </div>
  
          {/* Right Side - Copyright */}
          <p className="text-sm mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Megadie.com
          </p>
        </div>
      </footer>
    );
  };
  
  /* ✅ Reusable Footer Link Component */
  const FooterLink = ({ href, text }) => (
    <a href={href} className="hover:text-violet-500 transition">
      {text}
    </a>
  );
  
  export default Footer;
  