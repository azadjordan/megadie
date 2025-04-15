import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../slices/cartSlice";
import { useCreateQuoteMutation } from "../slices/quotesApiSlice";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createQuote, { isLoading }] = useCreateQuoteMutation();

  const handleQuantityChange = (_id, value) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      dispatch(updateQuantity({ _id, quantity }));
    }
  };

  const handleSubmitQuote = async () => {
    try {
      await createQuote({
        requestedItems: cart.cartItems.map((item) => ({
          product: item._id,
          qty: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      }).unwrap();

      dispatch(clearCart());
      navigate("/quotes/quote-success");
    } catch (error) {
      console.error("Failed to request quote:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-purple-700 mb-6">Your Quote Cart</h2>

      {cart.cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full text-sm border rounded mb-6">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.cartItems.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 flex items-center gap-2">
                    <button onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity - 1 }))}>
                      <FaMinus className="text-gray-600 hover:text-purple-600" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      className="w-16 text-center border rounded px-2 py-1"
                      min="1"
                    />
                    <button onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))}>
                      <FaPlus className="text-gray-600 hover:text-purple-600" />
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center">
            <button
              onClick={() => dispatch(clearCart())}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Clear Cart
            </button>

            <button
              onClick={handleSubmitQuote}
              disabled={isLoading}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
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
