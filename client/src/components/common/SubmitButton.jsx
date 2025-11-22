import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const SubmitButton = ({
  children = 'Submit',
  loading = false,
  disabled = false,
  fullWidth = true,
  variant = 'contained',
  color = 'primary',
  size = 'large',
  sx = {},
  animationDelay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
    >
      <Button
        type="submit"
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        sx={{
          py: 1.2,
          borderRadius: 2,
          fontWeight: 'bold',
          textTransform: 'none',
          ...sx,
        }}
        {...props}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
};

export default SubmitButton;
