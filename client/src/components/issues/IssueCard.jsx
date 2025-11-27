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

  const br = theme.shape.borderRadius * 0.4; // Unified radius

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
            sx={{
              fontWeight: 600,
              mb: 1,
              color: theme.palette.text.primary,
            }}>
            {issue.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 1.5, color: theme.palette.text.secondary }}>
            {issue.description?.slice(0, 100)}...
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
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
              "&:hover": {
                background: theme.palette.action.selected,
              },
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
              "&:hover": {
                background: theme.palette.primary.dark,
              },
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

// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Box,
//   useTheme,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import StatusBadge from "../common/StatusBadge";
// import CategoryBadge from "../common/CategoryBadge";
// // import { useTheme } from "../../context/ThemeContext";

// const IssueCard = ({
//   issue,
//   onUpvote,
//   hasVoted,
//   onEdit,
//   onDelete,
//   animationDelay = 0,
// }) => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const currentUser = JSON.parse(localStorage.getItem("user")) || {};
//   const canEdit =
//     currentUser?.role === "admin" || currentUser?._id === issue?.createdBy?._id;

//   const glass = theme.palette.glass || {
//     background:
//       theme.palette.mode === "dark"
//         ? "rgba(0, 0, 0, 0.35)"
//         : "rgba(255, 255, 255, 0.25)",
//     border:
//       theme.palette.mode === "dark"
//         ? "1px solid rgba(255, 255, 255, 0.15)"
//         : "1px solid rgba(255, 255, 255, 0.35)",
//     blur: "18px",
//     shadow:
//       theme.palette.mode === "dark"
//         ? "0 4px 25px rgba(0, 0, 0, 0.3)"
//         : "0 4px 20px rgba(0, 0, 0, 0.1)",
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.45, delay: animationDelay }}>
//       <Card
//         sx={{
//           borderRadius: 4,
//           p: 2,
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",

//           /* Use theme glass values */
//           background: theme.palette.background.glass,
//           backdropFilter: `blur(${glass.blur}) saturate(180%)`,
//           WebkitBackdropFilter: `blur(${glass.blur}) saturate(180%)`,
//           border: glass.border,
//           boxShadow: glass.shadow,

//           transition: "all 0.3s ease",
//           "&:hover": {
//             transform: "translateY(-4px)",
//             background: theme.palette.background.glassDark,
//             boxShadow:
//               theme.palette.mode === "dark"
//                 ? "0 12px 40px rgba(0,0,0,0.5)"
//                 : "0 12px 40px rgba(0,0,0,0.15)",
//           },
//         }}>
//         <CardContent sx={{ flexGrow: 1, p: 1 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 600,
//               mb: 1,
//               color: theme.palette.text.primary,
//               textShadow:
//                 theme.palette.mode === "dark"
//                   ? "0 2px 4px rgba(0,0,0,0.5)"
//                   : "0 1px 2px rgba(0,0,0,0.1)",
//             }}>
//             {issue.title}
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               mb: 1.5,
//               color: theme.palette.text.secondary,
//             }}>
//             {issue.description?.slice(0, 100)}...
//           </Typography>

//           <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
//             <CategoryBadge category={issue.category} />
//             <StatusBadge status={issue.status} />
//           </Box>

//           <Typography
//             variant="caption"
//             sx={{ color: theme.palette.text.secondary }}>
//             👤 {issue.createdBy?.fullName}
//           </Typography>

//           <Typography
//             variant="caption"
//             sx={{
//               color: theme.palette.text.secondary,
//               display: "block",
//               mt: 0.5,
//             }}>
//             📍 {issue.location}
//           </Typography>
//         </CardContent>

//         {/* Bottom Buttons */}
//         <Box
//           sx={{
//             mt: 2,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}>
//           <Button
//             size="small"
//             disabled={hasVoted}
//             onClick={() => onUpvote(issue._id)}
//             sx={{
//               textTransform: "none",
//               borderRadius: 3,
//               px: 2,
//               color: theme.palette.text.primary,
//               background:
//                 theme.palette.mode === "dark"
//                   ? "rgba(255,255,255,0.08)"
//                   : "rgba(0,0,0,0.05)",
//               backdropFilter: "blur(12px)",
//               border:
//                 theme.palette.mode === "dark"
//                   ? "1px solid rgba(255,255,255,0.12)"
//                   : "1px solid rgba(0,0,0,0.08)",
//               "&:hover": {
//                 background:
//                   theme.palette.mode === "dark"
//                     ? "rgba(255,255,255,0.15)"
//                     : "rgba(0,0,0,0.08)",
//               },
//               "&:disabled": {
//                 color: theme.palette.text.disabled,
//                 background:
//                   theme.palette.mode === "dark"
//                     ? "rgba(255,255,255,0.03)"
//                     : "rgba(0,0,0,0.02)",
//               },
//             }}>
//             👍 {hasVoted ? "Voted" : "Upvote"}
//           </Button>

//           <Typography
//             variant="body2"
//             sx={{
//               fontWeight: 700,
//               color: theme.palette.primary.main,
//             }}>
//             {issue.upvotes || 0} votes
//           </Typography>
//         </Box>

//         {/* Footer Buttons */}
//         <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//           <Button
//             size="small"
//             onClick={() => navigate(`/issues/${issue._id}`)}
//             sx={{
//               textTransform: "none",
//               borderRadius: 3,
//               px: 2,
//               color: theme.palette.primary.contrastText,
//               background: theme.palette.primary.main,
//               "&:hover": {
//                 background: theme.palette.primary.dark,
//               },
//             }}>
//             View
//           </Button>

//           {canEdit && (
//             <>
//               <Button
//                 size="small"
//                 onClick={() => onEdit(issue)}
//                 sx={{
//                   textTransform: "none",
//                   borderRadius: 3,
//                   px: 2,
//                   background:
//                     theme.palette.mode === "dark"
//                       ? "rgba(255,255,255,0.08)"
//                       : "rgba(0,0,0,0.05)",
//                   border:
//                     theme.palette.mode === "dark"
//                       ? "1px solid rgba(255,255,255,0.12)"
//                       : "1px solid rgba(0,0,0,0.08)",
//                   color: theme.palette.text.primary,
//                   "&:hover": {
//                     background: theme.palette.secondary.main,
//                     color: theme.palette.secondary.contrastText,
//                   },
//                 }}>
//                 Edit
//               </Button>

//               <Button
//                 size="small"
//                 onClick={() => onDelete(issue)}
//                 sx={{
//                   textTransform: "none",
//                   borderRadius: 3,
//                   px: 2,
//                   background:
//                     theme.palette.mode === "dark"
//                       ? "rgba(255,255,255,0.08)"
//                       : "rgba(0,0,0,0.05)",
//                   border:
//                     theme.palette.mode === "dark"
//                       ? "1px solid rgba(255,255,255,0.12)"
//                       : "1px solid rgba(0,0,0,0.08)",
//                   color: theme.palette.text.primary,
//                   "&:hover": {
//                     background: theme.palette.error.main,
//                     color: theme.palette.error.contrastText,
//                   },
//                 }}>
//                 Delete
//               </Button>
//             </>
//           )}
//         </Box>
//       </Card>
//     </motion.div>
//   );
// };

// export default IssueCard;
