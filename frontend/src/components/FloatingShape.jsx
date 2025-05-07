import React from "react";
import { motion } from "framer-motion";

const FloatingShape = ({
  color = "bg-blue-500",
  size = "w-16 h-16",
  top = "50%",
  left = "50%",
  delay = 0,
  opacity = 0.2,
  blur = "blur-xl",
}) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} ${blur}`}
      style={{ top, left, opacity }}
      animate={{
        y: ["0%", "50%", "-50%", "0%"],
        x: ["0%", "-50%", "50%", "0%"],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
