import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import Input from "@/components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(true);
      if (data.success) {
        setEmail("");
        setPassword("");
        setTimeout(() => {
          toast.success(data.message, {
            style: {
              background: "linear-gradient(to right, #10b981, #059669)", // Emerald gradient
              color: "#ffffff", // White text
            },
            iconTheme: {
              primary: "#059669", // Emerald color for the icon
              secondary: "#ffffff", // White background for the icon
            },
          });
          setIsLoading(false);
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      setEmail("");
      setPassword("");
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
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
          Sign in to your account
        </h2>

        <form onSubmit={handleRegister}>
          <Input
            icon={Mail}
            type="email"
            placeholder="google@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
          />

          <div className="flex items-center mb-5">
            <Link
              to={"/forgot-password"}
              className="text-sm text-green-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer ${
              !email || !password ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: email && password ? 1.02 : 1 }}
            whileTap={{ scale: email && password ? 0.98 : 1 }}
            type="submit"
            disabled={!email || !password || isLoading}
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
          Don't have an account?&nbsp;
          <Link className="text-green-400 hover:underline" to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
