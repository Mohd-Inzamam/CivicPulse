import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Alert, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";

// Import reusable components
import PageCard from "../../../components/common/PageCard";

// Import API configuration
import { API_ENDPOINTS } from "../../../config/api";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState("verifying"); // verifying, success, error, expired
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid verification link");
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.VERIFY_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 410) {
          setStatus("expired");
        } else {
          throw new Error(errorData.message || "Verification failed");
        }
        return;
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError("Email address not found. Please try logging in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.RESEND_VERIFICATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to resend verification email"
        );
      }

      setError(""); // Clear any previous errors
      // Show success message
      setTimeout(() => {
        setError("Verification email sent! Please check your inbox.");
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Verifying your email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your email address.
            </Typography>
          </div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", padding: "2rem" }}>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Email Verified!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your email has been successfully verified. You can now access all
              features of CivicPulse.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none" }}>
              Continue to Login
            </Button>
          </motion.div>
        );

      case "expired":
        return (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <EmailIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Verification Link Expired
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This verification link has expired. Please request a new one.
            </Typography>
            <Button
              variant="contained"
              onClick={resendVerification}
              disabled={loading}
              sx={{ textTransform: "none", mr: 2 }}>
              {loading ? <CircularProgress size={20} /> : "Resend Verification"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none" }}>
              Back to Login
            </Button>
          </div>
        );

      case "error":
      default:
        return (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verification Failed
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              There was an error verifying your email address.
            </Typography>
            <Button
              variant="contained"
              onClick={resendVerification}
              disabled={loading}
              sx={{ textTransform: "none", mr: 2 }}>
              {loading ? <CircularProgress size={20} /> : "Resend Verification"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none" }}>
              Back to Login
            </Button>
          </div>
        );
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <PageCard>
            {renderContent()}
            {error && status !== "error" && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </PageCard>
        </Col>
      </Row>
    </Container>
  );
}
