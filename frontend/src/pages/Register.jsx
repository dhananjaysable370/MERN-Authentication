import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import Input from "@/components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrength from "@/components/PasswordStrength";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^A-Za-z\d]/)) strength++;
    return strength;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (passwordStrength < 4) {
      toast.error("Password is not strong enough!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        {
          name,
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
        toast.success(data.message);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    setPasswordStrength(getPasswordStrength(pass));
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
          Create Account
        </h2>

        <form onSubmit={handleRegister}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            required
          />
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
            placeholder="************"
            value={password}
            onChange={handlePasswordChange}
            name="password"
            required
          />

          <PasswordStrength password={password} />

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer ${
              passwordStrength < 4 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: passwordStrength >= 4 ? 1.02 : 1 }}
            whileTap={{ scale: passwordStrength >= 4 ? 0.98 : 1 }}
            type="submit"
            disabled={passwordStrength < 4}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?&nbsp;
          <Link className="text-green-400 hover:underline" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
