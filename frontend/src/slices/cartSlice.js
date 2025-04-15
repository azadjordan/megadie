import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart
      ? JSON.parse(storedCart)
      : { cartItems: [], totalQuantity: 0, totalPrice: 0 };
  } catch {
    return { cartItems: [], totalQuantity: 0, totalPrice: 0 };
  }
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
      if (!product || !product._id || product.quantity <= 0) return;

      const existing = state.cartItems.find((item) => item._id === product._id);
      if (existing) {
        existing.quantity += product.quantity;
      } else {
        state.cartItems.push({ ...product });
      }

      state.totalQuantity += product.quantity;
      state.totalPrice += product.price * product.quantity;

      saveCartToStorage(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find((i) => i._id === productId);
      if (!item) return;

      state.totalQuantity -= item.quantity;
      state.totalPrice -= item.price * item.quantity;
      state.cartItems = state.cartItems.filter((i) => i._id !== productId);

      saveCartToStorage(state);
    },

    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i._id === _id);
      if (!item || quantity <= 0) return;

      state.totalQuantity += quantity - item.quantity;
      state.totalPrice += (quantity - item.quantity) * item.price;
      item.quantity = quantity;

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

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
