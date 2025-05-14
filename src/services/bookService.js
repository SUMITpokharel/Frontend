import axios from "axios";

const API_URL = "https://localhost:7256/api/Book";

const bookService = {
  getAllBooks: async () => {
    const res = await axios.get(API_URL);
    return res.data.data || [];
  },

  getBookDetail: async (id) => {
    const response = await axios.get(`${API_URL}/${id}/details`);
    return response.data;
  },

  // Add method for filtered books (paginated)
  getFilteredBooks: async (filters) => {
    const params = {
      SearchTerm: filters.searchTerm || "",
      SortByPriceDescending: filters.sortByPriceDescending || false,
      Page: filters.page || 1,
      PageSize: filters.pageSize || 10,
    };
    const res = await axios.get(`${API_URL}/filtered-books`, { params });
    return {
      items: res.data.data || [],
      totalCount: res.data.totalCount || 0,
      page: res.data.page || 1,
      pageSize: res.data.pageSize || 10,
    };
  },

  fetchBookDetailsById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}/details`);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error(
        "Update book error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.status === 204; // Returns true if successfully deleted
    } catch (error) {
      console.error(
        "Delete book error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  add: async (bookData) => {
    const response = await axios.post(API_URL, bookData);
    return response.data.data;
  },
};

export default bookService;
