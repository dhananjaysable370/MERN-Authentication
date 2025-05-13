/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User, Loader } from "lucide-react";
import { motion } from "framer-motion";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const Register = () => {
  const { BACKEND_URL, setAuthUser, isLoading, isLoggedIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const navigate = useNavigate();

  // check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    const calculateStrength = (pass) => {
      let strength = 0;

      if (pass.length >= 8) strength += 1;
      if (/[A-Z]/.test(pass)) strength += 1;
      if (/[0-9]/.test(pass)) strength += 1;
      if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

      return strength;
    };

    const strength = calculateStrength(password);
    setPasswordStrength(strength);

    setIsPasswordStrong(strength >= 3);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordStrong) {
      toast.error("Please use a stronger password");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${BACKEND_URL}/register`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        toast.success(data.message);
        const isVerified = data?.user?.isVerified ?? false;

        if (isVerified) {
          setAuthUser(data.user);
          navigate("/login");
          return;
        } else {
          navigate("/verify-email");
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    }
  };

  const isFormValid =
    name.trim() !== "" &&
    email.trim() &&
    emailRegex.test(email) &&
    email !== "" &&
    password.trim() !== "" &&
    isPasswordStrong;

  return !isLoggedIn ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="size-5 text-green-500" />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              required
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="size-5 text-green-500" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              required
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="size-5 text-green-500" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              required
            />
          </div>

          <PasswordStrengthMeter
            password={password}
            onStrengthChange={setPasswordStrength}
          />

          {!isPasswordStrong && password.length > 0 && (
            <p className="text-yellow-500 text-sm mt-2">
              Please create a stronger password to continue
            </p>
          )}

          <motion.button
            className={`mt-5 w-full py-3 px-4 ${
              isFormValid
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer"
                : "bg-gray-600 cursor-not-allowed"
            } text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
             focus:ring-offset-gray-900 transition duration-200`}
            whileHover={{ scale: isFormValid ? 1.02 : 1 }}
            whileTap={{ scale: isFormValid ? 0.98 : 1 }}
            type="submit"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  ) : (
    navigate("/dashboard")
  );
};

export default Register;
