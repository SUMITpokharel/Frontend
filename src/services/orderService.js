import axios from 'axios';

const BASE_URL = 'https://localhost:7256';

const orderService = {
  getOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Order`);
      // Transform the data to match our chart requirements
      const orders = response.data.map(order => ({
        orderDate: order.orderDate,
        items: order.items,
        total: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }));
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  processClaim: async (claimCode) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Order/process-claim`, {
        claimCode
      });
      return response.data;
    } catch (error) {
      console.error('Error processing claim:', error);
      throw error;
    }
  }
};

export default orderService;
