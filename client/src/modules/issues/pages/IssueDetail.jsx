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
import { useAuth } from "../../../context/AuthContext";

function IssueDetail() {
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

  // FIX #2 — upvote state from server, not localStorage
  const hasUpvoted = issue
    ? issue.upvotedBy?.some((uid) => {
        const uidStr =
          typeof uid === "object"
            ? (uid._id?.toString() ?? uid.toString())
            : uid.toString();
        return uidStr === user?._id?.toString();
      })
    : false;

  useEffect(() => {
    const loadIssue = async () => {
      try {
        setLoading(true);
        const response = await issuesService.getIssueById(id);
        const data = response.data || response.issue || response;
        setIssue(data);
      } catch (err) {
        console.error("Failed to load issue:", err);
      } finally {
        setLoading(false);
      }
    };
    loadIssue();
  }, [id]);

  // FIX #2 — upvote is fully server-side; no localStorage
  const handleUpvote = async () => {
    if (!issue || hasUpvoted || upvoting) return;
    setUpvoting(true);
    try {
      const response = await issuesService.upvoteIssue(issue._id);
      const updated = response.data || response;
      setIssue((prev) => ({
        ...prev,
        upvotes: updated.upvotes,
        upvotedBy: updated.upvotedBy,
      }));
    } catch (err) {
      console.error("Upvote failed:", err.message);
    } finally {
      setUpvoting(false);
    }
  };

  // FIX #1 — comment is POSTed to MongoDB, not just local state
  const handleAddComment = async () => {
    if (!commentInput.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const response = await issuesService.addComment(
        issue._id,
        commentInput.trim(),
      );
      const updatedIssue = response.data || response.issue || response;
      setIssue(updatedIssue);
      setCommentInput("");
    } catch (err) {
      console.error("Comment failed:", err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (deletingComment) return;
    setDeletingComment(commentId);
    try {
      const response = await issuesService.deleteComment(issue._id, commentId);
      const updatedIssue = response.data || response.issue || response;
      setIssue(updatedIssue);
    } catch (err) {
      console.error("Delete comment failed:", err.message);
    } finally {
      setDeletingComment(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
  };

  const isOwner =
    user && issue && user._id?.toString() === issue.createdBy?._id?.toString();
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
            {/* Title + actions row */}
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

              {/* Edit/Delete — only for owner or admin */}
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
                        try {
                          await issuesService.deleteIssue(issue._id);
                          navigate("/issues");
                        } catch (err) {
                          alert(err.message);
                        }
                      }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Badges */}
            <Box
              sx={{ mt: 1, mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <CategoryBadge category={issue.category} />
              <StatusBadge status={issue.status} />
            </Box>

            {/* Metadata */}
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
                gap: 1,
              }}>
              <AccessTimeIcon fontSize="small" />
              {new Date(issue.createdAt).toLocaleString()}
            </Typography>

            <Typography variant="body1" sx={{ mt: 3, mb: 2, lineHeight: 1.6 }}>
              {issue.description}
            </Typography>

            {/* Actions */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleUpvote}
                disabled={hasUpvoted || upvoting || user?.role === "admin"}>
                {upvoting
                  ? "..."
                  : `👍 ${hasUpvoted ? "Voted" : "Upvote"} (${issue.upvotes})`}
              </Button>
              <Tooltip title="Copy link to clipboard">
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}>
                  Share
                </Button>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Comments */}
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon />
              Comments ({issue.comments?.length ?? 0})
            </Typography>

            {/* Comment input — only for logged-in users */}
            {user ? (
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Write a comment..."
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

            {/* Comment list — from MongoDB */}
            {(issue.comments ?? []).length === 0 ? (
              <Typography
                variant="body2"
                sx={{ opacity: 0.5, textAlign: "center", py: 2 }}>
                No comments yet. Be the first to comment.
              </Typography>
            ) : (
              [...(issue.comments ?? [])]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((c) => {
                  const commentAuthorId =
                    c.user?._id?.toString() ?? c.user?.toString();
                  const canDelete =
                    user &&
                    (user._id?.toString() === commentAuthorId ||
                      user.role === "admin");

                  return (
                    <Box
                      key={c._id}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.07)",
                        display: "flex",
                        alignItems: "flex-start",
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

export default IssueDetail;
