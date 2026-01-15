import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { sendForgotPasswordEmail } from "../../store/services/authServices";
import {
  MdOutlineEmail,
  MdArrowForward,
  MdStorefront,
  MdLockReset,
} from "react-icons/md";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      emailRef.current?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await sendForgotPasswordEmail(email);
      toast.success(res.message || "Password reset email sent successfully!");
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error(
        error.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 text-white">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
              <MdStorefront className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Kharido<span className="text-blue-100">Becho</span>
              </h1>
              <p className="text-xs text-blue-100">Reset Password</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <MdLockReset className="text-blue-600 text-2xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {emailSent ? "Check Your Email" : "Forgot Password?"}
            </h2>

            <p className="text-gray-600 text-sm">
              {emailSent
                ? `We've sent password reset instructions to ${email}`
                : "Enter your email address and we'll send you a reset link"}
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    emailFocused
                      ? "border-blue-500 ring-1 ring-blue-200 bg-white"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <MdOutlineEmail
                    className={`text-lg mr-2 ${
                      emailFocused ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onKeyDown={handleEnter}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder-gray-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow hover:shadow-md"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <MdArrowForward className="ml-2 text-base" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 text-sm">
                  Check your inbox and click the link in the email to reset your
                  password.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Resend Email
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Back to Login
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Didn't receive email? Check spam folder or try again.
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          {!emailSent && (
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Need help? Contact our{" "}
            <a
              href="mailto:support@kharidobecho.com"
              className="text-blue-600 hover:underline"
            >
              support team
            </a>
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-xl max-w-xs text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <h3 className="text-xs font-semibold text-gray-800">
              Sending Reset Link
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
