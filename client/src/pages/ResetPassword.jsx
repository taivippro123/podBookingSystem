import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // State for password error message
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/forgot-password", { email });
      setOtpSent(true);
      alert("OTP sent to your email.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Your email is not existed!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Check if the password meets the length requirement
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    setPasswordError(""); // Clear error if the password is valid

    try {
      await axios.post("http://localhost:5000/change-password", {
        email,
        otpCode: otp,
        newPassword,
      });
      alert("Password changed successfully.");
      navigate("/"); // Redirect to the home page after a successful password reset
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please check your OTP or try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive an OTP
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="flex">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              </div>
            </div>

            {/* OTP and New Password Fields */}
            {otpSent && (
              <>
                {/* OTP Field */}
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                {/* New Password Field */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {/* Error message for password */}
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Reset Password Button */}
          {otpSent && (
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
