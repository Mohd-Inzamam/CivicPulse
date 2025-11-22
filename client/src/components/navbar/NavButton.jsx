import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { motion } from 'framer-motion';

const NavButton = ({ to, label, icon }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));

  const ActiveUnderline = () => (
    <motion.div
      layoutId="nav-underline"
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -6,
        height: 3,
        borderRadius: 999,
        background: 'currentColor',
        opacity: 0.85,
      }}
    />
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        component={RouterLink}
        to={to}
        size="medium"
        startIcon={icon}
        sx={{
          color: active ? 'primary.main' : 'text.secondary',
          fontWeight: active ? 700 : 500,
          textTransform: 'none',
          borderRadius: 2,
          px: 2,
          py: 0.5,
          transition: 'all 0.25s ease',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.04)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {label}
      </Button>
      {active && <ActiveUnderline />}
    </Box>
  );
};

export default NavButton;
