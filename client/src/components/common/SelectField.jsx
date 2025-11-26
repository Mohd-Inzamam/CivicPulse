import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { motion } from "framer-motion";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  options = [],
  fullWidth = true,
  margin = "normal",
  disabled = false,
  required = false,
  placeholder = "Select an option",
  animationDelay = 0,
  ...props
}) => {
  return (
    <motion.div
      style={{ width: "100%" }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}>
      <FormControl
        fullWidth={fullWidth}
        margin={margin}
        error={Boolean(error)}
        disabled={disabled}
        required={required}>
        <InputLabel>{label}</InputLabel>
        <Select
          name={name}
          value={value}
          onChange={onChange}
          label={label}
          sx={{
            borderRadius: 2,
          }}
          {...props}>
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{error || helperText}</FormHelperText>
      </FormControl>
    </motion.div>
  );
};

export default SelectField;
