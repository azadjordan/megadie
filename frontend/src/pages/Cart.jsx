import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../slices/cartSlice";
import { useCreateQuoteMutation } from "../slices/quotesApiSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [note, setNote] = useState("");
  const [createQuote, { isLoading }] = useCreateQuoteMutation();

  const handleQuantityChange = (_id, value) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      dispatch(updateQuantity({ _id, quantity }));
    }
  };

  const handleSubmitQuote = async () => {
    try {
      const requestedItems = cart.cartItems.map((item) => ({
        product: item._id,
        qty: item.quantity,
        unitPrice: item.price,
      }));

      await createQuote({
        requestedItems,
        clientToAdminNote: note,
        totalPrice: 0,
      }).unwrap();

      dispatch(clearCart());
      navigate("/quotes/quote-success");
    } catch (error) {
      console.error("❌ Failed to request quote:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-purple-700">Your Cart</h1>

      {cart.cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <>
          {/* 🧾 One Unified Section */}
          <div className="border rounded-xl p-6 bg-white space-y-6">
            {cart.cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4"
              >
                {/* ❌ Remove */}
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <IoClose size={20} />
                </button>

                {/* Image + Name */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.image || "https://picsum.photos/60?random=1"}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ _id: item._id, quantity: item.quantity - 1 }))
                    }
                    className="p-1 text-gray-600 hover:text-purple-600"
                  >
                    <FaMinus size={12} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    className="w-10 text-center text-sm border rounded px-1 py-0.5"
                  />
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))
                    }
                    className="p-1 text-gray-600 hover:text-purple-600"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Note Field */}
            <div className="mt-10">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Add Note (optional)
              </label>
              <textarea
                rows="4"
                placeholder="Anything you'd like to add..."
                className="w-full border rounded p-3 text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* 🔘 Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-md"
            >
              Clear Cart
            </button>
            <button
              onClick={handleSubmitQuote}
              disabled={isLoading}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md text-md"
            >
              {isLoading ? "Submitting..." : "Request Quote"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
