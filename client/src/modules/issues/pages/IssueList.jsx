import { useEffect, useState } from "react";
import { Typography, Alert } from "@mui/material";
import IssueCard from "../../../components/issues/IssueCard";

function IssueList({ issues, setIssues }) {
  const [votedIssues, setVotedIssues] = useState([]);

  // Load voted issues from localStorage on mount
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
    setVotedIssues(storedVotes);
  }, []);

  // Handle upvote click
  const handleUpvote = (id) => {
    if (votedIssues.includes(id)) return;

    // update issues state
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );

    // update votedIssues state + persist to localStorage
    const updatedVotes = [...votedIssues, id];
    setVotedIssues(updatedVotes);
    localStorage.setItem("votedIssues", JSON.stringify(updatedVotes));
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
        Reported Issues
      </Typography>

      {issues.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            borderRadius: 3,
            boxShadow: 1,
            "& .MuiAlert-message": {
              fontWeight: "bold",
            },
          }}>
          <strong>No issues match your filters.</strong>
          <br />
          Try adjusting search, category, or status filters.
        </Alert>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {issues.map((issue, index) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onUpvote={handleUpvote}
              hasVoted={votedIssues.includes(issue.id)}
              animationDelay={index * 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default IssueList;
