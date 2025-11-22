import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";

const PasswordField = ({
  label = "Password",
  name = "password",
  value,
  onChange,
  onBlur,
  error,
  helperText,
  fullWidth = true,
  margin = "normal",
  placeholder,
  disabled = false,
  required = false,
  autoComplete = "current-password",
  animationDelay = 0,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={showPassword ? "text" : "password"}
        fullWidth={fullWidth}
        margin={margin}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        error={Boolean(error)}
        helperText={error || helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                sx={{ color: "text.secondary" }}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        {...props}
      />
    </motion.div>
  );
};

export default PasswordField;
