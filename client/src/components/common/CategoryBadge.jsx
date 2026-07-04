import React from "react";
import { getCategoryConfig } from "../../constant/Categoryconfig";

const CategoryBadge = ({ category, size = "medium" }) => {
  const config = getCategoryConfig(category);
  return (
    <span
      className="badge badge-category"
      style={{
        fontWeight: 500,
        background: `${config.color}1A`, // 10% opacity
        color: config.color,
        border: `1px solid ${config.color}40`,
        fontSize: size === "small" ? 11 : 13,
        padding: size === "small" ? "2px 8px" : "4px 12px",
      }}
    >
      {config.icon} {config.label}
    </span>
  );
};

export default CategoryBadge;
