import axios from "axios";

const API_URL = "https://localhost:7256/api/admin/discounts";

const discountService = {
  getAllDiscounts: async () => {
    const response = await axios.get(API_URL);
    return response.data.data || [];
  },

  getActiveDiscounts: async () => {
    const response = await axios.get(`${API_URL}/active`);
    return response.data.data || [];
  },

  getOnSaleDiscounts: async () => {
    const response = await axios.get(`${API_URL}/on-sale`);
    return response.data.data || [];
  },

  getDiscountById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  },

  createDiscount: async (discountData) => {
    const response = await axios.post(API_URL, discountData);
    return response.data.data;
  },

  updateDiscount: async (id, discountData) => {
    const response = await axios.put(`${API_URL}/${id}`, discountData);
    return response.data.data;
  },

  deleteDiscount: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default discountService;
