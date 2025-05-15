/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const {
    BACKEND_URL,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && emailRegex.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${BACKEND_URL}/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        toast.success(data.message, {
          style: {
            background: "rgba(32, 56, 70, 0.6)",
            color: "#fff",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          },
        });
        setAuthUser(data.user);

        if (!data.user.isVerified) {
          setIsLoggedIn(true);
          return navigate("/verify-email");
        }
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg,{
          style: {
            background: "rgba(32, 56, 70, 0.6)",
            color: "#fff",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          },
        });
    } finally {
      setIsLoading(false);
    }
  };

  return !isLoggedIn ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="size-5 text-teal-500" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched({ ...touched, email: true })}
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition duration-200"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="size-5 text-teal-500" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, password: true })}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition duration-200"
            />
          </div>

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-teal-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: isFormValid && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isFormValid && !isLoading ? 0.98 : 1 }}
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 px-4 ${
              isFormValid
                ? "bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-600 hover:to-sky-700 cursor-pointer"
                : "bg-gray-600 cursor-not-allowed"
            } text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200`}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  ) : (
    navigate("/dashboard")
  );
};

export default Login;
