import axios from 'axios';

const BASE_URL = 'https://localhost:7256';

const orderService = {
  placeOrder: async (orderItems) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/MemberOrder/place-order`, orderItems);
      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.error?.errorMessage || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/MemberOrder/cancel-order`, orderId);
      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.error?.errorMessage || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  processClaim: async (claimCode, orderId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Order/process-claim`, {
        claimCode,
        orderId
      });
      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.error?.errorMessage || 'Failed to process claim');
      }
    } catch (error) {
      console.error('Error processing claim:', error);
      throw error;
    }
  }
};

export default orderService;
