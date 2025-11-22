import React from 'react';
import { Chip } from '@mui/material';

const CategoryBadge = ({ category, size = 'medium' }) => {
  return (
    <Chip
      label={category}
      color="info"
      size={size}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default CategoryBadge;
