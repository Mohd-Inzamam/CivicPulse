// PieChartIssues.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { themeValues } from "../../../../theme/theme";

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
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Issues by Category
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 250,
              }}>
              <Typography variant="body2" color="text.secondary">
                No data available
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Issues by Category
          </Typography>
          <Box sx={{ position: "relative", width: "100%", height: 250 }}>
            {/* Center total */}
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                fontSize: "1.2rem",
                color: "text.secondary",
              }}>
              {total} Total
            </Typography>
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
                      fill={
                        themeValues.chartColors[
                          index % themeValues.chartColors.length
                        ]
                      }
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
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    padding: "8px 12px",
                  }}
                  itemStyle={{ color: "#555", fontWeight: "bold" }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "0.9rem", color: "#555" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
