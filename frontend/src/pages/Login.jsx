import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader, Lock, Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

import Input from "@/components/Input";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useRef(true);

  const redirectTo = location.state?.from?.pathname || "/home";

  const validate = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 6,
  };

  const isFormValid = Object.values(validate).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const getError = (field) => {
    if (!touched[field]) return null;
    if (!validate[field]) {
      if (field === "email") return "Please enter a valid email address";
      if (field === "password") return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setTouched({ email: true, password: true });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success && isMounted.current) {
        toast.success(`Welcome back, ${data.user?.name || "User"}!`, {
          style: {
            background: "linear-gradient(to right, #10b981, #059669)",
            color: "#fff",
          },
          iconTheme: {
            primary: "#059669",
            secondary: "#fff",
          },
        });

        onLogin?.(data.user);
      }
    } catch (err) {
      if (isMounted.current) {
        const msg =
          err.response?.data?.message || "Login failed. Please try again.";
        toast.error(msg, {
          style: {
            background: "linear-gradient(to right, #ef4444, #dc2626)",
            color: "#fff",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
        });
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-w-md max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl"
    >
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-green-400 hover:text-green-300 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>
        </div>

        <form onSubmit={handleLogin} noValidate>
          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            error={getError("email")}
            disabled={isLoading}
            aria-label="Email Address"
          />

          <Input
            icon={Lock}
            type="password"
            name="password"
            placeholder="************"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            error={getError("password")}
            disabled={isLoading}
            aria-label="Password"
          />

          <div className="flex justify-between mt-2 mb-5 text-sm">
            <Link
              to="/forgot-password"
              className="text-green-400 hover:underline"
              tabIndex={isLoading ? -1 : 0}
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={!isFormValid || isLoading}
            whileHover={{ scale: isFormValid && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isFormValid && !isLoading ? 0.98 : 1 }}
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              !isFormValid || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-green-600 hover:to-emerald-700"
            }`}
            aria-label="Sign In"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900/50 text-center">
        <p className="text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-400 hover:underline"
            tabIndex={isLoading ? -1 : 0}
          >
            Create Account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
