import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
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
  const theme = useTheme();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const canEdit =
    currentUser?.role === "admin" || currentUser?._id === issue?.createdBy?._id;

  const br = theme.shape.borderRadius * 0.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: animationDelay }}>
      <Card
        sx={{
          borderRadius: br,
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: theme.palette.background.glass,
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            background: theme.palette.background.glassDark,
            boxShadow: theme.shadows[8],
          },
        }}>
        <CardContent sx={{ flexGrow: 1, p: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            {issue.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 1.5, color: theme.palette.text.secondary }}>
            {issue.description?.slice(0, 100)}...
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            <CategoryBadge category={issue.category} size="small" />
            <StatusBadge status={issue.status} size="small" />
            {issue.resolutionProof?.image && (
              <Box
                component="span"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  px: 1,
                  py: 0.4,
                  borderRadius: 20,
                  background: "rgba(34,197,94,0.12)",
                  color: "#16a34a",
                  display: "inline-flex",
                  alignItems: "center",
                }}>
                📷 Proof attached
              </Box>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}>
            👤 {issue.createdBy?.fullName}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              display: "block",
              mt: 0.5,
            }}>
            📍 {issue.location}
          </Typography>
        </CardContent>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Button
            size="small"
            disabled={hasVoted}
            onClick={() => onUpvote(issue._id)}
            sx={{
              textTransform: "none",
              borderRadius: br,
              px: 2,
              color: theme.palette.text.primary,
              background: theme.palette.action.hover,
              border: `1px solid ${theme.palette.divider}`,
              "&:hover": { background: theme.palette.action.selected },
              "&:disabled": {
                color: theme.palette.text.disabled,
                background: theme.palette.action.disabledBackground,
              },
            }}>
            👍 {hasVoted ? "Voted" : "Upvote"}
          </Button>

          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            {issue.upvotes || 0} votes
          </Typography>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            size="small"
            onClick={() => navigate(`/issues/${issue._id}`)}
            sx={{
              textTransform: "none",
              borderRadius: br,
              px: 2,
              color: theme.palette.primary.contrastText,
              background: theme.palette.primary.main,
              "&:hover": { background: theme.palette.primary.dark },
            }}>
            View
          </Button>

          {canEdit && (
            <>
              <Button
                size="small"
                onClick={() => onEdit(issue)}
                sx={{
                  textTransform: "none",
                  borderRadius: br,
                  px: 2,
                  background: theme.palette.action.hover,
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    background: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                  },
                }}>
                Edit
              </Button>

              <Button
                size="small"
                onClick={() => onDelete(issue)}
                sx={{
                  textTransform: "none",
                  borderRadius: br,
                  px: 2,
                  background: theme.palette.action.hover,
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    background: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                  },
                }}>
                Delete
              </Button>
            </>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default IssueCard;
