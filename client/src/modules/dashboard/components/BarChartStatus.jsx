// BarChartStatus.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Box } from "@mui/material";

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
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status Distribution
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
            Status Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1976d2" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
