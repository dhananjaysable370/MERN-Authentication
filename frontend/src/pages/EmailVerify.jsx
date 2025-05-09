import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const EmailVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allFieldsFilled = otp.every((digit) => digit !== "");
    if (allFieldsFilled && otp.length === 6) {
      handleSubmit();
    }
  }, [otp]);

  const handleChange = (index, value) => {
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const filteredValue = value.replace(/[^0-9]/g, "");

    if (filteredValue === "") return;

    const newOtp = [...otp];

    if (filteredValue.length > 1) {
      let pastedValues = filteredValue.slice(0, 6).split("");

      pastedValues = pastedValues.slice(0, 6 - index);

      pastedValues.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      const nextIndex = Math.min(index + pastedValues.length, 5);

      if (nextIndex < 5) {
        setTimeout(() => {
          inputRef.current[nextIndex]?.focus();
        }, 0);
      } else {
        setTimeout(() => {
          inputRef.current[5]?.blur();
        }, 0);
      }
    } else {
      newOtp[index] = filteredValue;
      setOtp(newOtp);

      if (filteredValue && index < 5) {
        setTimeout(() => {
          inputRef.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRef.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    handleChange(index, pasteData);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const otpValue = otp.join("");
    if (otpValue.length === 6 && !isLoading) {
      setIsLoading(true);
      axios.defaults.withCredentials = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/verify-email`,
          { otp: otpValue },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (data.success) {
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
    } else if (otpValue.length < 6 && e) {
      // Only show error if manually submitted with incomplete OTP
      toast.error("Please enter a valid 6-digit OTP.", {
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
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit OTP sent to your email address.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
                disabled={isLoading}
              />
            ))}
          </div>

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer ${
              otp.join("").length < 6 || isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            type="submit"
            disabled={otp.join("").length < 6 || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Verifying</span>
              </div>
            ) : (
              "Submit"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerify;
