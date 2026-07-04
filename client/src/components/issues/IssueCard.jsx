import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import CategoryBadge from "../common/CategoryBadge";

const IssueCard = ({
  issue,
  onUpvote,
  hasVoted,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const canEdit =
    currentUser?.role === "admin" || currentUser?._id === issue?.createdBy?._id;

  return (
    <div
      style={{ 
        animation: `fadeInUp 0.45s ease-out ${animationDelay}s both`,
        height: "100%"
      }}>
      <div
        className="card issue-card-hover"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: 16,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-base)",
          border: "0.5px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
          transition: "all 0.3s ease",
        }}>
        <div style={{ flexGrow: 1, padding: 8 }}>
          <h6
            style={{ 
              fontWeight: 600, 
              marginBottom: 8, 
              fontSize: "1.25rem",
              color: "var(--ink-primary)",
              marginTop: 0
            }}>
            {issue.title}
          </h6>

          <p
            style={{ 
              marginBottom: 12, 
              fontSize: "0.875rem",
              color: "var(--ink-secondary)",
              lineHeight: 1.5
            }}>
            {issue.description?.slice(0, 100)}...
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <CategoryBadge category={issue.category} size="small" />
            <StatusBadge status={issue.status} size="small" />
            {issue.resolutionProof?.image && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "3px 8px",
                  borderRadius: 20,
                  background: "rgba(34,197,94,0.12)",
                  color: "#16a34a",
                  display: "inline-flex",
                  alignItems: "center",
                }}>
                📷 Proof attached
              </span>
            )}
          </div>

          <span
            style={{ 
              display: "block",
              fontSize: "0.75rem",
              color: "var(--ink-secondary)",
              marginBottom: 4
            }}>
            👤 {issue.createdBy?.fullName}
          </span>

          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "var(--ink-secondary)",
              marginTop: 4,
            }}>
            📍 {issue.location}
          </span>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <button
            className="btn btn-outline"
            disabled={hasVoted}
            onClick={() => onUpvote(issue._id)}
            style={{ padding: "4px 16px", borderRadius: "var(--radius-sm)" }}>
            👍 {hasVoted ? "Voted" : "Upvote"}
          </button>

          <span
            style={{ 
              fontSize: "0.875rem",
              fontWeight: 700, 
              color: "var(--accent)" 
            }}>
            {issue.upvotes || 0} votes
          </span>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/issues/${issue._id}`)}
            style={{ padding: "4px 16px", borderRadius: "var(--radius-sm)" }}>
            View
          </button>

          {canEdit && (
            <>
              <button
                className="btn btn-outline"
                onClick={() => onEdit(issue)}
                style={{ padding: "4px 16px", borderRadius: "var(--radius-sm)" }}>
                Edit
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onDelete(issue)}
                style={{ 
                  padding: "4px 16px", 
                  borderRadius: "var(--radius-sm)",
                  color: "var(--status-open)",
                  borderColor: "var(--status-open)"
                }}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .issue-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md) !important;
        }
      `}</style>
    </div>
  );
};

export default IssueCard;
