import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Lock, Mail, User, ArrowLeft } from "lucide-react";

import Input from "@/components/Input";
import PasswordStrength from "@/components/PasswordStrength";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  const validate = {
    name: formData.name.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: passwordStrength >= 3,
  };

  const isValid = Object.values(validate).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 4);
  };

  const getError = (field) => {
    if (!touched[field]) return null;
    if (!validate[field]) {
      if (field === "name") return "Name must be at least 2 characters";
      if (field === "email") return "Please enter a valid email address";
      if (field === "password") return "Password is not strong enough";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setTouched({ name: true, email: true, password: true });
      toast.error("Please correct the errors before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.post("/register", formData);

      if (data.success) {
        toast.success(data.message, {
          style: {
            background: "linear-gradient(to right, #10b981, #059669)",
            color: "#fff",
          },
          iconTheme: {
            primary: "#059669",
            secondary: "#fff",
          },
        });

        if (onRegister && data.user) onRegister(data.user);
        navigate("/verify-email");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            error={getError("name")}
            disabled={isLoading}
            aria-label="Full Name"
          />

          <Input
            icon={Mail}
            type="email"
            placeholder="email@example.com"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            error={getError("email")}
            disabled={isLoading}
            aria-label="Email"
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="************"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            error={getError("password")}
            disabled={isLoading}
            aria-label="Password"
          />

          <PasswordStrength
            password={formData.password}
            strength={passwordStrength}
          />

          <div className="mt-2 mb-4 text-xs text-gray-400">
            Password must be at least 6 characters and include uppercase,
            lowercase, numbers, and symbols.
          </div>

          <motion.button
            type="submit"
            disabled={!isValid || isLoading}
            whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              !isValid || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-green-600 hover:to-emerald-700"
            }`}
            aria-label="Create Account"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900/50 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline"
            tabIndex={isLoading ? -1 : 0}
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
