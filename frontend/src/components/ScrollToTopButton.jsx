import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      setScrollProgress(progress);
      setShowButton(scrollTop > 200); // Show button when slightly scrolled
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showButton && (
        <button
          onClick={scrollToTop}
          className="cursor-pointer relative flex items-center justify-center w-12 h-12 rounded-full bg-purple-200 shadow-lg transition-all hover:bg-purple-500"
        >
          {/* SVG Progress Circle */}
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >

            <circle
              className="text-purple-500 hover:bg-purple-500"
              strokeWidth="2"
              stroke="currentColor"
              fill="transparent"
              r="16"
              cx="18"
              cy="18"
              strokeDasharray="100"
              strokeDashoffset={100 - scrollProgress} // Progress effect
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
          </svg>

          {/* Up Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5V19M5 12L12 5L19 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
