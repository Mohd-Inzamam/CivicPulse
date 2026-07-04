import React from "react";

export default function NoIssuesCard({ onReport }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div
          className="card"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: 32,
            textAlign: "center",
          }}>
          <div className="card-body">
            <h4 style={{ margin: "0 0 16px 0", fontWeight: 700, fontSize: "2.125rem", color: "var(--ink-primary)" }}>
              🚀 No Issues Found
            </h4>

            <p style={{ margin: "0 0 24px 0", fontSize: "1rem", color: "var(--ink-primary)" }}>
              Be the first to raise a concern and make a difference!
            </p>

            <button className="btn btn-primary btn-lg" onClick={onReport}>
              Report an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
