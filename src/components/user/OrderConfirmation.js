import React from "react";
import { useParams, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  const containerStyle = {
    maxWidth: 600,
    margin: "0 auto",
    padding: "2rem",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 24,
  };

  const iconStyle = {
    fontSize: 40,
    marginBottom: 16,
  };

  const messageStyle = {
    fontSize: 18,
    marginBottom: 16,
  };

  const infoTextStyle = {
    color: "#666",
    fontSize: 16,
    marginBottom: 32,
  };

  const linkStyle = {
    backgroundColor: "#4a90e2",
    color: "#fff",
    padding: "12px 32px",
    borderRadius: 4,
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Thank You for Your Order!</h1>
      <div style={iconStyle}>
        <span role="img" aria-label="check">
          ✅
        </span>
      </div>
      <p style={messageStyle}>
        Your order <b>#{orderId}</b> has been placed successfully.
      </p>
      <p style={infoTextStyle}>
        We've sent a confirmation email with your order details.
        <br />
        You can track your order status in your account.
      </p>
      <Link to="/user/dashboard" style={linkStyle}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default OrderConfirmation;
