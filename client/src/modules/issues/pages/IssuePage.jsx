import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Typography } from "@mui/material";
import IssueList from "./IssueList";
import ReportIssue from "./ReportIssue";
import { issuesService } from "../../../services/issuesService";

function IssuePage({ filters }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch issues from backend on mount

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await issuesService.getAllIssues();
        console.log("Issues fetched from backend:", response);

        const fetchedIssues = response.data?.issues || response.issues || [];
        setIssues(fetchedIssues.filter(Boolean));
      } catch (err) {
        console.error("Failed to load issues:", err);
        setError("Failed to load issues. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Function to add a new issue
  const addIssue = async (newIssueData) => {
    try {
      const response = await issuesService.createIssue(newIssueData);
      console.log("Issue created:", response);

      const createdIssue = response.data?.issue || response.issue;

      if (createdIssue) {
        setIssues((prev) => [createdIssue, ...prev]);
      } else {
        const refreshResponse = await issuesService.getAllIssues();
        const refreshedIssues =
          refreshResponse.data?.issues || refreshResponse.issues || [];
        setIssues(refreshedIssues);
      }

      return createdIssue;
    } catch (err) {
      console.error("Failed to create issue:", err);
      throw err;
    }
  };

  // ADDED: Handle Upvote
  const handleUpvote = async (issueId) => {
    try {
      const response = await issuesService.upvoteIssue(issueId);

      const updatedUpvotes =
        response?.data?.data?.upvotes ||
        response?.data?.upvotes ||
        response?.upvotes;

      if (!updatedUpvotes && updatedUpvotes !== 0) {
        console.error("Invalid upvote response:", response);
        return;
      }

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? { ...issue, upvotes: updatedUpvotes } : issue
        )
      );
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const hasIssues = issues.length > 0;

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h6" color="textSecondary">
          Loading issues...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <AnimatePresence mode="wait">
        {!hasIssues ? (
          <motion.div
            key="no-issues"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 col-sm-12">
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: "16px",
                    mb: 3,
                    textAlign: "center",
                    py: 4,
                  }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      color="textSecondary"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}>
                      🚀 No issues found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Be the first to raise a concern!
                    </Typography>
                  </CardContent>
                </Card>

                <ReportIssue addIssue={addIssue} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="with-issues"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}>
            <div className="row">
              <motion.div
                className="col-lg-7 col-md-12 mb-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                {/* ⬇️⬇️⬇️ Pass handleUpvote */}
                <IssueList
                  issues={issues}
                  onUpvote={handleUpvote}
                  onUpdateIssue={(updatedIssue) =>
                    setIssues((prev) =>
                      prev.map((issue) =>
                        issue._id === updatedIssue._id ? updatedIssue : issue
                      )
                    )
                  }
                  onDeleteIssue={(deletedId) =>
                    setIssues((prev) =>
                      prev.filter((issue) => issue._id !== deletedId)
                    )
                  }
                />
              </motion.div>

              <motion.div
                className="col-lg-5 col-md-12"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}>
                <ReportIssue addIssue={addIssue} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IssuePage;
