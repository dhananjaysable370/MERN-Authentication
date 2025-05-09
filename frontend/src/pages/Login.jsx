import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import Input from "@/components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialAuthChecking, setIsInitialAuthChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useRef(true);

  // Get the redirect path from location state or default to '/home'
  const redirectPath = location.state?.from?.pathname || "/home";

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    // Set up cleanup to prevent memory leaks
    isMounted.current = true;

    const abortController = new AbortController();

    const checkAuthStatus = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          {
            withCredentials: true,
            signal: abortController.signal,
          }
        );

        if (data.success && isMounted.current) {
          // Slight delay to ensure App.jsx has time to update its user state
          setTimeout(() => {
            if (isMounted.current) {
              setIsInitialAuthChecking(false);
              navigate(redirectPath, { replace: true });
            }
          }, 100);
        } else if (isMounted.current) {
          setIsInitialAuthChecking(false);
        }
      } catch (error) {
        if (!axios.isCancel(error) && isMounted.current) {
          console.error("Authentication check failed:", error);
          setIsInitialAuthChecking(false);
        }
      }
    };

    checkAuthStatus();

    // Cleanup function
    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, [navigate, redirectPath]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success && isMounted.current) {
        // Clear form fields
        setEmail("");
        setPassword("");

        // Show success toast
        toast.success(`Welcome, ${data.user?.name || "User"}!`, {
          style: {
            background: "linear-gradient(to right, #10b981, #059669)",
            color: "#ffffff",
          },
          iconTheme: {
            primary: "#059669",
            secondary: "#ffffff",
          },
        });

        // Trigger global auth state update
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/check-auth`, {
          withCredentials: true,
        });

        // Navigate after a short delay
        setTimeout(() => {
          if (isMounted.current) {
            setIsLoading(false);
            navigate(redirectPath, { replace: true });
          }
        }, 1000);
      }
    } catch (error) {
      if (isMounted.current) {
        setIsLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage, {
          style: {
            background: "linear-gradient(to right, #ef4444, #dc2626)",
            color: "#ffffff",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        });
      }
    }
  };

  // Show loading state during initial auth check
  if (isInitialAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-64 w-full">
        <Loader className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

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

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            required
            disabled={isLoading}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
            disabled={isLoading}
          />

          <div className="flex items-center justify-between mb-5">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline"
              tabIndex={isLoading ? -1 : 0}
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer ${
              !email || !password || isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            whileHover={{ scale: email && password && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: email && password && !isLoading ? 0.98 : 1 }}
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
          <Link
            className="text-green-400 hover:underline"
            to="/register"
            tabIndex={isLoading ? -1 : 0}
          >
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
