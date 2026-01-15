import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  verifyResetToken,
  resetPassword,
} from "../../store/services/authServices";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const token = new URLSearchParams(search).get("token");

  const [isValidToken, setIsValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      await verifyResetToken(token);
      setIsValidToken(true);
    } catch (error) {
      toast.error(error.message || "Invalid or expired token");
      setIsValidToken(false);
    }
  };

  const handleReset = async () => {
    if (!password || !confirmPassword)
      return toast.error("Please fill all fields");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await resetPassword({ token, password, confirmPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Reset failed");
    }
  };

  if (!isValidToken) return <h3>Validating reset link...</h3>;

  return (
    <div className="container">
      <h2>Reset Your Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}
