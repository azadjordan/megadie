import { useState } from "react";

const Message = ({ type = "info", children }) => {
  const [visible, setVisible] = useState(true);

  const colors = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    error: "bg-red-100 text-red-800 border-red-300",
  };

  if (!visible) return null; // Hide message when dismissed

  return (
    <div className={`p-4 border-l-4 ${colors[type]} rounded-md flex justify-between items-center transition-opacity duration-300`}>
      <span>{children}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-gray-600 hover:text-gray-900 transition"
      >
        ✕
      </button>
    </div>
  );
};

export default Message;
