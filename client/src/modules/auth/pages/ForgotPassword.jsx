import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Alert, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import FormField from "../../../components/common/FormField";
import SubmitButton from "../../../components/common/SubmitButton";
import PageCard from "../../../components/common/PageCard";
import { API_ENDPOINTS } from "../../../config/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";
    return null;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSuccess("Password reset link sent to your email!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Grid item xs={12} sm={10} md={6} lg={5}>
        <PageCard sx={{ maxWidth: 420 }} title="Reset Password">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  sx={{ mb: 3 }}>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <FormField
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              placeholder="Enter your email address"
              animationDelay={0.1}
            />

            <SubmitButton loading={loading} animationDelay={0.2} sx={{ mt: 2 }}>
              Send Reset Link
            </SubmitButton>

            <Button
              variant="text"
              onClick={() => navigate("/login")}
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2, width: "100%", textTransform: "none" }}>
              Back to Login
            </Button>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ mt: 3, display: "block" }}>
            Remember your password?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none", p: 0, minWidth: "auto" }}>
              Sign in
            </Button>
          </Typography>
        </PageCard>
      </Grid>
    </Grid>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Row, Col } from "react-bootstrap";
// import { Typography, Alert, Button, CircularProgress } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// // Import reusable components
// import FormField from "../../../components/common/FormField";
// import SubmitButton from "../../../components/common/SubmitButton";
// import PageCard from "../../../components/common/PageCard";

// // Import API configuration
// import { API_ENDPOINTS } from "../../../config/api";

// export default function ForgotPassword() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [emailError, setEmailError] = useState("");

//   const validateEmail = (email) => {
//     if (!email) return "Email is required";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//       return "Invalid email format";
//     return null;
//   };

//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);
//     setEmailError(validateEmail(value));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const emailValidationError = validateEmail(email);
//     if (emailValidationError) {
//       setEmailError(emailValidationError);
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to send reset email");
//       }

//       setSuccess("Password reset link sent to your email!");
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col xs={12} md={6} lg={5}>
//           <PageCard sx={{ maxWidth: 420 }} title="Reset Password">
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               align="center"
//               sx={{ mb: 3 }}>
//               Enter your email address and we'll send you a link to reset your
//               password.
//             </Typography>

//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.3 }}>
//                   <Alert severity="error" className="mb-3">
//                     {error}
//                   </Alert>
//                 </motion.div>
//               )}

//               {success && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.3 }}>
//                   <Alert
//                     severity="success"
//                     icon={<CheckCircleIcon fontSize="inherit" />}
//                     className="mb-3">
//                     {success}
//                   </Alert>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <form onSubmit={handleSubmit}>
//               <FormField
//                 label="Email Address"
//                 type="email"
//                 name="email"
//                 value={email}
//                 onChange={handleEmailChange}
//                 error={emailError}
//                 placeholder="Enter your email address"
//                 animationDelay={0.1}
//               />

//               <SubmitButton
//                 loading={loading}
//                 animationDelay={0.2}
//                 sx={{ mt: 2 }}>
//                 Send Reset Link
//               </SubmitButton>

//               <Button
//                 variant="text"
//                 startIcon={<ArrowBackIcon />}
//                 onClick={() => navigate("/login")}
//                 sx={{
//                   mt: 2,
//                   width: "100%",
//                   textTransform: "none",
//                 }}>
//                 Back to Login
//               </Button>
//             </form>

//             <Typography
//               variant="caption"
//               color="text.secondary"
//               align="center"
//               sx={{ mt: 3, display: "block" }}>
//               Remember your password?{" "}
//               <Button
//                 variant="text"
//                 onClick={() => navigate("/login")}
//                 sx={{ textTransform: "none", p: 0, minWidth: "auto" }}>
//                 Sign in
//               </Button>
//             </Typography>
//           </PageCard>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
