import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        "Signup successful! Please check your email to verify your account.",
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
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 500 }}>
        <PageCard title="Sign Up" subtitle="Create your CivicPulse account">
          <div style={{ marginBottom: 24 }}>
            <RoleToggle value={role} onChange={setRole} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24, animation: "fadeInUp 0.3s ease-out" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--surface-muted)",
                  overflow: "hidden",
                  border: "2px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <i className="ti ti-user" style={{ fontSize: 32, color: "var(--ink-disabled)" }} />
                )}
              </div>
              
              <label className="btn btn-outline" style={{ cursor: "pointer", borderRadius: 20, padding: "4px 12px", fontSize: "0.875rem" }}>
                <i className="ti ti-upload" style={{ marginRight: 6 }} /> Upload photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              <i className="ti ti-alert-circle" /> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: 16 }}>
              <i className="ti ti-circle-check" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.fullName}
            />
            <FormField
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.email}
            />
            <PasswordField
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.password}
            />
            <PasswordStrengthIndicator password={form.password} />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.confirmPassword}
            />

            {role === "user" ? (
              <FormField
                label="Phone (optional)"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            ) : (
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, marginTop: 16, animation: "fadeInUp 0.3s ease-out" }}>
                <FormField
                  label="Department No"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={fieldErrors.department}
                  required
                />
                <FormField
                  label="Employee ID"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={fieldErrors.employeeId}
                  required
                />
                <SelectField
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  error={fieldErrors.designation}
                  options={roleOptions}
                  placeholder="Select designation"
                  required
                />
                {["state", "district", "city", "ward"].map((loc) => (
                  <FormField
                    key={loc}
                    label={
                      loc === "city"
                        ? "City / Municipality"
                        : loc === "ward"
                          ? "Ward / Zone"
                          : loc.charAt(0).toUpperCase() + loc.slice(1)
                    }
                    name={loc}
                    value={form[loc]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={fieldErrors[loc]}
                    required
                  />
                ))}
              </div>
            )}

            <SubmitButton loading={loading}>
              Sign Up
            </SubmitButton>

            <div className="divider-labeled" style={{ margin: "24px 0 16px" }}>
              or
            </div>
            
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-tertiary)", margin: 0 }}>
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: "4px 8px", fontSize: "0.875rem" }}
                onClick={() => navigate("/login")}>
                Login
              </button>
            </p>
          </form>
        </PageCard>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
