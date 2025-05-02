import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await axios.post(`${"http://localhost:5000"}/api/contact`, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", phone: "", message: "" });
      navigate("/");
    } catch (err) {
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-6 sm:px-10 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-purple-500 mb-10 text-center">Contact Us</h1>

      {/* ✨ Contact Info */}
      <div className="mb-10 text-gray-700 text-center space-y-4">
        <p>You can always reach out to us via WhatsApp:</p>

        {/* Numbers on the same line */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-purple-600 font-semibold">
          <a
            href="https://wa.me/971549922295"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            +971549922295
          </a>
          <span className="text-gray-500">or</span>
          <a
            href="https://wa.me/971545050244"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            +971545050244
          </a>
        </div>

        <p>Or you can email us your message using the form below:</p>
      </div>

      {/* ✨ Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-xl">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
            placeholder="Tell us how we can help you..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="cursor-pointer w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition"
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
