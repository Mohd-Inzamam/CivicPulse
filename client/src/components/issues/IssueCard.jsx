import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import StatusBadge from "../common/StatusBadge";
import CategoryBadge from "../common/CategoryBadge";

const IssueCard = ({
  issue,
  onUpvote,
  hasVoted,
  onEdit,
  animationDelay = 0,
}) => {
  const navigate = useNavigate();

  // Determine if user can edit
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  console.log("currentUser", currentUser);
  const canEdit =
    currentUser.role === "user" || currentUser._id === issue.createdBy?._id;
  console.log(canEdit);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-2px)",
          },
        }}>
        {issue.image && (
          <CardMedia
            component="img"
            height="200"
            image={issue.image}
            alt={issue.title}
            sx={{ objectFit: "cover" }}
          />
        )}

        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}>
            {issue.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            {issue.description}
          </Typography>

          <div style={{ marginBottom: 16 }}>
            <CategoryBadge category={issue.category} sx={{ mr: 1 }} />
            <StatusBadge status={issue.status} />
          </div>

          <Typography variant="body2" paragraph sx={{ mb: 1 }}>
            📍 <strong>Location:</strong> {issue.location}
          </Typography>

          <Typography variant="body2" paragraph sx={{ mb: 2 }}>
            👤 <strong>Created By:</strong>{" "}
            {issue.createdBy?.fullName || "Unknown"}
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}>
            <Button
              variant="outlined"
              size="small"
              disabled={hasVoted}
              onClick={() => onUpvote(issue._id)}
              sx={{ textTransform: "none" }}>
              👍 {hasVoted ? "Voted" : "Upvote"}
            </Button>

            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {issue.upvotes || 0} votes
            </Typography>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/issues/${issue._id}`)}
              sx={{ textTransform: "none", flex: 1, borderRadius: 2 }}>
              View Details
            </Button>

            {canEdit && onEdit && (
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => onEdit(issue)}
                sx={{ textTransform: "none", flex: 1, borderRadius: 2 }}>
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IssueCard;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
// import { motion } from 'framer-motion';
// import StatusBadge from '../common/StatusBadge';
// import CategoryBadge from '../common/CategoryBadge';

// const IssueCard = ({
//   issue,
//   onUpvote,
//   hasVoted,
//   animationDelay = 0
// }) => {
//   const navigate = useNavigate();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: animationDelay }}
//     >
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: 2,
//           overflow: 'hidden',
//           transition: 'all 0.3s ease',
//           '&:hover': {
//             boxShadow: 4,
//             transform: 'translateY(-2px)',
//           }
//         }}
//       >
//         {issue.imageURL && (
//           <CardMedia
//             component="img"
//             height="200"
//             image={issue.imageURL}
//             alt={issue.title}
//             sx={{ objectFit: 'cover' }}
//           />
//         )}

//         <CardContent>
//           <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
//             {issue.title}
//           </Typography>

//           <Typography variant="body2" color="text.secondary" paragraph>
//             {issue.description}
//           </Typography>

//           <div style={{ marginBottom: 16 }}>
//             <CategoryBadge category={issue.category} sx={{ mr: 1 }} />
//             <StatusBadge status={issue.status} />
//           </div>

//           <Typography variant="body2" paragraph sx={{ mb: 1 }}>
//             📍 <strong>Location:</strong> {issue.location}
//           </Typography>

//           <Typography variant="body2" paragraph sx={{ mb: 2 }}>
//             👤 <strong>Created By:</strong> {issue.createdBy}
//           </Typography>

//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <Button
//               variant="outlined"
//               size="small"
//               disabled={hasVoted}
//               onClick={() => onUpvote(issue.id)}
//               sx={{ textTransform: 'none' }}
//             >
//               👍 {hasVoted ? 'Voted' : 'Upvote'}
//             </Button>

//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {issue.upvotes} votes
//             </Typography>
//           </div>

//           {issue.id && (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={() => navigate(`/issues/${issue.id}`)}
//               sx={{
//                 mt: 2,
//                 width: '100%',
//                 textTransform: 'none',
//                 borderRadius: 2
//               }}
//             >
//               View Details
//             </Button>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default IssueCard;
