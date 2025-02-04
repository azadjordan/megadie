import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { cartItems: [], totalQuantity: 0, totalPrice: 0 };
};

const saveCartToStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload; // Store the whole product object
      const existingItem = state.cartItems.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.cartItems.push({ ...product }); // Store the entire product
      }

      state.totalQuantity += product.quantity;
      state.totalPrice += product.price * product.quantity;

      saveCartToStorage(state); // Save to localStorage
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === productId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.cartItems = state.cartItems.filter((item) => item._id !== productId);
      }

      saveCartToStorage(state); // Save to localStorage
    },

    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (existingItem && quantity > 0) {
        state.totalQuantity += quantity - existingItem.quantity;
        state.totalPrice += (quantity - existingItem.quantity) * existingItem.price;
        existingItem.quantity = quantity;
      }

      saveCartToStorage(state); // Save to localStorage
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartToStorage(state); // Save to localStorage
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;