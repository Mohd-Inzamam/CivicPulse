import React from "react";
import { TextField } from "@mui/material";
import { motion } from "framer-motion";

const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = "text",
  fullWidth = true,
  margin = "normal",
  multiline = false,
  rows = 1,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  animationDelay = 0,
  ...props
}) => {
  return (
    <motion.div
      style={{ width: "100%" }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        fullWidth={fullWidth}
        margin={margin}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        error={Boolean(error)}
        helperText={error || helperText}
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

export default FormField;
