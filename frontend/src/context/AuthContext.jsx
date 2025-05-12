import React, { useContext, useState } from "react";
const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setLocalStorage = (token) => {
    return localStorage.setItem("token", token);
  };

  const removeLocalStorage = () => {
    return localStorage.removeItem("token");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };
  const value = {
    authUser,
    isLoggedIn,
    setAuthUser,
    setIsLoggedIn,
    setLocalStorage,
    removeLocalStorage,
    getToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
