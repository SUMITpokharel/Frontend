import axios from "axios";

const API_URL = "https://localhost:7256/api/bookmarks"; // Changed to HTTP

const token = localStorage.getItem("token"); // or wherever you store it

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const bookmarkService = {
  // Get all bookmarks for the current user
  getBookmarks: async () => {
    try {
      const response = await axios.get(`${API_URL}`, config);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      throw error;
    }
  },

  // Add a bookmark for a book
  addBookmark: async (bookId) => {
    try {
      const response = await axios.post(`${API_URL}/${bookId}`, {}, config);
      return response.data.data;
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  },

  // Remove a bookmark for a book
  removeBookmark: async (bookId) => {
    try {
      const response = await axios.delete(`${API_URL}/${bookId}`, config);
      return response.data.data;
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  },
};

export default bookmarkService;
