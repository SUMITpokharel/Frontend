import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import "./Auth.css";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.verifyEmail({ email, otp });
      navigate("/login", { state: { message: "Email verified successfully" } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await authService.resendOtp(email);
      setError("New OTP has been sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>Error</h2>
          <div className="error-message">No email address provided</div>
          <div className="auth-links">
            <button onClick={() => navigate("/register")}>
              Back to Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Verify Email</h2>
        <p className="verification-message">
          Please enter the verification code sent to {email}
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
        <div className="auth-links">
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="resend-button"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
