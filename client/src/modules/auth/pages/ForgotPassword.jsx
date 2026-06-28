import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        title="Reset password"
        subtitle="Enter your email and we'll send you a reset link.">
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
          <FormField
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            placeholder="you@example.com"
            required
          />

          <SubmitButton loading={loading} style={{ marginTop: 8 }}>
            Send reset link
          </SubmitButton>
        </form>

        <div className="divider-labeled" style={{ margin: "16px 0" }} />

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--ink-tertiary)",
          }}>
          Remember your password?{" "}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/login")}>
            Sign in
          </button>
        </p>
      </PageCard>
    </div>
  );
}
