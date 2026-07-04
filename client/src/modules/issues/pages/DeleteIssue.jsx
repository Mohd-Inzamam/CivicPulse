import { useState } from "react";
import { issuesService } from "../../../services/issuesService";

const DeleteIssue = ({ issue, onClose, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await issuesService.deleteIssue(issue._id);
      onDeleteSuccess(issue._id);
    } catch (error) {
      console.error("Failed to delete issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink-primary)", fontWeight: 700 }}>
            Delete Issue
          </h2>
        </div>
        
        <div style={{ padding: 24 }}>
          <p style={{ margin: "0 0 8px 0", color: "var(--ink-primary)" }}>
            Are you sure you want to delete the issue:
          </p>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--ink-primary)" }}>
            "{issue.title}"
          </p>
          <p style={{ marginTop: 16, marginBottom: 0, color: "var(--status-open)", fontWeight: 700 }}>
            ⚠️ This action cannot be undone.
          </p>
        </div>

        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid var(--border-subtle)" }}>
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleDelete}
            disabled={loading}
            style={{
              background: "var(--status-open)",
              borderColor: "var(--status-open)",
              color: "white"
            }}
          >
            {loading ? <span className="spinner" style={{ "--sz": "16px" }} /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteIssue;
