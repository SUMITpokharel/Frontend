import axios from "axios";

const API_URL = "https://localhost:7256/api/Review";

const reviewService = {
  // Get all reviews
  getAll: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Get a review by ID
  getById: async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Create a review
  create: async (review) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(API_URL, review, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Update a review
  update: async (id, review) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/${id}`, review, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Delete a review
  delete: async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export default reviewService;
