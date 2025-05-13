import axios from "axios";
const API_URL = "https://localhost:7256/api/Cart"; // Capital C

const cartService = {
  // Get the current user's cart (returns a CartDto object)
  getCart: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  // Add a book to the cart
  addToCart: async (bookId, quantity = 1) => {
    // Make sure quantity is at least 1
    if (!bookId || quantity < 1) throw new Error("Invalid bookId or quantity");
    const token = localStorage.getItem("token"); // or however you store it
    const res = await axios.post(
      API_URL,
      { bookId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
  // Update a cart item's quantity
  updateCartItem: async (cartItemId, quantity) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${API_URL}/${cartItemId}`,
      {
        cartItemId,
        quantity,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
  // Remove a cart item
  removeCartItem: async (cartItemId) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/cart-item/${cartItemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  // Remove the entire cart
  removeCart: async (cartId) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  placeOrder: async (cartItems) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://localhost:7256/api/MemberOrder/place-order",
      cartItems,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
};

export default cartService;