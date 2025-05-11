import axios from "axios";
const API_URL = "https://localhost:7256/api/Publisher";

const publisherService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    // If your backend wraps data in .data, adjust accordingly
    return Array.isArray(res.data) ? res.data : res.data.data;
  },
  add: async (publisher) => {
    const res = await axios.post(API_URL, publisher);
    return res.data;
  },
  // Optionally add update and delete methods
};

export default publisherService;
