import React from "react";
import PieChartIssues from "./PieChartIssues";
import BarChartStatus from "./BarChartStatus";
import LineChartGrowth from "./LineChartGrowth";

export default function DashboardCharts({ issues }) {
  return (
    <div className="charts-grid" style={{ marginBottom: 32, marginTop: 8 }}>
      {/* Pie Chart */}
      <div className="chart-item-half">
        <div
          className="card chart-card-hover"
          style={{
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-base)",
            boxShadow: "var(--shadow-sm)",
            transition: "0.3s",
          }}>
          <div style={{ padding: 24 }}>
            <h6 style={{ margin: "0 0 16px 0", fontWeight: 600, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
              Category Distribution
            </h6>
            <PieChartIssues issues={issues} />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="chart-item-half">
        <div
          className="card chart-card-hover"
          style={{
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-base)",
            boxShadow: "var(--shadow-sm)",
            transition: "0.3s",
          }}>
          <div style={{ padding: 24 }}>
            <h6 style={{ margin: "0 0 16px 0", fontWeight: 600, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
              Issue Growth Over Time
            </h6>
            <LineChartGrowth issues={issues} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-item-full">
        <div
          className="card chart-card-hover"
          style={{
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-base)",
            boxShadow: "var(--shadow-sm)",
            transition: "0.3s",
          }}>
          <div style={{ padding: 24 }}>
            <h6 style={{ margin: "0 0 16px 0", fontWeight: 600, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
              Status Overview
            </h6>
            <BarChartStatus issues={issues} />
          </div>
        </div>
      </div>
      
      <style>{`
        .charts-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr 1fr;
          }
          .chart-item-full {
            grid-column: span 2;
          }
        }
        .chart-card-hover:hover {
          box-shadow: var(--shadow-md) !important;
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}
