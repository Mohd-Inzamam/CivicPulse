import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import dayjs from "dayjs";

export default function LineChartGrowth({ issues = [] }) {
  // Compute counts per month
  const monthlyCounts = issues.reduce((acc, issue) => {
    // Handle different date field names and formats
    const dateValue = issue.createdAt || issue.created_at || issue.date;
    if (!dateValue) return acc;

    try {
      const month = dayjs(dateValue).format("MMM YYYY"); // e.g., Jan 2025
      if (month && month !== "Invalid Date") {
        acc[month] = (acc[month] || 0) + 1;
      }
    } catch (error) {
      console.warn("Invalid date format for issue:", issue);
    }
    return acc;
  }, {});

  // Convert to array and sort by date
  const data = Object.keys(monthlyCounts)
    .map((month) => ({ date: month, issues: monthlyCounts[month] }))
    .sort((a, b) => {
      const dateA = dayjs(a.date, "MMM YYYY");
      const dateB = dayjs(b.date, "MMM YYYY");
      if (dateA.isValid() && dateB.isValid()) {
        return dateA - dateB;
      }
      return 0;
    });

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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--ink-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ink-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
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
          <Legend wrapperStyle={{ fontSize: "0.9rem", color: "var(--ink-secondary)" }} />
          <Line
            type="monotone"
            dataKey="issues"
            stroke="var(--accent)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "var(--accent)" }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
