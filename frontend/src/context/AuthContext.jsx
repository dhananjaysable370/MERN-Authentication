import axios from "axios";
import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [authUser, setAuthUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [errors, setErrors] = useState(null);

  const checkAuth = async () => {
  axios.defaults.withCredentials = true;
  setLoadingSpinner(true);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const { data } = await axios.get(`${BACKEND_URL}/check-auth`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (data.success) {
      setAuthUser(data.user);
      setIsLoggedIn(true);
    }
  } catch (e) {
    setAuthUser(null);
    setIsLoggedIn(false);
    setErrors(e?.response?.data?.message || "Authentication check timed out");
  } finally {
    setLoadingSpinner(false);
  }
};

  const value = {
    BACKEND_URL,
    authUser,
    isLoggedIn,
    setAuthUser,
    setIsLoggedIn,
    checkAuth,
    isLoading,
    setIsLoading,
    loadingSpinner,
    setLoadingSpinner,
    errors,
    setErrors,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
