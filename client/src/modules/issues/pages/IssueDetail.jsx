import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import StatusBadge from "../../../components/common/StatusBadge";
import CategoryBadge from "../../../components/common/CategoryBadge";
import { issuesService } from "../../../services/issuesService";

function IssueDetail({ issues, setIssues }) {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedIssues, setVotedIssues] = useState([]);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
    setVotedIssues(storedVotes);
  }, []);

  // Fetch the issue directly — no parent dependency
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

  // Upvote
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

  if (loading) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Loading issue…
          </Typography>
        </Row>
      </Container>
    );
  }

  if (!issue) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h5" color="error">
                ❌ Issue not found
              </Typography>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={issue.image}
              alt={issue.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {issue.title}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="body1" gutterBottom>
                {issue.description}
              </Typography>

              <Row className="mt-3">
                <Col sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    📍 <b>Location:</b> {issue.location}
                  </Typography>
                </Col>
                <Col sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    🏷 <b>Category:</b>{" "}
                    <CategoryBadge category={issue.category} />
                  </Typography>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    🟢 <b>Status:</b> <StatusBadge status={issue.status} />
                  </Typography>
                </Col>
              </Row>

              {/* Upvote button */}
              <Row className="mt-4">
                <Col>
                  <Button
                    variant="outlined"
                    onClick={handleUpvote}
                    disabled={votedIssues.includes(issue._id)}
                    sx={{ textTransform: "none" }}>
                    👍 {votedIssues.includes(issue._id) ? "Voted" : "Upvote"} (
                    {issue.upvotes})
                  </Button>
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default IssueDetail;

// import { useParams } from "react-router-dom";
// import { Container, Row, Col } from "react-bootstrap";
// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Divider,
//   Button,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import StatusBadge from "../../../components/common/StatusBadge";
// import CategoryBadge from "../../../components/common/CategoryBadge";

// function IssueDetail({ issues, setIssues }) {
//   const { id } = useParams();
//   const issue = issues.find((item) => String(item.id) === id);

//   const [votedIssues, setVotedIssues] = useState([]);

//   useEffect(() => {
//     const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
//     setVotedIssues(storedVotes);
//   }, []);

//   const handleUpvote = () => {
//     if (votedIssues.includes(issue.id)) return;

//     setIssues((prevIssues) =>
//       prevIssues.map((it) =>
//         it.id === issue.id ? { ...it, upvotes: it.upvotes + 1 } : it
//       )
//     );

//     const updatedVotes = [...votedIssues, issue.id];
//     setVotedIssues(updatedVotes);
//     localStorage.setItem("votedIssues", JSON.stringify(updatedVotes));
//   };

//   if (!issue) {
//     return (
//       <Container className="my-5">
//         <Row className="justify-content-center">
//           <Col md={8}>
//             <Card sx={{ p: 3, textAlign: "center" }}>
//               <Typography variant="h5" color="error">
//                 ❌ Issue not found
//               </Typography>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
//             <CardMedia
//               component="img"
//               height="300"
//               image={issue.image}
//               alt={issue.title}
//             />
//             <CardContent>
//               <Typography variant="h4" gutterBottom>
//                 {issue.title}
//               </Typography>
//               <Divider sx={{ mb: 2 }} />
//               <Typography variant="body1" gutterBottom>
//                 {issue.description}
//               </Typography>

//               <Row className="mt-3">
//                 <Col sm={6}>
//                   <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                     📍 <b>Location:</b> {issue.location}
//                   </Typography>
//                 </Col>
//                 <Col sm={6}>
//                   <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                     🏷 <b>Category:</b>{" "}
//                     <CategoryBadge category={issue.category} />
//                   </Typography>
//                 </Col>
//               </Row>

//               <Row className="mt-3">
//                 <Col>
//                   <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                     ✅ <b>Status:</b> <StatusBadge status={issue.status} />
//                   </Typography>
//                 </Col>
//               </Row>

//               {/* Upvote button */}
//               <Row className="mt-4">
//                 <Col>
//                   <Button
//                     variant="outlined"
//                     onClick={handleUpvote}
//                     disabled={votedIssues.includes(issue.id)}
//                     sx={{ textTransform: "none" }}>
//                     👍 {votedIssues.includes(issue.id) ? "Voted" : "Upvote"} (
//                     {issue.upvotes})
//                   </Button>
//                 </Col>
//               </Row>
//             </CardContent>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default IssueDetail;
