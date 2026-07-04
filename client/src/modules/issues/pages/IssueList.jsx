import { useEffect, useState } from "react";
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
      <h4
        style={{
          fontWeight: "bold",
          marginBottom: 24,
          fontSize: "2.125rem",
          color: "var(--ink-primary)"
        }}>
        Reported Issues
      </h4>

      {issues.length === 0 ? (
        <div style={{
          padding: "16px 24px",
          borderRadius: 8,
          background: "var(--surface-subtle)",
          color: "var(--ink-primary)",
          border: "1px solid var(--border-subtle)"
        }}>
          No issues match your filters.
        </div>
      ) : (
        <div
          className="issue-list-grid"
          style={{
            display: "grid",
            gap: 24,
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
        </div>
      )}

      {/* Modals */}
      {editingIssue && (
        <div className="modal-backdrop" style={{ zIndex: 2000 }}>
          <UpdateIssue
            issue={editingIssue}
            onClose={() => setEditingIssue(null)}
            onUpdate={handleUpdate}
          />
        </div>
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
      
      <style>{`
        .issue-list-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .issue-list-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .issue-list-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default IssueList;
