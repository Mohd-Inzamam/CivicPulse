import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Container,
  Stack,
  CircularProgress,
  Typography,
  useTheme,
  Button,
  Card,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import IssueList from "./IssueList";
import { issuesService } from "../../../services/issuesService";

// Reusable Components
import StatsOverviewCard from "../components/StatsOverviewCard";
import CategoryStatsCard from "../components/CategoryStatsCard";
import EngagementStatsCard from "../components/EngagementStatsCard";
import NoIssuesCard from "../components/NoIssuesCard";

function IssuePage({ filters }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const glass = theme.palette.glass || {
    background:
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.35)"
        : "rgba(255, 255, 255, 0.25)",
    border:
      theme.palette.mode === "dark"
        ? "1px solid rgba(255,255,255,0.15)"
        : "1px solid rgba(255,255,255,0.35)",
    blur: "18px",
    shadow:
      theme.palette.mode === "dark"
        ? "0 4px 25px rgba(0,0,0,0.3)"
        : "0 4px 20px rgba(0,0,0,0.1)",
  };

  // Compute statistics
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status?.toLowerCase() === "open").length,
    inProgress: issues.filter((i) => i.status?.toLowerCase() === "in progress")
      .length,
    resolved: issues.filter((i) => i.status?.toLowerCase() === "resolved")
      .length,
    byCategory: issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {}),
    totalUpvotes: issues.reduce((sum, i) => sum + (i.upvotes || 0), 0),
    mostUpvoted: [...issues].sort(
      (a, b) => (b.upvotes || 0) - (a.upvotes || 0)
    )[0],
  };

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await issuesService.getAllIssues();
        setIssues(response.data?.issues || response.issues || []);
      } catch (err) {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  console.log("Issue response", issues);

  const handleUpvote = async (issueId) => {
    try {
      const response = await issuesService.upvoteIssue(issueId);
      const updatedUpvotes =
        response?.data?.data?.upvotes ||
        response?.data?.upvotes ||
        response?.upvotes;

      setIssues((prev) =>
        prev.map((i) =>
          i._id === issueId ? { ...i, upvotes: updatedUpvotes } : i
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "50vh" }}>
          <CircularProgress size={60} />
          <Typography mt={2}>Loading issues...</Typography>
        </Stack>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Card sx={{ p: 4 }}>{error}</Card>
      </Container>
    );

  const hasIssues = issues.length > 0;
  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <AnimatePresence mode="wait">
          {!hasIssues ? (
            <NoIssuesCard
              glass={glass}
              onReport={() => navigate("/report-issue")}
            />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Grid container spacing={4}>
                {/* STATS — Top Horizontal */}
                <Grid item xs={12}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ width: "100%", justifyContent: "flex-start" }}>
                    <StatsOverviewCard
                      stats={stats}
                      glass={glass}
                      sx={{ minWidth: 300, maxWidth: 400 }}
                    />
                    <CategoryStatsCard
                      stats={stats}
                      glass={glass}
                      sx={{ minWidth: 300, maxWidth: 400 }}
                    />
                    <EngagementStatsCard
                      stats={stats}
                      glass={glass}
                      sx={{ minWidth: 300, maxWidth: 400 }}
                    />
                  </Stack>

                  <Box sx={{ mt: 1, opacity: 0.5 }}>
                    <Typography variant="caption">
                      Insights update when new issues are reported or actions
                      performed.
                    </Typography>
                  </Box>
                </Grid>
                {/* ISSUES BELOW */}
                <Grid item xs={12}>
                  <Stack
                    spacing={3}
                    sx={{ mt: 2, height: "calc(100vh - 300px)" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      {/* <Typography variant="h4" fontWeight={700}>
                        Reported Issues
                      </Typography> */}

                      <Button
                        variant="contained"
                        onClick={() => navigate("/report-issue")}>
                        + Report Issue
                      </Button>
                    </Box>

                    <Box flexGrow={1}>
                      <IssueList
                        issues={issues}
                        onUpvote={handleUpvote}
                        onUpdateIssue={(u) =>
                          setIssues((prev) =>
                            prev.map((i) => (i._id === u._id ? u : i))
                          )
                        }
                        onDeleteIssue={(id) =>
                          setIssues((prev) => prev.filter((i) => i._id !== id))
                        }
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}

export default IssuePage;
