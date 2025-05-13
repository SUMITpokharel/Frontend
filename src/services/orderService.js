import axios from "axios";

const API_URL = "https://localhost:7256/api/MemberOrder";

const orderService = {
  // Get all orders for the current user
  getOrders: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://localhost:7256/api/MemberOrder/my-orders",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.data;
  },
  // Cancel an order by ID
  cancelOrder: async (orderId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/cancel-order`,
      JSON.stringify(orderId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  },
  processClaim: async (claimCode, orderId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://localhost:7256/api/Order/process-claim",
      { claimCode, orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  },
};

export default orderService;