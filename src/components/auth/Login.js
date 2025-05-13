// src/components/auth/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      const user = authService.getCurrentUser();
      console.log("Logged in user:", user);

      switch (user.role?.toLowerCase()) {
        case "admin":
          window.location.href = "/admin/dashboard";
          break;
        case "user":
          window.location.href = "/user/dashboard";
          break;
        case "staff":
          window.location.href = "/staff/dashboard";
          break;
        default:
          throw new Error("Unauthorized role");
      }
    } catch (err) {
      let message = "Login failed. Please check your credentials.";
      if (err.response?.data?.errors) {
        message = err.response.data.errors.join(", ");
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
