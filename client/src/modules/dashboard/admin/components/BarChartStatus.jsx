import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function BarChartStatus({ issues = [] }) {
  // Compute counts per status
  const statusCounts = issues.reduce((acc, issue) => {
    const st = issue.status || "Unknown";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status],
  }));

  if (data.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
        <span style={{ fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
          No data available
        </span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="status" stroke="var(--ink-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ink-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: "var(--surface-subtle)" }}
            contentStyle={{
              borderRadius: "8px",
              boxShadow: "var(--shadow-md)",
              backgroundColor: "var(--surface-base)",
              border: "1px solid var(--border-subtle)",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "var(--ink-primary)", fontWeight: "bold" }}
          />
          <Legend wrapperStyle={{ fontSize: "0.9rem", color: "var(--ink-secondary)" }} />
          <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
