import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    const levels = {
      0: { label: 'Very Weak', color: 'error', value: 0 },
      1: { label: 'Weak', color: 'error', value: 20 },
      2: { label: 'Fair', color: 'warning', value: 40 },
      3: { label: 'Good', color: 'info', value: 60 },
      4: { label: 'Strong', color: 'success', value: 80 },
      5: { label: 'Very Strong', color: 'success', value: 100 },
    };

    return {
      score,
      ...levels[score],
      checks,
    };
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mt: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Password Strength
          </Typography>
          <Typography variant="caption" color={`${strength.color}.main`} sx={{ fontWeight: 'bold' }}>
            {strength.label}
          </Typography>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={strength.value}
          color={strength.color}
          sx={{ height: 6, borderRadius: 3, mb: 1 }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(strength.checks).map(([key, passed]) => (
            <Typography
              key={key}
              variant="caption"
              sx={{
                color: passed ? 'success.main' : 'text.disabled',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {passed ? '✓' : '○'} {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PasswordStrengthIndicator;
