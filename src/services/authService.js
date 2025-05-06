import axios from "axios";

const API_URL = "https://localhost:7256/api/Auth";

const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  verifyEmail: async (otpData) => {
    const response = await axios.post(`${API_URL}/verify-email`, otpData);
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await axios.post(`${API_URL}/resend-otp`, { email });
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken,
    });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  verifyOtp: async (otpData) => {
    const response = await axios.post(`${API_URL}/verify-otp`, otpData);
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await axios.post(`${API_URL}/reset-password`, resetData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axios.post(
      `${API_URL}/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user"))?.token
          }`,
        },
      }
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};

export default authService;
