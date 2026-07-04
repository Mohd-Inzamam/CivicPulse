import React from "react";

export default function EngagementStatsCard({ stats, sx = {} }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: 24,
        ...sx,
      }}>
      <h6 style={{ margin: "0 0 16px 0", fontWeight: 700, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
        👍 Engagement
      </h6>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>Total Upvotes</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink-primary)" }}>
            {stats.totalUpvotes}
          </span>
        </div>

        {stats.mostUpvoted && (
          <>
            <div className="divider" style={{ opacity: 0.3 }} />
            <div>
              <span style={{ fontSize: "0.75rem", opacity: 0.7, display: "block", marginBottom: 4, color: "var(--ink-primary)" }}>
                Most Popular
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: 4, color: "var(--ink-primary)" }}>
                {stats.mostUpvoted.title}
              </span>

              <span
                style={{ 
                  marginTop: 4,
                  display: "inline-block",
                  fontSize: "0.8125rem",
                  background: "var(--surface-subtle)",
                  padding: "2px 8px",
                  borderRadius: 16,
                  color: "var(--ink-primary)"
                }}
              >
                {stats.mostUpvoted.upvotes || 0} votes
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
