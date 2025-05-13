import axios from "axios";

const API_URL = "https://localhost:7256/api/Auth";

const userService = {
  // Get all users
  getUsers: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Return the array inside the data property
    return res.data.data;
  },
  // Assign staff role to a user
  assignStaffRole: async (userId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/assign-staff-role`,
      { userId },
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

export default userService;