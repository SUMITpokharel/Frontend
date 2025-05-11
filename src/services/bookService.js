import axios from "axios";

const API_URL = "https://localhost:7256/api/Book";

const bookService = {
  getAllBooks: async () => {
    const res = await axios.get(API_URL);
    return res.data.data || [];
  },

  getBookDetail: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/detail/${id}`);
      // Backend returns BookDetailDto directly or null
      return response.data || null;
    } catch (error) {
      console.error(
        "API Error:",
        error.response?.data?.Errors || error.message
      );
      throw error;
    }
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
};

export default bookService;
