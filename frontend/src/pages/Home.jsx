import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Bell,
  Settings,
  ChevronDown,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Reusable Loading Screen Component
const LoadingScreen = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
    <Loader className="w-10 h-10 text-green-500 animate-spin" />
    <p className="mt-4 text-green-500 text-lg">{message}</p>
  </div>
);

const Home = () => {
  const [user, setUser] = useState(null); // User state
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching user
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [isLogoutLoading, setIsLogoutLoading] = useState(false); // Loading state for logout
  const dropdownRef = useRef(null); // Ref for dropdown menu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          { withCredentials: true }
        );

        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isLoading && user === null) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
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

        setUser(null);
        navigate("/login");
      }
    } catch (error) {
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
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Fetching user data..." />;
  }

  if (user === null) {
    return <LoadingScreen message="Redirecting to login..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          User Dashboard
        </h1>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-white">{user.name}</span>
            <ChevronDown size={16} className="text-gray-300" />
          </button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-10"
            >
              <button className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 w-full cursor-pointer text-left">
                <User size={16} className="mr-2" />
                Profile
              </button>
              <button className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 w-full cursor-pointer text-left">
                <Bell size={16} className="mr-2" />
                Notifications
              </button>
              <button className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 w-full cursor-pointer text-left">
                <Settings size={16} className="mr-2" />
                Settings
              </button>
              <hr className="my-1 border-gray-700" />
              <button
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className="flex items-center px-4 py-2 text-red-400 hover:bg-gray-700 w-full cursor-pointer text-left"
              >
                <LogOut size={16} className="mr-2" />
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-700 bg-opacity-50 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              {user.name}
            </span>
            !
          </h2>
          <p className="text-gray-300">
            You've successfully logged into your account. This is your personal
            dashboard where you can manage your profile and settings.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-700 bg-opacity-50 rounded-xl p-5 cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-3">
              <User size={20} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-white">Update Profile</h4>
            <p className="text-gray-400 text-sm mt-1">
              Edit your account information
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-700 bg-opacity-50 rounded-xl p-5 cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-3">
              <Bell size={20} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-white">Notifications</h4>
            <p className="text-gray-400 text-sm mt-1">
              Manage your notifications
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-700 bg-opacity-50 rounded-xl p-5 cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-3">
              <Settings size={20} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-white">Settings</h4>
            <p className="text-gray-400 text-sm mt-1">
              Configure your preferences
            </p>
          </motion.div>
        </div>

        {/* Logout Button for Mobile */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          disabled={isLogoutLoading}
          className="md:hidden mt-6 w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-lg focus:outline-none cursor-pointer focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          {isLogoutLoading ? "Logging out..." : "Logout"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Home;
