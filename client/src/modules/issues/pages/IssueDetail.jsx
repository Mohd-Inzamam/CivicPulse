import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Avatar,
  Divider,
  useTheme,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { issuesService } from "../../../services/issuesService";
import StatusBadge from "../../../components/common/StatusBadge";
import CategoryBadge from "../../../components/common/CategoryBadge";
import { motion } from "framer-motion";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
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
  const theme = useTheme();
  if (!history?.length) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: 11,
        }}>
        Status History
      </Typography>
      <Box sx={{ position: "relative", pl: 2 }}>
        {/* Vertical line */}
        <Box
          sx={{
            position: "absolute",
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background: theme.palette.divider,
            borderRadius: 4,
          }}
        />
        {[...history].reverse().map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}>
            <Box
              sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start" }}>
              {/* Dot */}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  flexShrink: 0,
                  mt: 0.3,
                  background: STATUS_COLORS[entry.status] || "#94a3b8",
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: `0 0 0 2px ${STATUS_COLORS[entry.status] || "#94a3b8"}33`,
                  zIndex: 1,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {STATUS_ICONS[entry.status]} {entry.status}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.55 }}>
                    {new Date(entry.changedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                {entry.changedBy?.fullName && (
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    by {entry.changedBy.fullName}
                  </Typography>
                )}
                {entry.note && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, opacity: 0.75, fontStyle: "italic" }}>
                    "{entry.note}"
                  </Typography>
                )}
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
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
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!issue) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography variant="h5" color="error">
          Issue not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 5, px: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: 750 }}>
        <Card
          sx={{
            borderRadius: 3,
            background: theme.palette.background.glass,
            backdropFilter: "blur(14px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
            overflow: "hidden",
          }}>
          {issue.image && (
            <Box
              component="img"
              src={issue.image}
              alt={issue.title}
              sx={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
            />
          )}

          <CardContent sx={{ p: 3 }}>
            {/* Title + owner actions */}
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
              }}>
              <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
                {issue.title}
              </Typography>
              {(isOwner || isAdmin) && (
                <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                  {isOwner && (
                    <Tooltip title="Edit issue">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/issues/${issue._id}/edit`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete issue">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={async () => {
                        if (!window.confirm("Delete this issue?")) return;
                        await issuesService.deleteIssue(issue._id);
                        navigate("/issues");
                      }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Badges */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <CategoryBadge category={issue.category} />
              <StatusBadge status={issue.status} />
              <Chip
                label={`🔥 ${issue.priority}`}
                size="small"
                sx={{ fontSize: 12 }}
              />
            </Box>

            {/* Meta */}
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              📍 {issue.location}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              👤 {issue.createdBy?.fullName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.6,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}>
              <AccessTimeIcon fontSize="small" />
              {new Date(issue.createdAt).toLocaleString()}
            </Typography>

            <Typography variant="body1" sx={{ mt: 3, mb: 2, lineHeight: 1.7 }}>
              {issue.description}
            </Typography>

            {/* Actions row */}
            <Box sx={{ mt: 2, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={handleUpvote}
                disabled={hasUpvoted || upvoting || user?.role === "admin"}>
                {upvoting
                  ? "..."
                  : `👍 ${hasUpvoted ? "Voted" : "Upvote"} (${issue.upvotes})`}
              </Button>

              {/* Watch / unwatch */}
              {user && user.role !== "admin" && (
                <Tooltip
                  title={
                    isWatching
                      ? "Stop watching this issue"
                      : "Watch — get notified on updates"
                  }>
                  <Button
                    variant={isWatching ? "contained" : "outlined"}
                    color={isWatching ? "primary" : "inherit"}
                    startIcon={
                      isWatching ? (
                        <NotificationsActiveIcon />
                      ) : (
                        <NotificationsOffIcon />
                      )
                    }
                    onClick={handleWatch}
                    disabled={watching}
                    size="small">
                    {isWatching ? "Watching" : "Watch"}
                    {issue.watchers?.length > 0 &&
                      ` (${issue.watchers.length})`}
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="Copy link to clipboard">
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }>
                  Share
                </Button>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Status history timeline */}
            <StatusTimeline history={issue.statusHistory} />

            {/* Resolution proof — display if it exists */}
            {issue.resolutionProof?.image && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    opacity: 0.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: 11,
                  }}>
                  Resolution Proof
                </Typography>
                <Box
                  component="img"
                  src={issue.resolutionProof.image}
                  alt="Resolution proof"
                  sx={{
                    width: "100%",
                    maxHeight: 280,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                {issue.resolutionProof.note && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, opacity: 0.75, fontStyle: "italic" }}>
                    "{issue.resolutionProof.note}"
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.5, display: "block", mt: 0.5 }}>
                  Uploaded{" "}
                  {new Date(
                    issue.resolutionProof.uploadedAt,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
            )}

            {/* Resolution proof — admin upload form */}
            {isAdmin && !issue.resolutionProof?.image && (
              <Box sx={{ mt: 3 }}>
                {!showProofForm ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddAPhotoIcon fontSize="small" />}
                    onClick={() => setShowProofForm(true)}>
                    Add Resolution Proof
                  </Button>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      background: "rgba(34,197,94,0.04)",
                    }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1.5, fontSize: 13, fontWeight: 600 }}>
                      📷 Upload Resolution Proof
                    </Typography>

                    <Button
                      component="label"
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1.5, textTransform: "none" }}>
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleProofFileChange}
                      />
                    </Button>

                    {proofPreview && (
                      <Box
                        component="img"
                        src={proofPreview}
                        alt="Preview"
                        sx={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                          borderRadius: 2,
                          mb: 1.5,
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Optional note (e.g. 'Pothole filled and resurfaced')"
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                      sx={{ mb: 1.5 }}
                    />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!proofFile || uploadingProof}
                        onClick={handleUploadProof}>
                        {uploadingProof ? (
                          <CircularProgress size={16} />
                        ) : (
                          "Upload & Mark Resolved"
                        )}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setShowProofForm(false);
                          setProofFile(null);
                          setProofPreview(null);
                          setProofNote("");
                        }}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Comments */}
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon />
              Comments ({issue.comments?.length ?? 0})
            </Typography>

            {user ? (
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Write a comment…"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  sx={{ borderRadius: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={submittingComment || !commentInput.trim()}>
                  {submittingComment ? <CircularProgress size={18} /> : "Post"}
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.6 }}>
                <Button size="small" onClick={() => navigate("/login")}>
                  Log in
                </Button>{" "}
                to leave a comment.
              </Typography>
            )}

            {(issue.comments?.length ?? 0) === 0 ? (
              <Typography
                variant="body2"
                sx={{ opacity: 0.5, textAlign: "center", py: 2 }}>
                No comments yet. Be the first to comment.
              </Typography>
            ) : (
              [...(issue.comments ?? [])]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((c) => {
                  const cAuthorId =
                    c.user?._id?.toString() ?? c.user?.toString();
                  const canDelete = user && (userId === cAuthorId || isAdmin);
                  return (
                    <Box
                      key={c._id}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.07)",
                        display: "flex",
                        gap: 1.5,
                      }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {c.user?.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">
                          {c.user?.fullName ?? "Unknown"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.85, mt: 0.25 }}>
                          {c.text}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5 }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      {canDelete && (
                        <Tooltip title="Delete comment">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={deletingComment === c._id}
                            onClick={() => handleDeleteComment(c._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  );
                })
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
