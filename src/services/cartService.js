import axios from "axios";

const API_URL = "https://localhost:7256/api/Cart";

const cartService = {
  // Get all carts for the current user (returns an array of CartDto objects)
  getCart: async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      throw new Error("User is not authenticated. Please log in.");
    }
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // Returns an array of carts
    } catch (error) {
      console.error("Get carts error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get a specific cart by cartId
  getCartById: async (cartId) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      throw new Error("User is not authenticated. Please log in.");
    }
    try {
      const res = await axios.get(`${API_URL}/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Get cart by ID error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Add a book to the cart
  addToCart: async (bookId, quantity = 1) => {
    const token = localStorage.getItem("token"); // Retrieve token
    if (!token) {
      throw new Error("User is not authenticated. Please log in.");
    }
    try {
      const res = await axios.post(
        API_URL,
        { bookId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data; // Returns the updated cart
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update a cart item's quantity
  updateCartItem: async (cartItemId, quantity) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated. Please log in.");
    }
    try {
      const res = await axios.put(
        `${API_URL}/${cartItemId}`,
        { cartItemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      console.error("Update cart item error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Remove a cart item
  removeCartItem: async (cartItemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated. Please log in.");
    }
    try {
      const res = await axios.delete(`${API_URL}/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Remove cart item error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default cartService;