import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { issuesService } from "../../../services/issuesService";
import StatusBadge from "../../../components/common/StatusBadge";
import CategoryBadge from "../../../components/common/CategoryBadge";
import { useAuth } from "../../../context/AuthContext";

const STATUS_COLORS = {
  Open: "#ef4444",
  "In Progress": "#f59e0b",
  Resolved: "#22c55e",
  Closed: "#6b7280",
};

const STATUS_ICONS = {
  Open: "📋",
  "In Progress": "⚙️",
  Resolved: "✅",
  Closed: "🔒",
};

function StatusTimeline({ history }) {
  if (!history?.length) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          marginBottom: 12,
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--ink-primary)"
        }}>
        Status History
      </div>
      <div style={{ position: "relative", paddingLeft: 16 }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background: "var(--border-subtle)",
            borderRadius: 4,
          }}
        />
        {[...history].reverse().map((entry, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start", animation: `fadeIn 0.3s ease-out ${i * 0.06}s both` }}>
            {/* Dot */}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: 2.4,
                background: STATUS_COLORS[entry.status] || "#94a3b8",
                border: `2px solid var(--surface-base)`,
                boxShadow: `0 0 0 2px ${STATUS_COLORS[entry.status] || "#94a3b8"}33`,
                zIndex: 1,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink-primary)" }}>
                  {STATUS_ICONS[entry.status]} {entry.status}
                </div>
                <div style={{ fontSize: "0.75rem", opacity: 0.55, color: "var(--ink-primary)" }}>
                  {new Date(entry.changedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {entry.changedBy?.fullName && (
                <div style={{ fontSize: "0.75rem", opacity: 0.5, color: "var(--ink-primary)" }}>
                  by {entry.changedBy.fullName}
                </div>
              )}
              {entry.note && (
                <div
                  style={{ marginTop: 4, opacity: 0.75, fontStyle: "italic", fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                  "{entry.note}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);
  const [upvoting, setUpvoting] = useState(false);
  const [watching, setWatching] = useState(false);

  // Resolution proof upload state (admin only)
  const [proofFile, setProofFile] = useState(null);
  const [proofNote, setProofNote] = useState("");
  const [proofPreview, setProofPreview] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [showProofForm, setShowProofForm] = useState(false);

  const userId = user?._id?.toString();

  const hasUpvoted =
    issue?.upvotedBy?.some((uid) => {
      const s =
        typeof uid === "object"
          ? (uid._id?.toString() ?? uid.toString())
          : uid.toString();
      return s === userId;
    }) ?? false;

  const isWatching =
    issue?.watchers?.some((w) => {
      const s =
        typeof w === "object"
          ? (w._id?.toString() ?? w.toString())
          : w.toString();
      return s === userId;
    }) ?? false;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await issuesService.getIssueById(id);
        setIssue(res.data || res.issue || res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpvote = async () => {
    if (!issue || hasUpvoted || upvoting) return;
    setUpvoting(true);
    try {
      const res = await issuesService.upvoteIssue(issue._id);
      const d = res.data || res;
      setIssue((p) => ({ ...p, upvotes: d.upvotes, upvotedBy: d.upvotedBy }));
    } catch (e) {
      console.error(e.message);
    } finally {
      setUpvoting(false);
    }
  };

  const handleWatch = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setWatching(true);
    try {
      const res = await issuesService.watchIssue(issue._id);
      const d = res.data || res;
      // Toggle watcher in local state
      setIssue((p) => {
        const watchers = d.watching
          ? [...(p.watchers || []), { _id: userId, fullName: user.fullName }]
          : (p.watchers || []).filter(
              (w) => (w._id?.toString() ?? w.toString()) !== userId,
            );
        return { ...p, watchers };
      });
    } catch (e) {
      console.error(e.message);
    } finally {
      setWatching(false);
    }
  };

  const handleProofFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleUploadProof = async () => {
    if (!proofFile || uploadingProof) return;
    setUploadingProof(true);
    try {
      const res = await issuesService.uploadResolutionProof(
        issue._id,
        proofFile,
        proofNote,
      );
      setIssue(res.data || res.issue || res);
      setProofFile(null);
      setProofNote("");
      setProofPreview(null);
      setShowProofForm(false);
    } catch (e) {
      console.error(e.message);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await issuesService.addComment(
        issue._id,
        commentInput.trim(),
      );
      setIssue(res.data || res.issue || res);
      setCommentInput("");
    } catch (e) {
      console.error(e.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (cid) => {
    setDeletingComment(cid);
    try {
      const res = await issuesService.deleteComment(issue._id, cid);
      setIssue(res.data || res.issue || res);
    } catch (e) {
      console.error(e.message);
    } finally {
      setDeletingComment(null);
    }
  };

  const isOwner = user && issue && userId === issue.createdBy?._id?.toString();
  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <span className="spinner" style={{ "--sz": "40px" }} />
      </div>
    );
  }

  if (!issue) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <h5 style={{ color: "var(--status-open)", fontSize: "1.5rem" }}>
          Issue not found
        </h5>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 16px" }}>
      <div
        style={{ width: "100%", maxWidth: 750, animation: "fadeInUp 0.45s ease-out" }}>
        <div className="card"
          style={{
            borderRadius: 24,
            background: "var(--surface-base)", // Solid background replacing glass
            border: "0.5px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}>
          {issue.image && (
            <img
              src={issue.image}
              alt={issue.title}
              style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }}
            />
          )}

          <div className="card-body" style={{ padding: 24 }}>
            {/* Title + owner actions */}
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}>
              <h4 style={{ margin: 0, fontWeight: 700, flex: 1, fontSize: "2.125rem", color: "var(--ink-primary)" }}>
                {issue.title}
              </h4>
              {(isOwner || isAdmin) && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {isOwner && (
                    <button
                      className="btn-icon"
                      title="Edit issue"
                      onClick={() => navigate(`/issues/${issue._id}/edit`)}>
                      <i className="ti ti-edit" style={{ fontSize: "1.25rem" }} />
                    </button>
                  )}
                  <button
                    className="btn-icon"
                    style={{ color: "var(--status-open)" }}
                    title="Delete issue"
                    onClick={async () => {
                      if (!window.confirm("Delete this issue?")) return;
                      await issuesService.deleteIssue(issue._id);
                      navigate("/issues");
                    }}>
                    <i className="ti ti-trash" style={{ fontSize: "1.25rem" }} />
                  </button>
                </div>
              )}
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <CategoryBadge category={issue.category} />
              <StatusBadge status={issue.status} />
              <span
                style={{ 
                  fontSize: 12, 
                  background: "var(--surface-subtle)", 
                  padding: "4px 12px", 
                  borderRadius: 16, 
                  display: "inline-flex", 
                  alignItems: "center" 
                }}
              >
                🔥 {issue.priority}
              </span>
            </div>

            {/* Meta */}
            <div style={{ fontSize: "0.875rem", opacity: 0.7, color: "var(--ink-primary)", marginBottom: 4 }}>
              📍 {issue.location}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.7, color: "var(--ink-primary)", marginBottom: 4 }}>
              👤 {issue.createdBy?.fullName}
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                opacity: 0.6,
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "var(--ink-primary)"
              }}>
              <i className="ti ti-clock" />
              {new Date(issue.createdAt).toLocaleString()}
            </div>

            <p style={{ marginTop: 24, marginBottom: 16, lineHeight: 1.7, fontSize: "1rem", color: "var(--ink-primary)" }}>
              {issue.description}
            </p>

            {/* Actions row */}
            <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                className="btn btn-outline"
                onClick={handleUpvote}
                disabled={hasUpvoted || upvoting || user?.role === "admin"}>
                {upvoting
                  ? "..."
                  : `👍 ${hasUpvoted ? "Voted" : "Upvote"} (${issue.upvotes})`}
              </button>

              {/* Watch / unwatch */}
              {user && user.role !== "admin" && (
                <button
                  className={`btn ${isWatching ? "btn-primary" : "btn-outline"}`}
                  title={
                    isWatching
                      ? "Stop watching this issue"
                      : "Watch — get notified on updates"
                  }
                  onClick={handleWatch}
                  disabled={watching}>
                  <i className={`ti ${isWatching ? "ti-bell-ringing" : "ti-bell-off"}`} style={{ marginRight: 8 }} />
                  {isWatching ? "Watching" : "Watch"}
                  {issue.watchers?.length > 0 &&
                    ` (${issue.watchers.length})`}
                </button>
              )}

              <button
                className="btn btn-outline"
                title="Copy link to clipboard"
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }>
                <i className="ti ti-share" style={{ marginRight: 8 }} />
                Share
              </button>
            </div>

            <div className="divider" style={{ margin: "24px 0" }} />

            {/* Status history timeline */}
            <StatusTimeline history={issue.statusHistory} />

            {/* Resolution proof — display if it exists */}
            {issue.resolutionProof?.image && (
              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    marginBottom: 12,
                    opacity: 0.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--ink-primary)"
                  }}>
                  Resolution Proof
                </div>
                <img
                  src={issue.resolutionProof.image}
                  alt="Resolution proof"
                  style={{
                    width: "100%",
                    maxHeight: 280,
                    objectFit: "cover",
                    borderRadius: 16,
                    border: "1px solid var(--border-subtle)",
                    display: "block"
                  }}
                />
                {issue.resolutionProof.note && (
                  <div
                    style={{ marginTop: 8, opacity: 0.75, fontStyle: "italic", fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    "{issue.resolutionProof.note}"
                  </div>
                )}
                <div
                  style={{ opacity: 0.5, display: "block", marginTop: 4, fontSize: "0.75rem", color: "var(--ink-primary)" }}>
                  Uploaded{" "}
                  {new Date(
                    issue.resolutionProof.uploadedAt,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}

            {/* Resolution proof — admin upload form */}
            {isAdmin && !issue.resolutionProof?.image && (
              <div style={{ marginTop: 24 }}>
                {!showProofForm ? (
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowProofForm(true)}>
                    <i className="ti ti-camera-plus" style={{ marginRight: 8 }} />
                    Add Resolution Proof
                  </button>
                ) : (
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid var(--border-subtle)",
                      background: "rgba(34,197,94,0.04)",
                    }}>
                    <div
                      style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: "var(--ink-primary)" }}>
                      📷 Upload Resolution Proof
                    </div>

                    <label className="btn btn-outline" style={{ marginBottom: 12, display: "inline-block", cursor: "pointer" }}>
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleProofFileChange}
                        style={{ display: "none" }}
                      />
                    </label>

                    {proofPreview && (
                      <img
                        src={proofPreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                          borderRadius: 16,
                          marginBottom: 12,
                          display: "block"
                        }}
                      />
                    )}

                    <input
                      className="input"
                      type="text"
                      placeholder="Optional note (e.g. 'Pothole filled and resurfaced')"
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                      style={{ marginBottom: 12, width: "100%", borderRadius: 8 }}
                    />

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-primary"
                        disabled={!proofFile || uploadingProof}
                        onClick={handleUploadProof}>
                        {uploadingProof ? (
                          <span className="spinner" style={{ "--sz": "16px" }} />
                        ) : (
                          "Upload & Mark Resolved"
                        )}
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setShowProofForm(false);
                          setProofFile(null);
                          setProofPreview(null);
                          setProofNote("");
                        }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="divider" style={{ margin: "24px 0" }} />

            {/* Comments */}
            <h6
              style={{ margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
              <i className="ti ti-message-circle-2" />
              Comments ({issue.comments?.length ?? 0})
            </h6>

            {user ? (
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <input
                  className="input"
                  type="text"
                  placeholder="Write a comment…"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  style={{ width: "100%", borderRadius: 16 }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddComment}
                  disabled={submittingComment || !commentInput.trim()}>
                  {submittingComment ? <span className="spinner" style={{ "--sz": "18px" }} /> : "Post"}
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: 16, opacity: 0.6, fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => navigate("/login")}>
                  Log in
                </button>{" "}
                to leave a comment.
              </div>
            )}

            {(issue.comments?.length ?? 0) === 0 ? (
              <div
                style={{ opacity: 0.5, textAlign: "center", padding: "16px 0", fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                No comments yet. Be the first to comment.
              </div>
            ) : (
              [...(issue.comments ?? [])]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((c) => {
                  const cAuthorId =
                    c.user?._id?.toString() ?? c.user?.toString();
                  const canDelete = user && (userId === cAuthorId || isAdmin);
                  return (
                    <div
                      key={c._id}
                      style={{
                        marginBottom: 16,
                        padding: 16,
                        borderRadius: 16,
                        background: "rgba(128,128,128,0.07)",
                        display: "flex",
                        gap: 12,
                      }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
                        {c.user?.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink-primary)" }}>
                          {c.user?.fullName ?? "Unknown"}
                        </div>
                        <div
                          style={{ fontSize: "0.875rem", opacity: 0.85, marginTop: 2, color: "var(--ink-primary)" }}>
                          {c.text}
                        </div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.5, color: "var(--ink-primary)", marginTop: 4 }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {canDelete && (
                        <button
                          className="btn-icon"
                          style={{ color: "var(--status-open)" }}
                          title="Delete comment"
                          disabled={deletingComment === c._id}
                          onClick={() => handleDeleteComment(c._id)}>
                          <i className="ti ti-trash" style={{ fontSize: "1.25rem" }} />
                        </button>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
