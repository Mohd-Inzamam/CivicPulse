import React from "react";

const COLORS = ["var(--ink-primary)", "var(--status-open)", "var(--status-warn)", "var(--status-done)"];

export default function SummaryCards({ item, index }) {
  return (
    <div style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.15}s both` }}>
      <div
        className="card kpi-hover-card"
        style={{
          borderRadius: "var(--radius-xl)",
          textAlign: "center",
          background: "var(--surface-base)",
          padding: "16px 8px",
          transition: "0.3s",
        }}>
        <div style={{ padding: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
              alignItems: "center"
            }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: 8,
              }}
            />
            <span style={{ fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
              {item.label}
            </span>
          </div>

          <div style={{ fontSize: "2.125rem", fontWeight: 700, color: "var(--ink-primary)" }}>
            {item.count}
          </div>
        </div>
      </div>
      
      <style>{`
        .kpi-hover-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
}
