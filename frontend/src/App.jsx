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
      <div
        className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
      >
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
          <Route path="/verify-email" element={<VerifyEmail />} />

          {!isLoggedIn ? (
            <>
              <Route path="/register" element={<Register />} />
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
