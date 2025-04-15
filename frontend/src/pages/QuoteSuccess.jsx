import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const QuoteSuccess = () => {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <div className="text-green-600 text-5xl mb-4 flex justify-center">
        <FaCheckCircle />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Quote Request Sent!</h1>
      <p className="text-gray-600 mb-6">
        Your quotation request has been submitted successfully. Our team will review it and get back to you soon.
      </p>
      <Link
        to="/shop"
        className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition text-sm"
      >
        Continue Browsing
      </Link>
    </div>
  );
};

export default QuoteSuccess;
