import { useEffect, useState } from "react";
import { Typography, Alert, Backdrop, Box } from "@mui/material";
import IssueCard from "../../../components/issues/IssueCard";
import UpdateIssue from "./UpdateIssue";
import DeleteIssue from "./DeleteIssue";

function IssueList({ issues, onUpvote, onUpdateIssue, onDeleteIssue }) {
  const [votedIssues, setVotedIssues] = useState([]);
  const [editingIssue, setEditingIssue] = useState(null);
  const [deletingIssue, setDeletingIssue] = useState(null);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
    setVotedIssues(storedVotes);
  }, []);

  const handleUpvoteClick = async (id) => {
    if (votedIssues.includes(id)) return;

    await onUpvote(id);

    const updated = [...votedIssues, id];
    setVotedIssues(updated);
    localStorage.setItem("votedIssues", JSON.stringify(updated));
  };

  const handleUpdate = (updatedIssue) => {
    onUpdateIssue(updatedIssue);
    setEditingIssue(null);
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          // color: "#fff",
          mb: 3,
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}>
        Reported Issues
      </Typography>

      {issues.length === 0 ? (
        <Alert severity="info">No issues match your filters.</Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
          }}>
          {issues.map((issue, index) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              hasVoted={votedIssues.includes(issue._id)}
              onUpvote={() => handleUpvoteClick(issue._id)}
              onEdit={() => setEditingIssue(issue)}
              onDelete={() => setDeletingIssue(issue)}
              animationDelay={index * 0.08}
            />
          ))}
        </Box>
      )}

      {/* Modals */}
      {editingIssue && (
        <Backdrop open sx={{ zIndex: 2000 }}>
          <UpdateIssue
            issue={editingIssue}
            onClose={() => setEditingIssue(null)}
            onUpdate={handleUpdate}
          />
        </Backdrop>
      )}

      {deletingIssue && (
        <DeleteIssue
          issue={deletingIssue}
          onClose={() => setDeletingIssue(null)}
          onDeleteSuccess={(id) => {
            onDeleteIssue(id);
            setDeletingIssue(null);
          }}
        />
      )}
    </div>
  );
}

export default IssueList;
