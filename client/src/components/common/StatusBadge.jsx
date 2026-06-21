import React from "react";
import { Chip } from "@mui/material";
import { getStatusConfig } from "../../constant/Categoryconfig";

const StatusBadge = ({ status, size = "medium" }) => {
  const config = getStatusConfig(status);
  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      size={size}
      sx={{
        fontWeight: 500,
        background: `${config.color}1A`,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    />
  );
};

export default StatusBadge;
