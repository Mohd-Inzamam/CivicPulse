import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import SummaryCards from "../components/SummaryCards.jsx";
import DashboardCharts from "../components/DashboardCharts.jsx";
import IssuesTable from "../components/IssuesTable.jsx";
import { issuesService } from "../../../../services/issuesService.js";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await issuesService.getAllIssues();
        const fetchedIssues = response.data?.issues || response.issues || [];
        setIssues(fetchedIssues);
      } catch (err) {
        console.error("Failed to load issues:", err);
        setError("Failed to load issues. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await issuesService.updateIssueStatus(id, newStatus);
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id || issue.id === id
            ? { ...issue, status: newStatus }
            : issue
        )
      );
    } catch (err) {
      console.error("Failed to update issue status:", err);
      setError("Failed to update issue status. Please try again.");
    }
  };

  // Summary calculations
  const total = issues.length;
  const openCount = issues.filter((i) => i.status === "Open").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  const summary = [
    { label: "Total Issues", count: total, color: "primary" },
    { label: "Open", count: openCount, color: "error" },
    { label: "In Progress", count: inProgressCount, color: "warning" },
    { label: "Resolved", count: resolvedCount, color: "success" },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's the latest overview of reported issues.
        </Typography>
      </Box>
      {/* SUMMARY CARDS */}
      <Grid container spacing={3} mb={4}>
        {summary.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <SummaryCards item={item} index={index} />
          </Grid>
        ))}
      </Grid>
      {/* CHARTS */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <DashboardCharts issues={issues} type="pie-line" />
        </Grid>
      </Grid>
      {/* CHARTS */}

      {/* <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCharts issues={issues} type="category-distribution" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCharts issues={issues} type="issue-growth" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCharts issues={issues} type="status-overview" />
        </Grid>
      </Grid> */}
      {/* ISSUES TABLE */}
      <Box>
        <IssuesTable issues={issues} handleStatusChange={handleStatusChange} />
      </Box>
    </Box>
  );
};

export default Dashboard;
