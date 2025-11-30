import { Typography, Button, Box, Grid } from "@mui/material";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import PageCard from "../components/common/PageCard";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={6} lg={5}>
          <PageCard>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center", padding: "2rem" }}>
              <LockIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />

              <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                Access Denied
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You don't have permission to access this page. Please contact
                your administrator if you believe this is an error.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{ textTransform: "none" }}>
                  Go Back
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                  sx={{ textTransform: "none" }}>
                  Go to Dashboard
                </Button>
              </Box>
            </motion.div>
          </PageCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Unauthorized;

// import { Container, Row, Col } from "react-bootstrap";
// import { Typography, Button, Box } from "@mui/material";
// import { motion } from "framer-motion";
// import LockIcon from "@mui/icons-material/Lock";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";
// import PageCard from "../components/common/PageCard";

// const Unauthorized = () => {
//   const navigate = useNavigate();

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col xs={12} md={6} lg={5}>
//           <PageCard>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//               style={{ textAlign: "center", padding: "2rem" }}>
//               <LockIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
//               <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
//                 Access Denied
//               </Typography>
//               <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//                 You don't have permission to access this page. Please contact
//                 your administrator if you believe this is an error.
//               </Typography>
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 2,
//                   justifyContent: "center",
//                   flexWrap: "wrap",
//                 }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<ArrowBackIcon />}
//                   onClick={() => navigate(-1)}
//                   sx={{ textTransform: "none" }}>
//                   Go Back
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   onClick={() => navigate("/dashboard")}
//                   sx={{ textTransform: "none" }}>
//                   Go to Dashboard
//                 </Button>
//               </Box>
//             </motion.div>
//           </PageCard>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Unauthorized;
