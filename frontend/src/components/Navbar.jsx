import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
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
        setUser(null); // Clear user state
        navigate("/login");
      }
    } catch (error) {
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
    <nav className="bg-gray-800 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"
        >
          MERN Auth
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">
                Welcome,{" "}
                <span className="font-bold text-green-400">{user.name}</span>
              </span>
              <Link
                to="/home"
                className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
