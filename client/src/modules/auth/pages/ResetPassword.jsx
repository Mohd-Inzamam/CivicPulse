import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
          `${API_ENDPOINTS.VERIFY_RESET_TOKEN}?token=${token}`,
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
    const errorMsg =
      name === "password"
        ? validatePassword(value)
        : validateConfirmPassword(value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
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

  if (tokenValid === false) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 16,
        }}>
        <PageCard title="Invalid link">
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <i className="ti ti-alert-circle" aria-hidden="true" /> {error}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={() => navigate("/login")}>
            <i className="ti ti-arrow-left" style={{ marginRight: 8 }} /> Back to login
          </button>
        </PageCard>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 16,
        }}>
        <PageCard title="Verifying link">
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <span
              className="spinner"
              style={{ "--sz": "40px" }}
              role="status"
              aria-label="Verifying token"
            />
            <p
              style={{
                marginTop: 12,
                color: "var(--ink-tertiary)",
                fontSize: 13,
                margin: 0
              }}>
              Verifying reset token...
            </p>
          </div>
        </PageCard>
      </div>
    );
  }

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
        title="Set new password"
        subtitle="Make sure it's strong — 8+ chars, upper, lower, number, symbol.">
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <i className="ti ti-alert-circle" aria-hidden="true" /> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: 16 }}>
            <i className="ti ti-circle-check" aria-hidden="true" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <PasswordField
            label="New password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm new password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <SubmitButton loading={loading} style={{ marginTop: 8 }}>
            Reset password
          </SubmitButton>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => navigate("/login")}>
            <i className="ti ti-arrow-left" style={{ marginRight: 8 }} /> Back to login
          </button>
        </form>
      </PageCard>
    </div>
  );
}
