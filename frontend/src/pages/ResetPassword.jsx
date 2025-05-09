import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { KeyRound, Loader } from "lucide-react";
import axios from "axios";
import Input from "@/components/Input";
import { toast } from "sonner";
import PasswordStrength from "@/components/PasswordStrength";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false); // Track password strength
  const navigate = useNavigate();
  const { token } = useParams();

  const handlePasswordChange = (password) => {
    setNewPassword(password);

    // Validate password strength
    const isStrong = validatePasswordStrength(password);
    setIsPasswordStrong(isStrong);
  };

  const validatePasswordStrength = (password) => {
    // Example password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isLongEnough
    );
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (!newPassword) {
      toast.error("New password is required!");
      return;
    }

    if (!isPasswordStrong) {
      toast.error("Password is not strong enough!");
      return;
    }

    try {
      setIsLoading(true);

      if (!token) {
        toast.error("Password reset token is missing!");
        setIsLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`,
        {
          password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setNewPassword("");
        toast.success(data.message, {
          style: {
            background: "linear-gradient(to right, #10b981, #059669)",
            color: "#ffffff",
          },
          iconTheme: {
            primary: "#059669",
            secondary: "#ffffff",
          },
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        style: {
          background: "linear-gradient(to right, #10b981, #059669)",
          color: "#ffffff",
        },
        iconTheme: {
          primary: "#059669",
          secondary: "#ffffff",
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-w-md bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword}>
          <Input
            icon={KeyRound}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            name="password"
            required
          />
          <PasswordStrength password={newPassword} />

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer ${
              !isPasswordStrong || isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            whileHover={{
              scale: isPasswordStrong && !isLoading ? 1.02 : 1,
            }}
            whileTap={{
              scale: isPasswordStrong && !isLoading ? 0.98 : 1,
            }}
            type="submit"
            disabled={!isPasswordStrong || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
