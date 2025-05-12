import React from "react";
import Dashboard from "./Pages/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isLoggedIn, getToken } = useAuth();

  return (
    <Routes>
      {getToken && isLoggedIn ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};

export default App;
