import axios from "axios";
const API_URL = "https://localhost:7256/api/Publisher";

const publisherService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data.isSuccess ? res.data.data : [];
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  add: async (publisher) => {
    const res = await axios.post(API_URL, publisher);
    return res.data;
  },

  update: async (id, publisher) => {
    const res = await axios.put(`${API_URL}/${id}`, publisher);
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.status === 204;
  },
};

export default publisherService;
