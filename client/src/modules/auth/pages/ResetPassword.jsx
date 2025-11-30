import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import PasswordField from "../../../components/common/PasswordField";
import SubmitButton from "../../../components/common/SubmitButton";
import PageCard from "../../../components/common/PageCard";
import { API_ENDPOINTS } from "../../../config/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      setTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(
          `${API_ENDPOINTS.VERIFY_RESET_TOKEN}?token=${token}`
        );
        if (!res.ok) throw new Error("Invalid or expired token");
        setTokenValid(true);
      } catch (err) {
        setError(err.message);
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password))
      return "Password must contain at least one special character";
    return null;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error =
      name === "password"
        ? validatePassword(value)
        : validateConfirmPassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword
    );

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password: formData.password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const commonBoxStyles = { textAlign: "center", padding: "2rem" };

  if (tokenValid === false) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <Grid item xs={12} sm={10} md={6} lg={5}>
          <PageCard title="Invalid Token">
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/login")}
              fullWidth>
              Back to Login
            </Button>
          </PageCard>
        </Grid>
      </Grid>
    );
  }

  if (tokenValid === null) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <Grid item xs={12} sm={10} md={6} lg={5}>
          <PageCard title="Verifying Token">
            <Box sx={commonBoxStyles}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Verifying reset token...
              </Typography>
            </Box>
          </PageCard>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Grid item xs={12} sm={10} md={6} lg={5}>
        <PageCard title="Set New Password">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}>
            Enter your new password below. Make sure it's strong and secure.
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
            <PasswordField
              label="New Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
              animationDelay={0.1}
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              animationDelay={0.2}
            />

            <SubmitButton loading={loading} animationDelay={0.3} sx={{ mt: 2 }}>
              Reset Password
            </SubmitButton>

            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/login")}
              sx={{ mt: 2, width: "100%", textTransform: "none" }}>
              Back to Login
            </Button>
          </form>
        </PageCard>
      </Grid>
    </Grid>
  );
}

// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Container, Row, Col } from "react-bootstrap";
// import { Typography, Alert, Button, CircularProgress } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// // Import reusable components
// import PasswordField from "../../../components/common/PasswordField";
// import SubmitButton from "../../../components/common/SubmitButton";
// import PageCard from "../../../components/common/PageCard";

// // Import API configuration
// import { API_ENDPOINTS } from "../../../config/api";

// export default function ResetPassword() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tokenValid, setTokenValid] = useState(null);

//   useEffect(() => {
//     // Validate token on component mount
//     if (!token) {
//       setError("Invalid or missing reset token");
//       setTokenValid(false);
//       return;
//     }

//     // Verify token with backend
//     const verifyToken = async () => {
//       try {
//         const res = await fetch(
//           `${API_ENDPOINTS.VERIFY_RESET_TOKEN}?token=${token}`
//         );
//         if (!res.ok) {
//           throw new Error("Invalid or expired token");
//         }
//         setTokenValid(true);
//       } catch (err) {
//         setError(err.message);
//         setTokenValid(false);
//       }
//     };

//     verifyToken();
//   }, [token]);

//   const validatePassword = (password) => {
//     if (!password) return "Password is required";
//     if (password.length < 8) return "Password must be at least 8 characters";
//     if (!/(?=.*[a-z])/.test(password))
//       return "Password must contain at least one lowercase letter";
//     if (!/(?=.*[A-Z])/.test(password))
//       return "Password must contain at least one uppercase letter";
//     if (!/(?=.*\d)/.test(password))
//       return "Password must contain at least one number";
//     if (!/(?=.*[@$!%*?&])/.test(password))
//       return "Password must contain at least one special character";
//     return null;
//   };

//   const validateConfirmPassword = (confirmPassword) => {
//     if (!confirmPassword) return "Please confirm your password";
//     if (confirmPassword !== formData.password) return "Passwords do not match";
//     return null;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let error = "";

//     if (name === "password") {
//       error = validatePassword(value);
//     } else if (name === "confirmPassword") {
//       error = validateConfirmPassword(value);
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const passwordError = validatePassword(formData.password);
//     const confirmPasswordError = validateConfirmPassword(
//       formData.confirmPassword
//     );

//     if (passwordError || confirmPasswordError) {
//       setErrors({
//         password: passwordError,
//         confirmPassword: confirmPasswordError,
//       });
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           token,
//           password: formData.password,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to reset password");
//       }

//       setSuccess("Password reset successfully! Redirecting to login...");
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (tokenValid === false) {
//     return (
//       <Container className="mt-5">
//         <Row className="justify-content-center">
//           <Col xs={12} md={6} lg={5}>
//             <PageCard title="Invalid Token">
//               <Alert severity="error" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//               <Button
//                 variant="contained"
//                 startIcon={<ArrowBackIcon />}
//                 onClick={() => navigate("/login")}
//                 fullWidth>
//                 Back to Login
//               </Button>
//             </PageCard>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   if (tokenValid === null) {
//     return (
//       <Container className="mt-5">
//         <Row className="justify-content-center">
//           <Col xs={12} md={6} lg={5}>
//             <PageCard title="Verifying Token">
//               <div style={{ textAlign: "center", padding: "2rem" }}>
//                 <CircularProgress />
//                 <Typography variant="body2" sx={{ mt: 2 }}>
//                   Verifying reset token...
//                 </Typography>
//               </div>
//             </PageCard>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col xs={12} md={6} lg={5}>
//           <PageCard title="Set New Password">
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               align="center"
//               sx={{ mb: 3 }}>
//               Enter your new password below. Make sure it's strong and secure.
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
//               <PasswordField
//                 label="New Password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={errors.password}
//                 helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
//                 animationDelay={0.1}
//               />

//               <PasswordField
//                 label="Confirm New Password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={errors.confirmPassword}
//                 animationDelay={0.2}
//               />

//               <SubmitButton
//                 loading={loading}
//                 animationDelay={0.3}
//                 sx={{ mt: 2 }}>
//                 Reset Password
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
//           </PageCard>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
