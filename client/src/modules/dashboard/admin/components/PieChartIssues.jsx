import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "var(--accent)", 
  "var(--status-open)", 
  "var(--status-warn)", 
  "var(--status-done)",
  "var(--ink-secondary)"
];

export default function PieChartIssues({ issues = [] }) {
  // Compute counts per category
  const categoryCounts = issues.reduce((acc, issue) => {
    const cat = issue.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  if (total === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
        <span style={{ fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
          No data available
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: 250 }}>
      {/* Center total */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "var(--ink-secondary)",
          pointerEvents: "none"
        }}>
        {total} Total
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={3}
            label
            cornerRadius={5}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              boxShadow: "var(--shadow-md)",
              backgroundColor: "var(--surface-base)",
              border: "1px solid var(--border-subtle)",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "var(--ink-primary)", fontWeight: "bold" }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: "0.9rem", color: "var(--ink-secondary)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
