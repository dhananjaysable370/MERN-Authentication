import React, { useState } from "react";
import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader } from "lucide-react";
import axios from "axios";
import Input from "@/components/Input";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (!email) {
      toast.error("Email is Required!");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setEmail("");
        setTimeout(() => {
          setIsLoading(false);
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
          // navigate("/reset-password");
        }, 1500);
      }
    } catch (error) {
      setEmail("");
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
          Forgot Password
        </h2>

        <form onSubmit={handleForgotPassword}>
          <Input
            icon={Mail}
            type="email"
            placeholder="google@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            required
          />

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer ${
              !email || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: email && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: email && !isLoading ? 0.98 : 1 }}
            type="submit"
            disabled={!email || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              "Submit"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
