import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        setIsLoading(false);
        return;
      }

      setSuccess(data.message);
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP (move to step 3)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        setIsLoading(false);
        return;
      }

      setSuccess(data.message);
      setIsLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  // Progress indicator
  const steps = ["Email", "OTP", "New Password"];

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>

        {/* Step Progress */}
        <div className="fp-progress">
          {steps.map((label, index) => (
            <div key={label} className={`fp-step ${step >= index + 1 ? "active" : ""}`}>
              <div className="fp-step-circle">{index + 1}</div>
              <span className="fp-step-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Enter your registered email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button disabled={isLoading} type="submit" className="btn-auth">
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter the 6-digit OTP sent to {email}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="______"
                maxLength={6}
                className="otp-input"
                required
              />
            </div>
            <button type="submit" className="btn-auth">
              Verify OTP
            </button>
            <button
              type="button"
              className="fp-resend-btn"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            <button disabled={isLoading} type="submit" className="btn-auth">
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <p className="fp-back-link">
          <a onClick={() => navigate("/login")}>← Back to Login</a>
        </p>
      </div>
    </div>
  );
}
