import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { setAuthUser, isLoggedIn, setIsLoggedIn, setLocalStorage } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BACKEND_URL}/login`, {
        email,
        password,
      });
      if (data.success) {
        setIsLoggedIn(true);
        toast.success(data.message);
        console.log(data.user);
        setLocalStorage(data.user.token);
        setAuthUser(data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      {isLoggedIn ? (
        <p>You are already logged in</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button>Submit</button>
        </form>
      )}
    </div>
  );
};

export default Login;
