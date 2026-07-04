import React from "react";

export default function StatsOverviewCard({ stats, sx = {} }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: 24,
        ...sx,
      }}>
      <h6 style={{ margin: "0 0 16px 0", fontWeight: 700, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
        📊 Overview
      </h6>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Row label="Total Issues" value={stats.total} />

        <div className="divider" style={{ opacity: 0.3 }} />

        <Row label="Open" chipValue={stats.open} color="var(--status-open)" />
        <Row
          label="In Progress"
          chipValue={stats.inProgress}
          color="var(--status-warn)"
        />
        <Row label="Resolved" chipValue={stats.resolved} color="var(--status-done)" />
      </div>
    </div>
  );
}

function Row({ label, value, chipValue, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>{label}</span>

      {chipValue !== undefined ? (
        <span
          style={{ 
            backgroundColor: color, 
            color: "#fff", 
            fontWeight: 600,
            fontSize: "0.8125rem",
            padding: "2px 8px",
            borderRadius: 16
          }}
        >
          {chipValue}
        </span>
      ) : (
        <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink-primary)" }}>
          {value}
        </span>
      )}
    </div>
  );
}
