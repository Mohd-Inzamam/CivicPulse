import React from "react";

const RoleToggle = ({
  value,
  onChange,
  options = ["user", "admin"],
  labels = { user: "User", admin: "Admin" },
  animationDelay = 0, // kept for API compat, no animation
}) => {
  return (
    <div
      className="role-toggle"
      style={{
        display: "flex",
        justifyContent: "space-around",
        position: "relative",
        background: "var(--surface-subtle)",
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
      }}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`role-toggle-btn${value === option ? " active" : ""}`}
          onClick={() => onChange(option)}
          style={{
            flex: 1,
            borderRadius: 10,
            border: "none",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: value === option ? 700 : 500,
            color: value === option ? "var(--ink-primary)" : "var(--ink-tertiary)",
            background: value === option ? "var(--surface-base)" : "transparent",
            boxShadow: value === option ? "var(--shadow-xs)" : "none",
            transition: "all var(--transition-base)",
          }}
        >
          {labels[option] || option}
        </button>
      ))}

      {/* Underline indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: value === options[0] ? "4px" : "50%",
          width: "calc(50% - 8px)",
          height: 4,
          borderRadius: 2,
          background: "var(--accent)",
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
};

export default RoleToggle;
