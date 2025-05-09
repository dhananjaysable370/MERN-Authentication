import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import FloatingShape from "./components/FloatingShape";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

// Reusable Loading Screen Component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-transparent">
    <Loader className="w-10 h-10 text-green-500 animate-spin" />
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Create an abort controller to handle cleanup
    const abortController = new AbortController();

    const checkAuth = async () => {
      setIsLoading(true);
      axios.defaults.withCredentials = true;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          {
            signal: abortController.signal,
          }
        );
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Authentication check failed:", error);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Cleanup function to abort request when component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  // Listen for auth-related path changes to recheck authentication
  useEffect(() => {
    const authPaths = ["/login", "/register", "/home", "/"];
    if (authPaths.includes(location.pathname)) {
      const checkAuthOnPathChange = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/check-auth`
          );
          if (data.success) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        }
      };

      checkAuthOnPathChange();
    }
  }, [location.pathname]);

  const ProtectedRoute = ({ element }) => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    return user ? element : <Navigate to="/login" state={{ from: location }} />;
  };

  const PublicRoute = ({ element }) => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    return !user ? element : <Navigate to="/home" />;
  };

  // Add a default route to redirect to home or login
  const DefaultRoute = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    return <Navigate to={user ? "/home" : "/login"} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/reset-password/:token"
          element={<PublicRoute element={<ResetPassword />} />}
        />
        <Route
          path="/verify-email"
          element={<ProtectedRoute element={<EmailVerify />} />}
        />

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route
          path="/register"
          element={<PublicRoute element={<Register />} />}
        />
        <Route
          path="/forgot-password"
          element={<PublicRoute element={<ForgotPassword />} />}
        />

        {/* Default Route */}
        <Route path="/" element={<DefaultRoute />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
