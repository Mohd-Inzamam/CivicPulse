import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import SummaryCards from "../components/SummaryCards";
import DashboardCharts from "../components/DashboardCharts";
import IssuesTable from "../components/IssuesTable";
import { issuesService } from "../../../../services/issuesService";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changedId, setChangedId] = useState(null);

  // Fetch issues from backend on mount
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await issuesService.getAllIssues();
        console.log("Issues fetched from backend for Dashboard:", response);

        // ✅ Adjust based on your backend response structure
        // Your backend probably returns: { data: { issues: [...] } }
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
  }, []); // Only fetch once on mount

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update status via API
      await issuesService.updateIssueStatus(id, newStatus);

      // Update local state immediately for instant feedback
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id || issue.id === id
            ? { ...issue, status: newStatus }
            : issue
        )
      );

      setChangedId(id);
      setTimeout(() => setChangedId(null), 800);
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
      <Container
        fluid
        className="mt-4"
        sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
        <Row className="justify-content-center">
          <Col md={10}>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Typography variant="h6" color="textSecondary">
                Loading dashboard...
              </Typography>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="mt-4"
        sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
        <Row className="justify-content-center">
          <Col md={10}>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="mt-4"
      sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col md={10}>
          <SummaryCards summary={summary} />
          <DashboardCharts issues={issues} />
          <IssuesTable
            issues={issues}
            handleStatusChange={handleStatusChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
