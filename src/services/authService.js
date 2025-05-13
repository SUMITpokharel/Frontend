// src/services/authService.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7256/api/Auth";

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  verifyEmail: async (otpData) => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, otpData);
      const token = response.data;

      if (token) {
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        const user = {
          id: decodedToken.sub,
          email: decodedToken.email,
          role: decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
        };
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const token = response.data.data; 

      if (typeof token !== "string") {
        throw new Error("Invalid token format received from server");
      }

      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      const user = {
        id: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      };
      localStorage.setItem("user", JSON.stringify(user));
      return token;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
