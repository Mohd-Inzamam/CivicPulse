import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Grow,
} from "@mui/material";
import { motion } from "framer-motion";

const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return { color: "#f44336", label: "Open" };
    case "In Progress":
      return { color: "#ff9800", label: "In Progress" };
    case "Resolved":
      return { color: "#4caf50", label: "Resolved" };
    default:
      return { color: "#9e9e9e", label: status };
  }
};

export default function IssuesTable({ issues, handleStatusChange }) {
  return (
    <Grow in timeout={800}>
      <Card sx={{ boxShadow: "var(--shadow-medium)", borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Recent Issues
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: "var(--shadow-light)" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Update Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((issue, index) => {
                  const issueId = issue._id || issue.id;
                  return (
                    <motion.tr
                      key={issueId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}>
                      <TableCell>{issueId || "N/A"}</TableCell>
                      <TableCell>{issue.title}</TableCell>
                      <TableCell>
                        {issue.createdBy?.fullName || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            display: "inline-block",
                            borderRadius: "16px",
                            padding: "4px 10px",
                            color: "white",
                            backgroundColor: getStatusColor(issue.status).color,
                            fontWeight: 600,
                            fontSize: "0.8rem",
                          }}>
                          {getStatusColor(issue.status).label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={issue.status}
                          onChange={(e) =>
                            handleStatusChange(issueId, e.target.value)
                          }
                          size="small"
                          sx={{
                            minWidth: 130,
                            borderRadius: "8px",
                            background: "var(--color-bg-paper)",
                          }}>
                          <MenuItem value="Open">Open</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Resolved">Resolved</MenuItem>
                        </Select>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grow>
  );
}

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Select,
//   MenuItem,
//   Typography,
//   Card,
//   CardContent,
//   Grow,
// } from "@mui/material";
// import { motion } from "framer-motion";

// // Helper to map status to color
// const getStatusColor = (status) => {
//   switch (status) {
//     case "Open":
//       return { color: "error", label: "Open" };
//     case "In Progress":
//       return { color: "warning", label: "In Progress" };
//     case "Resolved":
//       return { color: "success", label: "Resolved" };
//     default:
//       return { color: "default", label: status };
//   }
// };

// export default function IssuesTable({ issues, handleStatusChange }) {
//   return (
//     <Grow in timeout={800}>
//       <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
//         <CardContent>
//           <Typography
//             variant="h4"
//             gutterBottom
//             component={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}>
//             Admin Dashboard
//           </Typography>

//           <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <b>ID</b>
//                   </TableCell>
//                   <TableCell>
//                     <b>Issue</b>
//                   </TableCell>
//                   <TableCell>
//                     <b>Reporter</b>
//                   </TableCell>
//                   <TableCell>
//                     <b>Status</b>
//                   </TableCell>
//                   <TableCell>
//                     <b>Update Status</b>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {issues.map((issue, index) => {
//                   const issueId = issue._id || issue.id;
//                   return (
//                     <motion.tr
//                       key={issueId || index}
//                       initial={{ opacity: 0, x: -50 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.4, delay: index * 0.2 }}>
//                       <TableCell>{issueId || "N/A"}</TableCell>
//                       <TableCell>{issue.title}</TableCell>
//                       <TableCell>
//                         {issue.createdBy?.fullName || "Unknown"}
//                       </TableCell>
//                       <TableCell>
//                         <motion.div
//                           initial={false}
//                           animate={{
//                             backgroundColor:
//                               getStatusColor(issue.status).color === "error"
//                                 ? "#f44336"
//                                 : getStatusColor(issue.status).color ===
//                                   "warning"
//                                 ? "#ff9800"
//                                 : getStatusColor(issue.status).color ===
//                                   "success"
//                                 ? "#4caf50"
//                                 : "#e0e0e0",
//                           }}
//                           transition={{ duration: 0.5 }}
//                           style={{
//                             display: "inline-block",
//                             borderRadius: "16px",
//                             padding: "4px 12px",
//                           }}>
//                           <Typography
//                             variant="body2"
//                             sx={{ color: "white", fontWeight: "bold" }}>
//                             {getStatusColor(issue.status).label}
//                           </Typography>
//                         </motion.div>
//                       </TableCell>
//                       <TableCell>
//                         <Select
//                           value={issue.status}
//                           onChange={(e) =>
//                             handleStatusChange(issueId, e.target.value)
//                           }
//                           size="small"
//                           sx={{
//                             background: "#f5f5f5",
//                             borderRadius: "8px",
//                             minWidth: "140px",
//                           }}>
//                           <MenuItem value="Open">Open</MenuItem>
//                           <MenuItem value="In Progress">In Progress</MenuItem>
//                           <MenuItem value="Resolved">Resolved</MenuItem>
//                         </Select>
//                       </TableCell>
//                     </motion.tr>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>
//     </Grow>
//   );
// }
