import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
  Button,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import FormField from "../../../components/common/FormField";
import PasswordField from "../../../components/common/PasswordField";
import SubmitButton from "../../../components/common/SubmitButton";
import RoleToggle from "../../../components/common/RoleToggle";
import PageCard from "../../../components/common/PageCard";
import { API_ENDPOINTS } from "../../../config/api";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();

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

  const glass = theme.palette.glass || {
    background: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.35)",
    blur: "18px",
    shadow: "0 4px 20px rgba(0,0,0,0.1)",
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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
        credentials: "include",
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
      const token = data.data?.accessToken || data.accessToken;
      const user = data.data?.user;

      if (!token) throw new Error("No token received from server");

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user?.role || role);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      login(user);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        const userRole = user?.role || role;
        if (userRole === "admin") navigate("/dashboard", { replace: true });
        else navigate("/user-dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Grid item xs={12} sm={10} md={6} lg={5}>
        <PageCard
          title="Login"
          sx={{
            maxWidth: 420,
            background: glass.background,
            backdropFilter: `blur(${glass.blur}) saturate(180%)`,
            border: glass.border,
            boxShadow: glass.shadow,
          }}>
          <div className="mb-3">
            <RoleToggle
              value={role}
              onChange={(val) => {
                setRole(val);
                setForm({
                  email: "",
                  password: "",
                  department: "",
                  employeeId: "",
                });
                setFieldErrors({});
              }}
            />
          </div>

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
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.email}
              animationDelay={0.1}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: theme.shape.borderRadius,
                },
              }}
            />
            <PasswordField
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.password}
              animationDelay={0.2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: theme.shape.borderRadius,
                },
              }}
            />

            <AnimatePresence mode="wait">
              {role === "admin" && (
                <motion.div
                  key="admin-fields"
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
                    placeholder="Enter your department"
                    animationDelay={0.3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: theme.shape.borderRadius,
                      },
                    }}
                  />
                  <FormField
                    label="Employee ID"
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.employeeId}
                    placeholder="Enter your employee ID"
                    animationDelay={0.4}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: theme.shape.borderRadius,
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: theme.palette.primary.main,
                }}>
                Forgot Password?
              </Button>
            </Grid>

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
          </form>
        </PageCard>
      </Grid>
    </Grid>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Row, Col } from "react-bootstrap";
// import {
//   Typography,
//   Alert,
//   Divider,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   useTheme,
// } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// import FormField from "../../../components/common/FormField";
// import PasswordField from "../../../components/common/PasswordField";
// import SubmitButton from "../../../components/common/SubmitButton";
// import RoleToggle from "../../../components/common/RoleToggle";
// import PageCard from "../../../components/common/PageCard";

// import { API_ENDPOINTS } from "../../../config/api";
// import { useAuth } from "../../../context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const { login } = useAuth();

//   const [role, setRole] = useState("user");
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     department: "",
//     employeeId: "",
//   });
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const glass = theme.palette.glass || {
//     background: "rgba(255,255,255,0.25)",
//     border: "1px solid rgba(255,255,255,0.35)",
//     blur: "18px",
//     shadow: "0 4px 20px rgba(0,0,0,0.1)",
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case "email":
//         if (!value) return "Email is required";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
//         break;
//       case "password":
//         if (!value) return "Password is required";
//         if (value.length < 6) return "Password must be at least 6 characters";
//         break;
//       case "department":
//         if (role === "admin" && !value) return "Department is required";
//         break;
//       case "employeeId":
//         if (role === "admin" && !value) return "Employee ID is required";
//         if (role === "admin" && !/^[A-Za-z0-9-]+$/.test(value))
//           return "Employee ID must be alphanumeric";
//         break;
//       default:
//         return null;
//     }
//     return null;
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     const errorMsg = validateField(name, value);
//     setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};
//     Object.keys(form).forEach((key) => {
//       if (role === "user" && (key === "department" || key === "employeeId"))
//         return;
//       const msg = validateField(key, form[key]);
//       if (msg) newErrors[key] = msg;
//     });
//     if (Object.keys(newErrors).length > 0) {
//       setFieldErrors(newErrors);
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(API_ENDPOINTS.LOGIN, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ ...form, role, rememberMe }),
//       });

//       if (!res.ok) {
//         let errorData;
//         try {
//           errorData = await res.json();
//         } catch {
//           errorData = { message: "Unexpected server response" };
//         }
//         throw new Error(errorData.message || "Failed to login");
//       }

//       const data = await res.json();
//       const token = data.data?.accessToken || data.accessToken;
//       const user = data.data?.user;

//       if (!token) throw new Error("No token received from server");

//       localStorage.setItem("token", token);
//       localStorage.setItem("userRole", user?.role || role);
//       if (user) localStorage.setItem("user", JSON.stringify(user));

//       login(user);

//       setSuccess("Login successful! Redirecting...");
//       setTimeout(() => {
//         const userRole = user?.role || role;
//         if (userRole === "admin")
//           navigate("/admin/dashboard", { replace: true });
//         else navigate("/user-dashboard", { replace: true });
//       }, 1500);
//     } catch (err) {
//       setError(err.message || "An error occurred during login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col xs={12} md={6} lg={5}>
//           <PageCard
//             title="Login"
//             sx={{
//               maxWidth: 420,
//               background: glass.background,
//               backdropFilter: `blur(${glass.blur}) saturate(180%)`,
//               border: glass.border,
//               boxShadow: glass.shadow,
//             }}>
//             <div className="mb-3">
//               <RoleToggle
//                 value={role}
//                 onChange={(val) => {
//                   setRole(val);
//                   setForm({
//                     email: "",
//                     password: "",
//                     department: "",
//                     employeeId: "",
//                   });
//                   setFieldErrors({});
//                 }}
//               />
//             </div>

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
//                 label="Email"
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={fieldErrors.email}
//                 animationDelay={0.1}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: theme.shape.borderRadius,
//                   },
//                 }}
//               />
//               <PasswordField
//                 value={form.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={fieldErrors.password}
//                 animationDelay={0.2}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: theme.shape.borderRadius,
//                   },
//                 }}
//               />

//               <AnimatePresence mode="wait">
//                 {role === "admin" && (
//                   <motion.div
//                     key="admin-fields"
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -30 }}
//                     transition={{ duration: 0.4 }}>
//                     <FormField
//                       label="Department"
//                       name="department"
//                       value={form.department}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={fieldErrors.department}
//                       placeholder="Enter your department"
//                       animationDelay={0.3}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: theme.shape.borderRadius,
//                         },
//                       }}
//                     />
//                     <FormField
//                       label="Employee ID"
//                       name="employeeId"
//                       value={form.employeeId}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={fieldErrors.employeeId}
//                       placeholder="Enter your employee ID"
//                       animationDelay={0.4}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: theme.shape.borderRadius,
//                         },
//                       }}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginTop: 16,
//                   marginBottom: 8,
//                 }}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
//                     />
//                   }
//                   label={<Typography variant="body2">Remember me</Typography>}
//                 />
//                 <Button
//                   variant="text"
//                   size="small"
//                   onClick={() => navigate("/forgot-password")}
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "0.875rem",
//                     color: theme.palette.primary.main,
//                     "&:hover": {
//                       backgroundColor: "rgba(25,118,210,0.04)",
//                     },
//                   }}>
//                   Forgot Password?
//                 </Button>
//               </div>

//               <SubmitButton
//                 loading={loading}
//                 animationDelay={role === "admin" ? 0.6 : 0.4}>
//                 Login
//               </SubmitButton>

//               <Divider sx={{ my: 2 }} />

//               <Typography align="center" variant="body2">
//                 Don't have an account?{" "}
//                 <Button
//                   variant="text"
//                   onClick={() => navigate("/signup")}
//                   sx={{ textTransform: "none" }}>
//                   Sign Up
//                 </Button>
//               </Typography>
//             </form>
//           </PageCard>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
