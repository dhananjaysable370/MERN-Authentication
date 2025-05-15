/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Loader } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { BACKEND_URL, isLoading, setIsLoading } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const calculateStrength = (pass) => {
      let strength = 0;
      if (pass.length >= 8) strength += 1;
      if (/[A-Z]/.test(pass)) strength += 1;
      if (/[0-9]/.test(pass)) strength += 1;
      if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
      return strength;
    };

    const strength = calculateStrength(password);
    setPasswordStrength(strength);
    setIsPasswordStrong(strength >= 3);
  }, [password]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/reset-password/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        toast.success(data.message, {
          style: {
            background: "rgba(32, 56, 70, 0.6)",
            color: "#fff",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          },
        });
      }
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Error resetting password",{
          style: {
            background: "rgba(32, 56, 70, 0.6)",
            color: "#fff",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          },
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-sky-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="size-5 text-teal-500" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition duration-200"
            />
          </div>

          <PasswordStrengthMeter
            password={password}
            onStrengthChange={setPasswordStrength}
          />

          {!isPasswordStrong && password.length > 0 && (
            <p className="text-yellow-500 text-sm mt-2">
              Please create a stronger password to continue
            </p>
          )}
          <motion.button
            whileHover={{ scale: isPasswordStrong ? 1.02 : 1 }}
            whileTap={{ scale: isPasswordStrong ? 0.98 : 1 }}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            type="submit"
            disabled={isLoading || !isPasswordStrong}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <Loader className="animate-spin " />
                <p>Updating...</p>
              </div>
            ) : (
              "Update Password"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
export default ResetPassword;
