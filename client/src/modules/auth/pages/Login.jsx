import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Typography,
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Import reusable components
import FormField from "../../../components/common/FormField";
import PasswordField from "../../../components/common/PasswordField";
import SubmitButton from "../../../components/common/SubmitButton";
import RoleToggle from "../../../components/common/RoleToggle";
import PageCard from "../../../components/common/PageCard";

// Import API configuration
import { API_ENDPOINTS } from "../../../config/api";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    email: "",
    password: "",
    department: "",
    employeeId: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      case "department":
        if (role === "admin" && !value) return "Department is required";
        break;
      case "employeeId":
        if (role === "admin" && !value) return "Employee ID is required";
        if (role === "admin" && !/^[A-Za-z0-9-]+$/.test(value))
          return "Employee ID must be alphanumeric";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (role === "user" && (key === "department" || key === "employeeId"))
        return;

      const msg = validateField(key, form[key]);
      if (msg) newErrors[key] = msg;
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ ...form, role, rememberMe }),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: "Unexpected server response" };
        }
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await res.json();
      console.log("Login response:", data);

      // ✅ Backend returns accessToken, not token
      const token = data.data?.accessToken || data.accessToken;
      const user = data.data?.user;

      if (!token) {
        throw new Error("No token received from server");
      }

      console.log("Storing auth data:", {
        token: token.substring(0, 20) + "...",
        user: user?.email,
      });

      // Clear any old data first
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");

      // Store new data
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user?.role || role);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      console.log("Auth data stored successfully");

      // ✅ NEW: Update AuthContext so Navbar re-renders instantly
      login(user);

      setSuccess("Login successful! Redirecting...");

      // Redirect based on role
      setTimeout(() => {
        const userRole = user?.role || role;
        console.log("Login: Redirecting to dashboard, user role:", userRole);

        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/issues", { replace: true });
        }
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <PageCard title="Login">
            {/* Role toggle */}
            <div className="mb-3">
              <RoleToggle value={role} onChange={setRole} />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}>
                  <Alert severity="error" className="mb-3">
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
                    className="mb-3">
                    {success}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <FormField
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.email}
                animationDelay={0.1}
              />

              <PasswordField
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.password}
                animationDelay={0.2}
              />

              {/* Conditional Admin Fields */}
              <AnimatePresence mode="wait">
                {role === "admin" ? (
                  <motion.div
                    key="admin-login-fields"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}>
                    <FormField
                      label="Department"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={fieldErrors.department}
                      helperText="e.g., Public Works, Water Supply"
                      placeholder="Enter your department"
                      animationDelay={0.3}
                    />

                    <FormField
                      label="Employee ID"
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={fieldErrors.employeeId}
                      helperText="Official employee identification"
                      placeholder="e.g., EMP-2024-001"
                      animationDelay={0.4}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Remember me checkbox and forgot password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: role === "admin" ? 0.5 : 0.3,
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                  marginBottom: "8px",
                }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Remember me
                    </Typography>
                  }
                />
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: "0.875rem",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                  onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                </Button>
              </motion.div>

              <SubmitButton
                loading={loading}
                animationDelay={role === "admin" ? 0.6 : 0.4}>
                Login
              </SubmitButton>

              <Divider sx={{ my: 2 }} />

              <Typography align="center" variant="body2">
                Don't have an account?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/signup")}
                  sx={{ textTransform: "none" }}>
                  Sign Up
                </Button>
              </Typography>

              {/* Quick Demo Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: role === "admin" ? 0.8 : 0.6,
                }}>
                <Typography
                  align="center"
                  variant="caption"
                  sx={{ mt: 2, color: "text.secondary" }}>
                  {role === "admin"
                    ? "Demo Admin: admin@demo.com | password123 | Dept: IT | ID: EMP-001"
                    : "Demo User: user@demo.com | password123"}
                </Typography>
              </motion.div>
            </form>
          </PageCard>
        </Col>
      </Row>
    </Container>
  );
}
