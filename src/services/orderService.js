import axios from 'axios';

const BASE_URL = 'https://localhost:7256';

const orderService = {
  placeOrder: async (orderItems) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/MemberOrder/place-order`, orderItems);
      if (response.data && response.data.isSuccess) {
        // Return the order ID from the response
        return response.data.data?.orderId || response.data.data?.OrderId;
      }
      throw new Error(response.data?.error?.errorMessage || 'Failed to place order');
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error(error.response?.data?.error?.errorMessage || 'Failed to place order');
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/MemberOrder/cancel-order`, orderId);
      if (response.data && response.data.isSuccess) {
        return response.data.data;
      }
      throw new Error(response.data?.error?.errorMessage || 'Failed to cancel order');
    } catch (error) {
      console.error('Error canceling order:', error);
      throw new Error(error.response?.data?.error?.errorMessage || 'Failed to cancel order');
    }
  },

  processClaim: async (claimCode, orderId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Order/process-claim`, {
        claimCode,
        orderId
      });
      if (response.data && response.data.isSuccess) {
        return response.data.data;
      }
      throw new Error(response.data?.error?.errorMessage || 'Failed to process claim');
    } catch (error) {
      console.error('Error processing claim:', error);
      throw new Error(error.response?.data?.error?.errorMessage || 'Failed to process claim');
    }
  }
};

export default orderService;
