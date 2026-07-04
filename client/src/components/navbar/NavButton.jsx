import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const NavButton = ({ to, label, icon }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));

  return (
    <div style={{ position: "relative" }}>
      <RouterLink
        to={to}
        className={`navbar-link${active ? " active" : ""}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: active ? "var(--accent)" : "var(--ink-tertiary)", // primary.main / text.secondary
          fontWeight: active ? 700 : 500,
          textDecoration: "none",
          borderRadius: 16, // borderRadius: 2 → 2×8 = 16px
          paddingLeft: 16, // px: 2 → 16px
          paddingRight: 16,
          paddingTop: 4, // py: 0.5 → 4px
          paddingBottom: 4,
          transition: "all 0.25s ease",
          fontSize: 14,
        }}
      >
        {icon}
        {label}
      </RouterLink>
      {active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -6,
            height: 3,
            borderRadius: 999,
            background: "currentColor",
            opacity: 0.85,
          }}
        />
      )}
    </div>
  );
};

export default NavButton;
