import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { issuesService } from "../../../services/issuesService";
import StatusBadge from "../../../components/common/StatusBadge";
import CategoryBadge from "../../../components/common/CategoryBadge";
import { motion } from "framer-motion";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function IssueDetail() {
  const { id } = useParams();
  const theme = useTheme();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedIssues, setVotedIssues] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // Load Local Votes
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
    setVotedIssues(storedVotes);
  }, []);

  // Load Issue
  useEffect(() => {
    const loadIssue = async () => {
      try {
        setLoading(true);
        const response = await issuesService.getIssueById(id);
        const data = response.issue || response.data || response;
        setIssue(data);
      } catch (err) {
        console.error("Failed to load issue:", err);
      } finally {
        setLoading(false);
      }
    };
    loadIssue();
  }, [id]);

  const handleUpvote = async () => {
    if (!issue || votedIssues.includes(issue._id)) return;
    try {
      const response = await issuesService.upvoteIssue(issue._id);
      const updatedUpvotes = response.data?.upvotes;
      setIssue((prev) => ({ ...prev, upvotes: updatedUpvotes }));
      const updatedVotes = [...votedIssues, issue._id];
      setVotedIssues(updatedVotes);
      localStorage.setItem("votedIssues", JSON.stringify(updatedVotes));
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      text: commentInput,
      author: "You",
      time: new Date().toLocaleString(),
    };
    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography variant="h5">Loading issue…</Typography>
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
        transition={{ duration: 0.45 }}>
        <Card
          sx={{
            maxWidth: 750,
            borderRadius: 3,
            background: theme.palette.background.glass,
            backdropFilter: "blur(14px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
            overflow: "hidden",
          }}>
          {/* Image */}
          {issue.image && (
            <Box
              component="img"
              src={issue.image}
              alt={issue.title}
              sx={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
            />
          )}

          <CardContent sx={{ p: 3 }}>
            {/* Title + Category + Status */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {issue.title}
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <CategoryBadge category={issue.category} />
                <StatusBadge status={issue.status} />
              </Box>
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

            {/* Description */}
            <Typography variant="body1" sx={{ mt: 3, mb: 2, lineHeight: 1.6 }}>
              {issue.description}
            </Typography>

            {/* Actions */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleUpvote}
                disabled={votedIssues.includes(issue._id)}>
                👍 {votedIssues.includes(issue._id) ? "Voted" : "Upvote"} (
                {issue.upvotes})
              </Button>

              <Button variant="outlined" startIcon={<ShareIcon />}>
                Share
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 4 }} />

            {/* Comments Section */}
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <ChatBubbleOutlineIcon /> Comments ({comments.length})
            </Typography>

            {/* Comment Input */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                sx={{ borderRadius: 2 }}
              />
              <Button variant="contained" onClick={handleAddComment}>
                Post
              </Button>
            </Box>

            {/* Comment List */}
            {comments.map((c) => (
              <Box
                key={c.id}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.07)",
                }}>
                <Typography variant="subtitle2">{c.author}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {c.text}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                  {c.time}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default IssueDetail;

// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Box,
//   useTheme,
// } from "@mui/material";
// import { issuesService } from "../../../services/issuesService";
// import StatusBadge from "../../../components/common/StatusBadge";
// import CategoryBadge from "../../../components/common/CategoryBadge";
// import { motion } from "framer-motion";

// function IssueDetail({ issues, setIssues }) {
//   const { id } = useParams();
//   const theme = useTheme();
//   const [issue, setIssue] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [votedIssues, setVotedIssues] = useState([]);

//   useEffect(() => {
//     const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
//     setVotedIssues(storedVotes);
//   }, []);

//   useEffect(() => {
//     const loadIssue = async () => {
//       try {
//         setLoading(true);
//         const response = await issuesService.getIssueById(id);
//         const data = response.issue || response.data || response;
//         setIssue(data);
//       } catch (err) {
//         console.error("Failed to load issue:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadIssue();
//   }, [id]);

//   const handleUpvote = async () => {
//     if (!issue || votedIssues.includes(issue._id)) return;
//     try {
//       const response = await issuesService.upvoteIssue(issue._id);
//       const updatedUpvotes = response.data?.upvotes;
//       setIssue((prev) => ({ ...prev, upvotes: updatedUpvotes }));
//       const updatedVotes = [...votedIssues, issue._id];
//       setVotedIssues(updatedVotes);
//       localStorage.setItem("votedIssues", JSON.stringify(updatedVotes));
//     } catch (err) {
//       console.error("Upvote failed:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "80vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}>
//         <Typography variant="h5">Loading issue…</Typography>
//       </Box>
//     );
//   }

//   if (!issue) {
//     return (
//       <Box
//         sx={{
//           minHeight: "80vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}>
//         <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
//           <Typography variant="h5" color="error">
//             ❌ Issue not found
//           </Typography>
//         </Card>
//       </Box>
//     );
//   }

//   const glass = theme.palette.glass || {
//     background:
//       theme.palette.mode === "dark"
//         ? "rgba(0,0,0,0.35)"
//         : "rgba(255,255,255,0.25)",
//     border:
//       theme.palette.mode === "dark"
//         ? "1px solid rgba(255,255,255,0.15)"
//         : "1px solid rgba(255,255,255,0.35)",
//     blur: "18px",
//     shadow:
//       theme.palette.mode === "dark"
//         ? "0 4px 25px rgba(0,0,0,0.3)"
//         : "0 4px 20px rgba(0,0,0,0.1)",
//   };

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", py: 5, px: 2 }}>
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45 }}>
//         <Card
//           sx={{
//             maxWidth: 700,
//             borderRadius: 4,
//             display: "flex",
//             flexDirection: "column",
//             background: theme.palette.background.glass,
//             backdropFilter: `blur(${glass.blur}) saturate(180%)`,
//             WebkitBackdropFilter: `blur(${glass.blur}) saturate(180%)`,
//             border: glass.border,
//             boxShadow: glass.shadow,
//             transition: "all 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-4px)",
//               background: theme.palette.background.glassDark,
//               boxShadow:
//                 theme.palette.mode === "dark"
//                   ? "0 12px 40px rgba(0,0,0,0.5)"
//                   : "0 12px 40px rgba(0,0,0,0.15)",
//             },
//           }}>
//           {/* Image */}
//           {issue.image && (
//             <Box
//               component="img"
//               src={issue.image}
//               alt={issue.title}
//               sx={{
//                 width: "100%",
//                 maxHeight: 300,
//                 objectFit: "cover",
//                 borderTopLeftRadius: 16,
//                 borderTopRightRadius: 16,
//               }}
//             />
//           )}

//           <CardContent sx={{ p: 2 }}>
//             <Typography variant="h4" gutterBottom>
//               {issue.title}
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               {issue.description}
//             </Typography>

//             <Box sx={{ display: "flex", gap: 1, my: 2 }}>
//               <CategoryBadge category={issue.category} />
//               <StatusBadge status={issue.status} />
//             </Box>

//             <Typography
//               variant="subtitle2"
//               sx={{ color: theme.palette.text.secondary }}>
//               👤 {issue.createdBy?.fullName}
//             </Typography>
//             <Typography
//               variant="subtitle2"
//               sx={{ color: theme.palette.text.secondary }}>
//               📍 {issue.location}
//             </Typography>

//             {/* Upvote */}
//             <Box
//               sx={{
//                 mt: 3,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}>
//               <Button
//                 variant="outlined"
//                 onClick={handleUpvote}
//                 disabled={votedIssues.includes(issue._id)}
//                 sx={{
//                   textTransform: "none",
//                   borderRadius: 3,
//                   px: 2,
//                   color: theme.palette.text.primary,
//                   background:
//                     theme.palette.mode === "dark"
//                       ? "rgba(255,255,255,0.08)"
//                       : "rgba(0,0,0,0.05)",
//                   backdropFilter: "blur(12px)",
//                   border:
//                     theme.palette.mode === "dark"
//                       ? "1px solid rgba(255,255,255,0.12)"
//                       : "1px solid rgba(0,0,0,0.08)",
//                   "&:hover": {
//                     background:
//                       theme.palette.mode === "dark"
//                         ? "rgba(255,255,255,0.15)"
//                         : "rgba(0,0,0,0.08)",
//                   },
//                   "&:disabled": {
//                     color: theme.palette.text.disabled,
//                     background:
//                       theme.palette.mode === "dark"
//                         ? "rgba(255,255,255,0.03)"
//                         : "rgba(0,0,0,0.02)",
//                   },
//                 }}>
//                 👍 {votedIssues.includes(issue._id) ? "Voted" : "Upvote"}
//               </Button>
//               <Typography
//                 variant="body2"
//                 sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
//                 {issue.upvotes || 0} votes
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </Box>
//   );
// }

// export default IssueDetail;
