import React from "react";
import { getStatusConfig } from "../../constant/Categoryconfig";

const StatusBadge = ({ status, size = "medium" }) => {
  const config = getStatusConfig(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 500,
        background: `${config.color}1A`,
        color: config.color,
        border: `1px solid ${config.color}40`,
        borderRadius: "var(--radius-pill)",
        fontSize: size === "small" ? 11 : 13,
        padding: size === "small" ? "2px 8px" : "4px 12px",
        lineHeight: 1.4,
      }}
    >
      {config.icon} {config.label}
    </span>
  );
};

export default StatusBadge;
