import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../slices/cartSlice";
import { useCreateQuoteMutation } from "../slices/quotesApiSlice";
import { IoClose } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import QuantityControl from "../components/QuantityControl";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [note, setNote] = useState("");
  const [createQuote, { isLoading }] = useCreateQuoteMutation();

  const hasInvalidMOQ = cart.cartItems.some(
    (item) => item.quantity < (item.moq || 1)
  );

  const handleQuantityChange = (_id, newQuantity) => {
    dispatch(updateQuantity({ _id, quantity: newQuantity }));
  };

  const handleSubmitQuote = async () => {
    if (!userInfo) {
      toast.info("You must login first");
      setTimeout(() => {
        navigate("/login?redirect=/cart");
      }, 1500);
      return;
    }

    try {
      const requestedItems = cart.cartItems.map((item) => ({
        product: item._id,
        qty: item.quantity,
        unitPrice: item.price,
      }));

      await createQuote({
        requestedItems,
        clientToAdminNote: note.trim() || undefined,
        totalPrice: 0,
      }).unwrap();

      dispatch(clearCart());
      toast.success("Your Request Submitted!");
      navigate("/account/requests");
    } catch (error) {
      console.error("❌ Failed to request quote:", error);
      toast.error("Failed to submit quote.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-purple-500">
        <FaShoppingCart className="text-purple-500" />
        Cart
      </h1>

      {cart.cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl shadow-sm border border-gray-300">
          <FaShoppingCart size={40} className="text-purple-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            to="/shop"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded font-medium transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-400">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-300 gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-gray-400 p-2 hover:text-red-500 cursor-pointer"
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    <IoClose size={20} />
                  </button>

                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "https://picsum.photos/60?random=1"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
                      }}
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.displaySpecs && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {item.displaySpecs}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <QuantityControl
                    quantity={item.quantity}
                    setQuantity={(val) => handleQuantityChange(item._id, val)}
                  />
                  <p
                    className={`text-xs transition-all ${
                      item.quantity < (item.moq || 1)
                        ? "text-red-600"
                        : "text-transparent"
                    }`}
                    style={{ minHeight: "1rem" }}
                  >
                    {item.quantity < (item.moq || 1)
                      ? `Minimum is ${item.moq || 1}`
                      : " "}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note Field */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Note? (optional)
            </label>
            <textarea
              rows="4"
              placeholder="You can write any special requests or notes here..."
              className="w-full border border-gray-300 rounded p-3 text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="cursor-pointer inline-block text-sm font-medium bg-gray-50 border border-gray-300 px-6 py-3 text-gray-500 hover:text-red-500 hover:border-red-300 transition rounded"
            >
              Clear Cart
            </button>
            <button
              onClick={handleSubmitQuote}
              disabled={isLoading || hasInvalidMOQ}
              className={`cursor-pointer font-semibold px-6 py-3 rounded-md text-md flex items-center justify-center gap-2 transition 
                ${isLoading || hasInvalidMOQ
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {isLoading ? "Submitting..." : "Request Items"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
