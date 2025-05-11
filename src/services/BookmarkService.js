import axios from "axios";

const API_URL = "https://localhost:7256/api/bookmarks"; // plural, lowercase

const bookmarkService = {
  // Get all bookmarks for the current user
  getBookmarks: async () => {
    const response = await axios.get(`${API_URL}/my`);
    return response.data; // Should be an array of BookMarkDto
  },

  // Add a bookmark for a book
  addBookmark: async (bookId) => {
    const response = await axios.post(`${API_URL}/${bookId}`);
    return response.data;
  },

  // Remove a bookmark for a book
  removeBookmark: async (bookId) => {
    const response = await axios.delete(`${API_URL}/remove/${bookId}`);
    return response.data;
  },
};

export default bookmarkService;
