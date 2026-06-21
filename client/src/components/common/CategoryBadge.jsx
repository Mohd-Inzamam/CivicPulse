import React from "react";
import { Chip } from "@mui/material";
import { getCategoryConfig } from "../../constants/categoryConfig";

const CategoryBadge = ({ category, size = "medium" }) => {
  const config = getCategoryConfig(category);
  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      size={size}
      sx={{
        fontWeight: 500,
        background: `${config.color}1A`, // 10% opacity
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    />
  );
};

export default CategoryBadge;
