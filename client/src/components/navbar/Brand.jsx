import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Brand = () => {
  return (
    <RouterLink
      to="/"
      className="navbar-brand"
      style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
    >
      {/* Bar chart icon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 6px)",
          gap: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 16 + i * 4,
              background: "var(--accent)", // bgcolor: "primary.main"
              borderRadius: 8, // borderRadius: 1 → 1×8 = 8px
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: 17, // variant="h6"
          fontWeight: 800,
          letterSpacing: 1,
          color: "var(--ink-primary)", // color: "text.primary"
        }}
      >
        CIVIC-PULSE
      </span>
    </RouterLink>
  );
};

export default Brand;
