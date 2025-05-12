import React from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    setAuthUser,
    authUser,
    removeLocalStorage,
  } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const hadleLogout = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        toast.success(data.message);
        removeLocalStorage();
        setAuthUser(null);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      {isLoggedIn && (
        <>
          <h1>Welcome! {authUser.name}</h1> <br />
          <button onClick={hadleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
