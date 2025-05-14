import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/VerifyEmail";
import { useAuth } from "./context/AuthContext";
import FloatingShape from "./components/FloatingShape";
import { Toaster } from "sonner";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

const App = () => {
  const { isLoggedIn, checkAuth, authUser, loadingSpinner } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [isLoggedIn]);

  if (loadingSpinner) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-sky-900 to-teal-900 flex items-center justify-center relative overflow-hidden">
        {/* App Logo - visible on all pages */}
        <div className="absolute top-6 left-6 z-10">
          <img src="/logo.svg" alt="App Logo" className="h-12 w-auto" />
        </div>

        <FloatingShape
          color="bg-sky-500"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-teal-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />
        <FloatingShape
          color="bg-cyan-500"
          size="w-46 h-46"
          top="10%"
          left="70%"
          delay={7}
        />
        <Routes>
          <Route path="/verify-email" element={<VerifyEmail />} />

          {!isLoggedIn ? (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : !authUser?.isVerified ? (
            location.pathname !== "/verify-email" ? (
              <Route
                path="*"
                element={<Navigate to="/verify-email" replace />}
              />
            ) : (
              <Route path="/verify-email" element={<VerifyEmail />} />
            )
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
