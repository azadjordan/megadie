import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart
    ? JSON.parse(storedCart)
    : { cartItems: [], totalQuantity: 0, totalPrice: 0 };
};

const saveCartToStorage = ({ cartItems, totalQuantity, totalPrice }) => {
  localStorage.setItem("cart", JSON.stringify({ cartItems, totalQuantity, totalPrice }));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      if (!product || !product._id || !product.price || product.quantity <= 0) return;

      const existingItem = state.cartItems.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.cartItems.push({ ...product });
      }

      state.totalQuantity += product.quantity;
      state.totalPrice += product.price * product.quantity;

      saveCartToStorage(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === productId);

      if (!existingItem) return;

      state.totalQuantity -= existingItem.quantity;
      state.totalPrice -= existingItem.price * existingItem.quantity;
      state.cartItems = state.cartItems.filter((item) => item._id !== productId);

      saveCartToStorage(state);
    },

    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (!existingItem || quantity <= 0) return;

      state.totalQuantity += quantity - existingItem.quantity;
      state.totalPrice += (quantity - existingItem.quantity) * existingItem.price;
      existingItem.quantity = quantity;

      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
