import React from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({
  children,
  hoverScale = 1.02,
  animationDelay = 0,
  sx = {},
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          ...sx,
        }}
        {...props}
      >
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
