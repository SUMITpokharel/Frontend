// src/components/staff/StaffDashboard.js
import React, { useState } from "react";
import orderService from "../services/orderService";
import "./StaffDashboard.css";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const [claimCode, setClaimCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProcessClaim = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(null);
    try {
      const result = await orderService.processClaim(claimCode, orderId);
      if (result.isSuccess) {
        setMessage("Order fulfilled successfully!");
        setSuccess(true);
      } else {
        setMessage(result.error?.errorMessage || "Failed to process claim.");
        setSuccess(false);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.error?.errorMessage ||
          err.message ||
          "Failed to process claim."
      );
      setSuccess(false);
    }
  };

  return (
    <>
      <nav className="staff-navbar">
        <div className="staff-navbar-title">Staff Portal</div>
        <div className="staff-navbar-right">
          <span className="staff-navbar-user">
            {user?.firstName || "Staff"}
          </span>
          <button className="staff-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
          </button>
        </div>
      </nav>
      <div className="staff-dashboard-container">
        <h2>Staff Dashboard</h2>
        <p>Welcome, Staff! Process member claim codes below:</p>
        <form
          className="staff-claim-form"
          onSubmit={handleProcessClaim}
          autoComplete="off"
        >
          <div>
            <label htmlFor="claimCode">Claim Code:</label>
            <input
              id="claimCode"
              type="text"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value)}
              required
              placeholder="e.g. CLAIM-XXXXXXX"
            />
          </div>
          <div>
            <label htmlFor="orderId">Order ID:</label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="Paste the Order ID here"
            />
          </div>
          <button type="submit" className="modern-btn">
            Process Claim
          </button>
        </form>
        {message && (
          <div
            className={`staff-claim-message ${
              success === false ? "error" : "success"
            }`}
          >
            {success === true && (
              <FaCheckCircle style={{ color: "#059669", marginRight: 6 }} />
            )}
            {success === false && (
              <FaExclamationCircle
                style={{ color: "#ef4444", marginRight: 6 }}
              />
            )}
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default StaffDashboard;
