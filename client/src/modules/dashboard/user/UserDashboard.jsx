import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { issuesService } from "../../../services/issuesService";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/common/StatusBadge";
import CategoryBadge from "../../../components/common/CategoryBadge";

export default function UserDashboard() {
  // FIX #3 — only load the logged-in user's own issues
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        // Pass createdBy=me so the server filters by req.user._id
        const res = await issuesService.getAllIssues({ createdBy: "me" });
        const fetched = res.data?.issues || res.issues || [];
        setIssues(fetched);
      } catch (err) {
        console.error("Dashboard failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIssues();
  }, []);

  // Personal stats — my issues only
  const total = issues.length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const open = issues.filter((i) => i.status === "Open").length;

  const glass = {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
  };

  const stats = [
    { label: "Reported", value: total, color: "primary" },
    { label: "Open", value: open, color: "warning" },
    { label: "In Progress", value: inProgress, color: "info" },
    { label: "Resolved", value: resolved, color: "success" },
  ];

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: "1100px", mx: "auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <Box
          sx={{
            ...glass,
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 60,
              height: 60,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}>
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Welcome back, {user?.fullName?.split(" ")[0]} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here's your personal civic activity
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Personal stats */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
          gap: 3,
        }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}>
            <Card sx={{ ...glass, textAlign: "center", py: 2 }}>
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700 }}
                  color={`${stat.color}.main`}>
                  {loading ? "—" : stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* My issues list */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}>
        <Card sx={{ ...glass, mt: 4, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              My Reported Issues
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: "12px", textTransform: "none" }}
              onClick={() => navigate("/report-issue")}>
              + Report New
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : issues.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                You haven't reported any issues yet.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/report-issue")}
                sx={{ borderRadius: "12px", textTransform: "none" }}>
                Report your first issue
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
              }}>
              {issues.map((issue) => (
                <Box
                  key={issue._id}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    },
                  }}
                  onClick={() => navigate(`/issues/${issue._id}`)}>
                  <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 14 }}>
                    {issue.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}>
                    {issue.description?.slice(0, 80)}
                    {issue.description?.length > 80 ? "…" : ""}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.75,
                      flexWrap: "wrap",
                      mt: 1,
                    }}>
                    <CategoryBadge category={issue.category} />
                    <StatusBadge status={issue.status} />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}>
                    📍 {issue.location} · 👍 {issue.upvotes} · 💬{" "}
                    {issue.comments?.length ?? 0}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Card>
      </motion.div>
    </Box>
  );
}

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Card,
//   CardContent,
//   Button,
//   Divider,
// } from "@mui/material";
// import { issuesService } from "../../../services/issuesService";
// import { useAuth } from "../../../context/AuthContext";

// export default function UserDashboard() {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   // Fetch all issues
//   useEffect(() => {
//     const fetchIssues = async () => {
//       try {
//         const res = await issuesService.getAllIssues();
//         const fetched = res.data?.issues || res.issues || [];
//         setIssues(fetched);
//       } catch (err) {
//         console.error("Dashboard failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssues();
//   }, []);

//   // Stats
//   const total = issues.length;
//   const resolved = issues.filter((i) => i.status === "Resolved").length;
//   const pending = issues.filter((i) => i.status !== "Resolved").length;

//   // Recent issues
//   const recent = issues.slice(0, 3);

//   // Glass style (reusable)
//   const glass = {
//     background: "rgba(255, 255, 255, 0.25)",
//     backdropFilter: "blur(14px)",
//     WebkitBackdropFilter: "blur(14px)",
//     borderRadius: "20px",
//     border: "1px solid rgba(255, 255, 255, 0.3)",
//     boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
//   };

//   return (
//     <Box
//       sx={{
//         px: 3,
//         py: 4,
//         maxWidth: "1100px",
//         mx: "auto",
//       }}>
//       {/* Top Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}>
//         <Box
//           sx={{
//             ...glass,
//             p: 3,
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}>
//           <Avatar
//             src={user?.avatar}
//             sx={{
//               width: 60,
//               height: 60,
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//             }}
//           />
//           <Box>
//             <Typography variant="h5" sx={{ fontWeight: 600 }}>
//               Welcome Back 👋
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Here’s your recent civic activity overview
//             </Typography>
//           </Box>
//         </Box>
//       </motion.div>

//       {/* Stats Section */}
//       <Box
//         sx={{
//           mt: 4,
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
//           gap: 3,
//         }}>
//         {[
//           { label: "Total Issues", value: total },
//           { label: "Resolved Issues", value: resolved },
//           { label: "Pending Issues", value: pending },
//         ].map((stat, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.15 }}>
//             <Card sx={{ ...glass, textAlign: "center", py: 2 }}>
//               <CardContent>
//                 <Typography variant="h4" sx={{ fontWeight: 700 }}>
//                   {stat.value}
//                 </Typography>
//                 <Typography variant="body2">{stat.label}</Typography>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </Box>

//       {/* Recent Activity */}
//       <motion.div
//         initial={{ opacity: 0, y: 25 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.35 }}>
//         <Card
//           sx={{
//             ...glass,
//             mt: 4,
//             p: 3,
//             // backgroundColor: "var(--color-bg-default)",
//           }}>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Recent Issues
//           </Typography>

//           <Divider sx={{ my: 2 }} />

//           {recent.length === 0 ? (
//             <Typography color="text.secondary">No recent issues.</Typography>
//           ) : (
//             recent.map((issue) => (
//               <Box
//                 key={issue._id}
//                 sx={{
//                   mb: 2,
//                   p: 2,
//                   borderRadius: "14px",
//                   background: "rgba(255, 255, 255, 0.2)",
//                 }}>
//                 <Typography sx={{ fontWeight: 600 }}>{issue.title}</Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Status: {issue.status} • Upvotes: {issue.upvotes}
//                 </Typography>
//               </Box>
//             ))
//           )}

//           <Button
//             variant="contained"
//             sx={{
//               mt: 1,
//               borderRadius: "12px",
//               textTransform: "none",
//               px: 3,
//             }}
//             onClick={() => (window.location.href = "/issues")}>
//             View All Issues
//           </Button>
//         </Card>
//       </motion.div>

//       {/* Full Issue List (Your existing component) */}
//       {/* Dashboard Issues in Flex/Grid Layout */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.4 }}>
//         <Card
//           sx={{
//             ...glass,
//             mt: 4,
//             p: 3,
//             // backgroundColor: "var(--color-bg-default)",
//           }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//             Issues
//           </Typography>

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr 1fr",
//                 md: "1fr 1fr 1fr",
//               },
//               gap: 2,
//             }}>
//             {issues.length === 0 ? (
//               <Typography color="text.secondary">
//                 No issues available.
//               </Typography>
//             ) : (
//               issues.map((issue) => (
//                 <Box
//                   key={issue._id}
//                   sx={{
//                     p: 2,
//                     borderRadius: "16px",
//                     background: "rgba(255,255,255,0.25)",
//                     backdropFilter: "blur(10px)",
//                     border: "1px solid rgba(255,255,255,0.3)",
//                     cursor: "pointer",
//                     transition: "0.2s",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//                     },
//                   }}
//                   onClick={() =>
//                     (window.location.href = `/issues/${issue._id}`)
//                   }>
//                   <Typography sx={{ fontWeight: 600, mb: 1 }}>
//                     {issue.title}
//                   </Typography>

//                   <Typography variant="body2" color="text.secondary">
//                     {issue.description?.slice(0, 80)}...
//                   </Typography>

//                   <Typography
//                     variant="caption"
//                     sx={{
//                       mt: 1,
//                       display: "block",
//                       fontWeight: 500,
//                       color: issue.status === "Resolved" ? "green" : "orange",
//                     }}>
//                     Status: {issue.status}
//                   </Typography>
//                 </Box>
//               ))
//             )}
//           </Box>
//         </Card>
//       </motion.div>
//     </Box>
//   );
// }
