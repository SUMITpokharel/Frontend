import axios from "axios";
const API_URL = "https://localhost:7256/api/Cart"; // Capital C

const cartService = {
  // Get the current user's cart (returns a CartDto object)
  getCart: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  // Add a book to the cart
  addToCart: async (bookId, quantity = 1) => {
    const res = await axios.post(API_URL, { bookId, quantity });
    return res.data;
  },
  // Update a cart item's quantity
  updateCartItem: async (cartItemId, quantity) => {
    const res = await axios.put(`${API_URL}/${cartItemId}`, {
      cartItemId,
      quantity,
    });
    return res.data;
  },
  // Remove a cart item
  removeCartItem: async (cartItemId) => {
    const res = await axios.delete(`${API_URL}/${cartItemId}`);
    return res.data;
  },
};

export default cartService;
