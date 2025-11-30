import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Alert,
  Divider,
  Button,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import FormField from "../../../components/common/FormField";
import PasswordField from "../../../components/common/PasswordField";
import SelectField from "../../../components/common/SelectField";
import SubmitButton from "../../../components/common/SubmitButton";
import RoleToggle from "../../../components/common/RoleToggle";
import PageCard from "../../../components/common/PageCard";
import PasswordStrengthIndicator from "../../../components/common/PasswordStrengthIndicator";

import { API_ENDPOINTS } from "../../../config/api";

const ROLES = [
  "Commissioner",
  "Deputy Commissioner",
  "Chief Engineer",
  "Assistant Engineer",
  "Junior Engineer",
  "Sanitation Officer",
  "Health Officer",
  "Water Supply Officer",
  "Roads & Transport Officer",
  "Survey Officer",
  "Building Inspector",
  "Revenue Officer",
  "Accounts Officer",
  "Clerk",
  "Zonal Officer",
  "Ward Officer",
  "Fire Safety Officer",
  "Public Works Officer",
  "IT Officer",
  "Other",
];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    ssn: "",
    department: "",
    employeeId: "",
    designation: "",
    state: "",
    district: "",
    city: "",
    ward: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value) return "Full Name is required";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (!value) return "Confirm password is required";
        if (value !== form.password) return "Passwords do not match";
        break;
      case "ssn":
        if (role === "user" && !value) return "SSN is required";
        break;
      case "department":
        if (role === "admin" && !value) return "Department No is required";
        break;
      case "employeeId":
        if (role === "admin" && !value) return "Employee ID is required";
        if (role === "admin" && !/^[A-Za-z0-9-]+$/.test(value))
          return "Employee ID must be alphanumeric";
        break;
      case "designation":
        if (role === "admin" && !value) return "Designation is required";
        break;
      case "state":
      case "district":
      case "city":
      case "ward":
        if (role === "admin" && !value) return `${name} is required`;
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
      if (role === "user" && key === "department") return;
      if (role === "admin" && key === "ssn") return;
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
      const endpoint =
        role === "admin"
          ? API_ENDPOINTS.ADMIN_REGISTER
          : API_ENDPOINTS.REGISTER;

      const payload =
        role === "admin"
          ? {
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              confirmPassword: form.confirmPassword,
              role: "admin",
              department: form.department,
              employeeId: form.employeeId,
              designation: form.designation,
              state: form.state,
              district: form.district,
              city: form.city,
              ward: form.ward,
            }
          : {
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              confirmPassword: form.confirmPassword,
              role: "user",
              ssn: form.ssn,
            };

      const formDataToSend = new FormData();
      Object.keys(payload).forEach((key) => {
        formDataToSend.append(key, payload[key]);
      });
      if (avatar) formDataToSend.append("avatar", avatar);

      const res = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to register");
      }

      setSuccess(
        "Signup successful! Please check your email to verify your account."
      );
      setTimeout(() => navigate("/verify-email"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = ROLES.map((role) => ({ value: role, label: role }));

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Grid item xs={12} sm={10} md={6} lg={5}>
        <PageCard title="Sign Up" sx={{ maxWidth: 450, margin: "0 auto" }}>
          <div style={{ marginBottom: "20px" }}>
            <RoleToggle value={role} onChange={setRole} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 24,
            }}>
            <Avatar
              src={avatarPreview}
              sx={{ width: 90, height: 90, mb: 1.5 }}
            />
            <Button variant="contained" component="label" size="small">
              Choose Avatar
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
          </motion.div>

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
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.fullName}
              animationDelay={0.1}
            />
            <FormField
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.email}
              animationDelay={0.2}
            />
            <PasswordField
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.password}
              animationDelay={0.3}
            />
            <PasswordStrengthIndicator password={form.password} />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.confirmPassword}
              animationDelay={0.4}
            />

            <AnimatePresence mode="wait">
              {role === "user" ? (
                <motion.div
                  key="user-fields"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}>
                  <FormField
                    label="SSN"
                    name="ssn"
                    value={form.ssn}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.ssn}
                    animationDelay={0.5}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="admin-fields"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}>
                  <FormField
                    label="Department No"
                    name="department"
                    value={form.department || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.department}
                    animationDelay={0.5}
                  />
                  <FormField
                    label="Employee ID"
                    name="employeeId"
                    value={form.employeeId || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.employeeId}
                    animationDelay={0.6}
                  />
                  <SelectField
                    label="Designation"
                    name="designation"
                    value={form.designation || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors.designation}
                    options={roleOptions}
                    placeholder="Select Designation"
                    animationDelay={0.7}
                  />
                  {["state", "district", "city", "ward"].map((loc, index) => (
                    <FormField
                      key={loc}
                      label={
                        loc === "state"
                          ? "State"
                          : loc === "district"
                          ? "District"
                          : loc === "city"
                          ? "City / Municipality"
                          : "Ward / Zone"
                      }
                      name={loc}
                      value={form[loc] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={fieldErrors[loc]}
                      animationDelay={0.8 + index * 0.1}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <SubmitButton
              loading={loading}
              animationDelay={role === "admin" ? 1.2 : 0.6}>
              Sign Up
            </SubmitButton>

            <Divider sx={{ my: 2 }} />

            <Typography align="center" variant="body2">
              Already have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}>
                Login
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
// import { Typography, Alert, Divider, Button, Avatar } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// // Import reusable components
// import FormField from "../../../components/common/FormField";
// import PasswordField from "../../../components/common/PasswordField";
// import SelectField from "../../../components/common/SelectField";
// import SubmitButton from "../../../components/common/SubmitButton";
// import RoleToggle from "../../../components/common/RoleToggle";
// import PageCard from "../../../components/common/PageCard";
// import PasswordStrengthIndicator from "../../../components/common/PasswordStrengthIndicator";

// // Import API configuration
// import { API_ENDPOINTS } from "../../../config/api";

// const ROLES = [
//   "Commissioner",
//   "Deputy Commissioner",
//   "Chief Engineer",
//   "Assistant Engineer",
//   "Junior Engineer",
//   "Sanitation Officer",
//   "Health Officer",
//   "Water Supply Officer",
//   "Roads & Transport Officer",
//   "Survey Officer",
//   "Building Inspector",
//   "Revenue Officer",
//   "Accounts Officer",
//   "Clerk",
//   "Zonal Officer",
//   "Ward Officer",
//   "Fire Safety Officer",
//   "Public Works Officer",
//   "IT Officer",
//   "Other",
// ];

// export default function Signup() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("user");
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     ssn: "",
//     department: "",
//     employeeId: "",
//     designation: "",
//     state: "",
//     district: "",
//     city: "",
//     ward: "",
//   });
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatar(file);
//       setAvatarPreview(URL.createObjectURL(file));
//     }
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case "fullName":
//         if (!value) return "Full Name is required";
//         break;
//       case "email":
//         if (!value) return "Email is required";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
//         break;
//       case "password":
//         if (!value) return "Password is required";
//         if (value.length < 6) return "Password must be at least 6 characters";
//         break;
//       case "confirmPassword":
//         if (!value) return "Confirm password is required";
//         if (value !== form.password) return "Passwords do not match";
//         break;
//       case "ssn":
//         if (role === "user" && !value) return "SSN is required";
//         break;
//       case "department":
//         if (role === "admin" && !value) return "Department No is required";
//         break;
//       case "employeeId":
//         if (role === "admin" && !value) return "Employee ID is required";
//         if (role === "admin" && !/^[A-Za-z0-9-]+$/.test(value))
//           return "Employee ID must be alphanumeric";
//         break;
//       case "designation":
//         if (role === "admin" && !value) return "Designation is required";
//         break;
//       case "state":
//       case "district":
//       case "city":
//       case "ward":
//         if (role === "admin" && !value) return `${name} is required`;
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
//       if (role === "user" && key === "department") return;
//       if (role === "admin" && key === "ssn") return;
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
//       const endpoint =
//         role === "admin"
//           ? API_ENDPOINTS.ADMIN_REGISTER
//           : API_ENDPOINTS.REGISTER;

//       const payload =
//         role === "admin"
//           ? {
//               fullName: form.fullName,
//               email: form.email,
//               password: form.password,
//               confirmPassword: form.confirmPassword,
//               role: "admin",
//               department: form.department,
//               employeeId: form.employeeId,
//               designation: form.designation,
//               state: form.state,
//               district: form.district,
//               city: form.city,
//               ward: form.ward,
//             }
//           : {
//               fullName: form.fullName,
//               email: form.email,
//               password: form.password,
//               confirmPassword: form.confirmPassword,
//               role: "user",
//               ssn: form.ssn,
//             };

//       const formDataToSend = new FormData();
//       Object.keys(payload).forEach((key) => {
//         formDataToSend.append(key, payload[key]);
//       });
//       if (avatar) formDataToSend.append("avatar", avatar);

//       const res = await fetch(endpoint, {
//         method: "POST",
//         body: formDataToSend,
//         credentials: "include",
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.message || "Failed to register");
//       }

//       setSuccess(
//         "Signup successful! Please check your email to verify your account."
//       );
//       setTimeout(() => navigate("/verify-email"), 1800);
//     } catch (err) {
//       console.log("Signup error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const roleOptions = ROLES.map((role) => ({ value: role, label: role }));

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col xs={12} md={6} lg={5}>
//           <PageCard title="Sign Up" sx={{ maxWidth: 450, margin: "0 auto" }}>
//             <div style={{ marginBottom: "20px" }}>
//               <RoleToggle value={role} onChange={setRole} />
//             </div>

//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 marginBottom: 24, // theme spacing equivalent
//               }}>
//               <Avatar
//                 src={avatarPreview}
//                 sx={{
//                   width: 90,
//                   height: 90,
//                   // border: `3px solid ${themeValues.lightColors.grey[200]}`,
//                   mb: 1.5, // spacing between avatar and button
//                 }}
//               />
//               <Button variant="contained" component="label" size="small">
//                 Choose Avatar
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                 />
//               </Button>
//             </motion.div>

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
//                 label="Full Name"
//                 name="fullName"
//                 value={form.fullName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={fieldErrors.fullName}
//                 animationDelay={0.1}
//               />

//               <FormField
//                 label="Email"
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={fieldErrors.email}
//                 animationDelay={0.2}
//               />

//               <PasswordField
//                 value={form.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={fieldErrors.password}
//                 animationDelay={0.3}
//               />
//               <PasswordStrengthIndicator password={form.password} />

//               <PasswordField
//                 label="Confirm Password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={fieldErrors.confirmPassword}
//                 animationDelay={0.4}
//               />

//               <AnimatePresence mode="wait">
//                 {role === "user" ? (
//                   <motion.div
//                     key="user-fields"
//                     initial={{ opacity: 0, x: -30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 30 }}
//                     transition={{ duration: 0.4 }}>
//                     <FormField
//                       label="SSN"
//                       name="ssn"
//                       value={form.ssn}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={fieldErrors.ssn}
//                       animationDelay={0.5}
//                     />
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="admin-fields"
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -30 }}
//                     transition={{ duration: 0.4 }}>
//                     <FormField
//                       label="Department No"
//                       name="department"
//                       value={form.department || ""}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={fieldErrors.department}
//                       animationDelay={0.5}
//                     />

//                     <FormField
//                       label="Employee ID"
//                       name="employeeId"
//                       value={form.employeeId || ""}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={fieldErrors.employeeId}
//                       animationDelay={0.6}
//                     />

//                     <SelectField
//                       label="Designation"
//                       name="designation"
//                       value={form.designation || ""}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={fieldErrors.designation}
//                       options={roleOptions}
//                       placeholder="Select Designation"
//                       animationDelay={0.7}
//                     />

//                     {["state", "district", "city", "ward"].map((loc, index) => (
//                       <FormField
//                         key={loc}
//                         label={
//                           loc === "state"
//                             ? "State"
//                             : loc === "district"
//                             ? "District"
//                             : loc === "city"
//                             ? "City / Municipality"
//                             : "Ward / Zone"
//                         }
//                         name={loc}
//                         value={form[loc] || ""}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={fieldErrors[loc]}
//                         animationDelay={0.8 + index * 0.1}
//                       />
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <SubmitButton
//                 loading={loading}
//                 animationDelay={role === "admin" ? 1.2 : 0.6}>
//                 Sign Up
//               </SubmitButton>

//               <Divider sx={{ my: 2 }} />

//               <Typography align="center" variant="body2">
//                 Already have an account?{" "}
//                 <Button
//                   variant="text"
//                   onClick={() => navigate("/login")}
//                   sx={{ textTransform: "none" }}>
//                   Login
//                 </Button>
//               </Typography>
//             </form>
//           </PageCard>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
