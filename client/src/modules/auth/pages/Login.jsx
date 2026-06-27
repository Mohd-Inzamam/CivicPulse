import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormField from "../../../components/common/FormField";
import PasswordField from "../../../components/common/PasswordField";
import SubmitButton from "../../../components/common/SubmitButton";
import RoleToggle from "../../../components/common/RoleToggle";
import PageCard from "../../../components/common/PageCard";
import { API_ENDPOINTS } from "../../../config/api";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "40px 16px",
        background: "var(--page-bg)",
      }}>
      <PageCard
        title="Welcome back"
        subtitle="Sign in to your CivicPulse account">
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

        {error && (
          <div className="alert alert-error">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <i className="ti ti-circle-check" aria-hidden="true" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldErrors.email}
            placeholder="you@example.com"
            required
          />

          <PasswordField
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldErrors.password}
          />

          {/* Admin-only fields — CSS transition instead of AnimatePresence */}
          {role === "admin" && (
            <div
              style={{
                borderTop: "0.5px solid var(--border-subtle)",
                paddingTop: 16,
                marginTop: 8,
              }}>
              <FormField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.department}
                placeholder="Enter your department"
                required
              />
              <FormField
                label="Employee ID"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.employeeId}
                placeholder="e.g. EMP-1234"
                required
              />
            </div>
          )}

          {/* Remember me + Forgot password row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "12px 0",
            }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--ink-secondary)",
                cursor: "pointer",
              }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: "var(--accent)" }}
              />
              Remember me
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </button>
          </div>

          <SubmitButton loading={loading}>Login</SubmitButton>

          <div className="divider-labeled" style={{ margin: "16px 0" }}>
            or
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--ink-tertiary)",
            }}>
            Don't have an account?{" "}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </p>
        </form>
      </PageCard>
    </div>
  );
}
