import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const { name, setName, email, password, setEmail, setPassword, setUser } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setUser(data.user);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Register;
