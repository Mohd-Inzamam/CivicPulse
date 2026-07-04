import React from "react";

export default function CategoryStatsCard({ stats, sx = {} }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: 24,
        ...sx,
      }}>
      <h6 style={{ margin: "0 0 16px 0", fontWeight: 700, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
        🏷️ By Category
      </h6>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(stats.byCategory).map(([cat, count]) => (
          <div
            key={cat}
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "var(--surface-subtle)",
              padding: 12,
              borderRadius: "var(--radius-md)",
            }}>
            <span style={{ textTransform: "capitalize", color: "var(--ink-primary)" }}>{cat}</span>
            <span style={{ fontWeight: 700, color: "var(--ink-primary)" }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
