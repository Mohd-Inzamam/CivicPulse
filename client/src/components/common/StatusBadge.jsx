import React from 'react';
import { Chip } from '@mui/material';

const StatusBadge = ({ status, size = 'medium' }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'error';
      case 'in progress':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getStatusColor(status)}
      size={size}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default StatusBadge;
