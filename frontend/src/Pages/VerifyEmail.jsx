/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EmailVerify = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { setIsLoggedIn, isLoading, BACKEND_URL,toastStyle } = useAuth();

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const cleanValue = value.replace(/\D/g, "");
      const pastedCode = cleanValue.slice(0, 6).split("");
      const newCode = [...code];

      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = Math.min(pastedCode.length - 1, 5);
      const nextFocusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;

      if (inputRefs.current[nextFocusIndex]) {
        inputRefs.current[nextFocusIndex].focus();
      }
    } else {
      if (/^\d*$/.test(value)) {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;

    try {
      setResendDisabled(true);
      setCountdown(60);

      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${BACKEND_URL}/resend-otp`);

      if (data.success) {
        toast.success(data.message || "OTP has been resent to your email",toastStyle);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again later.", toastStyle
      );
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      return toast.error("Please enter all 6 digits", toastStyle);
    }

    try {
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${BACKEND_URL}/verify-email`,
        { otp: verificationCode },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        toast.success(data.message || "Email verified successfully!",toastStyle);
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      toast.error(errMsg, toastStyle);

      setCode(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) {
      setResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (code.every((digit) => digit !== "") && code.length === 6) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 w-full"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="flex justify-between gap-2"
            role="group"
            aria-label="Email verification code"
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                aria-label={`Digit ${index + 1}`}
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting || isLoading}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-teal-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || isSubmitting || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-teal-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading || isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            aria-live="polite"
          >
            {resendDisabled
              ? `Resend code in ${countdown}s`
              : <div className="flex items-center justify-center gap-1"><p>Didn't receive code? </p><span className='cursor-pointer hover:text-teal-500'>Resend</span></div>}
          </button>

          <p className="text-xs text-zinc-400 mt-2">
            Having trouble? Contact support at mern.auth.dev@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerify;
