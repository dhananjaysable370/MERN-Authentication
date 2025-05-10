import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import EmailVerify from "./pages/EmailVerify";
import FloatingShape from "./components/FloatingShape";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-transparent">
    <Loader className="w-10 h-10 text-green-500 animate-spin" />
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const checkAuth = useCallback(async (signal) => {
    try {
      const { data } = await api.get("/check-auth", { signal });
      setUser(data.success ? data.user : null);
    } catch (error) {
      if (!axios.isCancel(error)) setUser(null);
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    checkAuth(controller.signal);
    return () => controller.abort();
  }, [checkAuth]);

  const handleAuthUpdate = useCallback(
    (userData) => {
      setUser(userData);
      setTimeout(() => {
        navigate(userData ? "/home" : "/login", { replace: true });
      }, 0);
    },
    [navigate]
  );

  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (authChecked && !isLoading && !user) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
      }
    }, [authChecked, isLoading, user, location.pathname, navigate]);

    if (!authChecked || isLoading) return <LoadingScreen />;
    return user ? (
      <>
        <Navbar user={user} onLogout={() => handleAuthUpdate(null)} />
        {children}
      </>
    ) : null;
  };

  const PublicRoute = ({ children }) => {
    useEffect(() => {
      if (authChecked && !isLoading && user) {
        navigate("/home", { replace: true });
      }
    }, [authChecked, isLoading, user, navigate]);

    if (!authChecked || isLoading) return <LoadingScreen />;
    return !user ? children : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
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
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar user={user} onLogout={() => handleAuthUpdate(null)} />
              <LandingPage />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={handleAuthUpdate} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register onRegister={handleAuthUpdate} />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <ProtectedRoute>
              <EmailVerify user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
