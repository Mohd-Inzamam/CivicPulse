import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const PageCard = ({
  children,
  title,
  subtitle,
  elevation = 6,
  maxWidth = 700,
  sx = {},
  animationDelay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: animationDelay }}
    >
      <Card
        elevation={elevation}
        sx={{
          borderRadius: '20px',
          mt: 3,
          maxWidth,
          mx: 'auto',
          p: 3,
          ...sx,
        }}
        {...props}
      >
        <CardContent>
          {title && (
            <Typography
              variant="h4"
              align="center"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {subtitle}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PageCard;
