import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Skeleton,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";
import SummaryCards from "../components/SummaryCards.jsx";
import DashboardCharts from "../components/DashboardCharts.jsx";
import { issuesService } from "../../../../services/issuesService.js";
import { API_BASE_URL } from "../../../../config/api.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

function CivicInsightCard() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchInsight = useCallback(async () => {
    setLoading(true);
    setVisible(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/civic-insight`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      setInsight(
        data.data?.insight ||
          data.insight ||
          "Keep monitoring issue trends and prioritise long-standing open cases.",
      );
    } catch {
      setInsight(
        "Keep monitoring issue trends and prioritise long-standing open cases for faster community impact.",
      );
    } finally {
      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    }
  }, []);

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(25,118,210,0.2)",
        background:
          "linear-gradient(135deg, rgba(25,118,210,0.05), rgba(66,165,245,0.03))",
        boxShadow: "0 2px 16px rgba(25,118,210,0.08)",
        mb: 4,
      }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontSize: 11,
                color: "text.secondary",
                fontWeight: 600,
              }}>
              AI Civic Insight
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
            onClick={fetchInsight}
            disabled={loading}
            sx={{ fontSize: 12, textTransform: "none", py: 0.25 }}>
            Refresh
          </Button>
        </Box>

        {loading ? (
          <Box>
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="75%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4 }}>
            <Typography
              variant="body2"
              sx={{ lineHeight: 1.75, color: "text.primary", fontSize: 14 }}>
              {insight}
            </Typography>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await issuesService.getAllIssues();
        setIssues(response.data?.issues || response.issues || []);
      } catch {
        setError("Failed to load issues. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = issues.length;
  const openCount = issues.filter((i) => i.status === "Open").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress",
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  const summary = [
    { label: "Total Issues", count: total, color: "primary" },
    { label: "Open", count: openCount, color: "error" },
    { label: "In Progress", count: inProgressCount, color: "warning" },
    { label: "Resolved", count: resolvedCount, color: "success" },
  ];

  const recentIssues = issues.slice(0, 5);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Quick insight into system activity &amp; ongoing issues.
      </Typography>

      {/* AI Insight Card */}
      <CivicInsightCard />

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {summary.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <SummaryCards item={item} index={i} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <DashboardCharts issues={issues} type="pie" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCharts issues={issues} type="line" />
        </Grid>
      </Grid>

      {/* Recent Issues */}
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Recent Issues
          </Typography>
          {recentIssues.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}>
              No issues yet.
            </Typography>
          ) : (
            recentIssues.map((issue, index) => (
              <Box key={issue._id || index} sx={{ py: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {issue.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reported by: {issue.createdBy?.fullName || "Unknown"} · 📍{" "}
                  {issue.location}
                </Typography>
                <Chip
                  label={issue.status}
                  size="small"
                  color={
                    issue.status === "Open"
                      ? "error"
                      : issue.status === "In Progress"
                        ? "warning"
                        : "success"
                  }
                  sx={{ mt: 1 }}
                />
                {index !== recentIssues.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
