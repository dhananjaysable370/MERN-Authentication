/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthUser, authUser } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const hadleLogout = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/logout`);
      if (data.success) {
        setIsLoggedIn(false);
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
        setAuthUser(null);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        style: {
          background: "rgba(32, 56, 70, 0.6)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },
      });
    }
  };
  return (
    <div>
      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-sky-600 text-transparent bg-clip-text">
            Dashboard
          </h2>

          <div className="space-y-6">
            <motion.div
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-teal-400 mb-3">
                Profile Information
              </h3>
              <p className="text-gray-300">Name: {authUser.name}</p>
              <p className="text-gray-300">Email: {authUser.email}</p>
            </motion.div>
            <motion.div
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-teal-400 mb-3">
                Account Activity
              </h3>
              <p className="text-gray-300">
                <span className="font-bold">Joined: </span>
                {new Date(authUser.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-300">
                <span className="font-bold">Last Login: </span>

                {authUser.lastLogin}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={hadleLogout}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-sky-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-sky-700
				 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
            >
              Logout
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
