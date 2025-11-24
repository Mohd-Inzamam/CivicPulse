import { useEffect, useState } from "react";
import { Typography, Alert, Backdrop } from "@mui/material";
import IssueCard from "../../../components/issues/IssueCard";
import UpdateIssue from "./UpdateIssue";
import DeleteIssue from "./DeleteIssue";

function IssueList({ issues, onUpvote, onUpdateIssue, onDeleteIssue }) {
  const [votedIssues, setVotedIssues] = useState([]);
  const [editingIssue, setEditingIssue] = useState(null);
  const [deletingIssue, setDeletingIssue] = useState(null);

  // Load voted issues from localStorage on mount
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
    setVotedIssues(storedVotes);
  }, []);

  // Handle upvote click: CALL IssuePage handler, then update local votedIssues
  const handleUpvoteClick = async (id) => {
    if (votedIssues.includes(id)) return;

    await onUpvote(id); // 🔥 The actual backend call is done in IssuePage.jsx

    const updatedVotes = [...votedIssues, id];
    setVotedIssues(updatedVotes);
    localStorage.setItem("votedIssues", JSON.stringify(updatedVotes));
  };

  // Handle successful update
  const handleUpdate = (updatedIssue) => {
    onUpdateIssue(updatedIssue);
    setEditingIssue(null);
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
              onUpvote={() => handleUpvoteClick(issue._id)} // ⬅️ Correct flow
              hasVoted={votedIssues.includes(issue._id)}
              animationDelay={index * 0.1}
              onEdit={() => setEditingIssue(issue)}
              onDelete={() => setDeletingIssue(issue)}
            />
          ))}
        </div>
      )}

      {/* UpdateIssue Modal */}
      {editingIssue && (
        <Backdrop
          open={true}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
          onDeleteSuccess={(deletedId) => {
            onDeleteIssue(deletedId);
            setDeletingIssue(null);
          }}
        />
      )}
    </div>
  );
}

export default IssueList;
