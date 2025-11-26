import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const RoleToggle = ({
  value,
  onChange,
  options = ["user", "admin"],
  labels = { user: "User", admin: "Admin" },
  animationDelay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      style={{
        display: "flex",
        justifyContent: "space-around",
        position: "relative",
        background: "#f5f5f5",
        borderRadius: "12px",
        padding: "4px",
        marginBottom: "24px",
      }}>
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => onChange(option)}
          sx={{
            flex: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: value === option ? "bold" : 500,
            color: value === option ? "black" : "gray",
            background: "transparent",
          }}>
          {labels[option] || option}
        </Button>
      ))}

      <motion.div
        layoutId="role-underline"
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        style={{
          position: "absolute",
          bottom: 4,
          left: value === options[0] ? "4px" : "50%",
          width: `calc(50% - 8px)`,
          height: "4px",
          borderRadius: "2px",
          background: "#1976d2",
        }}
      />
    </motion.div>
  );
};

export default RoleToggle;
