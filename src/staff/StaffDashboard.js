// src/components/staff/StaffDashboard.js
import React, { useState } from "react";
import orderService from "../services/orderService";

const StaffDashboard = () => {
  const [claimCode, setClaimCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  const handleProcessClaim = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const result = await orderService.processClaim(claimCode, orderId);
      if (result.isSuccess) {
        setMessage("Order fulfilled successfully!");
      } else {
        setMessage(result.error?.errorMessage || "Failed to process claim.");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.error?.errorMessage ||
          err.message ||
          "Failed to process claim."
      );
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2>Staff Dashboard</h2>
      <p>Welcome, Staff! Process member claim codes below:</p>
      <form onSubmit={handleProcessClaim} style={{ marginTop: 24 }}>
        <div>
          <label>Claim Code:</label>
          <input
            type="text"
            value={claimCode}
            onChange={(e) => setClaimCode(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 12 }}
          />
        </div>
        <div>
          <label>Order ID:</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 12 }}
          />
        </div>
        <button type="submit">Process Claim</button>
      </form>
      {message && (
        <div style={{ marginTop: 16, color: "green" }}>{message}</div>
      )}
    </div>
  );
};

export default StaffDashboard;