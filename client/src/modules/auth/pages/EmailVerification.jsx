import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageCard from "../../../components/common/PageCard";
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
        if (res.status === 410) setStatus("expired");
        else throw new Error(errorData.message || "Verification failed");
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
          errorData.message || "Failed to resend verification email",
        );
      }
      setError("Verification email sent! Please check your inbox.");
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
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <span
              className="spinner"
              style={{ "--sz": "48px" }}
              role="status"
              aria-label="Verifying email"
            />
            <h3
              style={{
                marginTop: 16,
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ink-primary)",
              }}>
              Verifying your email...
            </h3>
            <p
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "var(--ink-tertiary)",
              }}>
              Please wait a moment.
            </p>
          </div>
        );

      case "success":
        return (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 64 }}>✅</div>
            <h2
              style={{
                marginTop: 16,
                fontSize: 22,
                fontWeight: 700,
                color: "var(--ink-primary)",
              }}>
              Email verified!
            </h2>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "var(--ink-tertiary)",
                marginBottom: 24,
              }}>
              Your account is active. You can now sign in and start reporting
              issues.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}>
              Continue to login
            </button>
          </div>
        );

      case "expired":
        return (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 64 }}>📧</div>
            <h2
              style={{
                marginTop: 16,
                fontSize: 20,
                fontWeight: 700,
                color: "var(--ink-primary)",
              }}>
              Link expired
            </h2>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "var(--ink-tertiary)",
                marginBottom: 24,
              }}>
              This verification link has expired. Request a new one.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={resendVerification}>
                {loading ? (
                  <span className="spinner" role="status" />
                ) : (
                  "Resend verification"
                )}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/login")}>
                Back to login
              </button>
            </div>
          </div>
        );

      default: // error
        return (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              <i className="ti ti-alert-circle" aria-hidden="true" /> {error}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--ink-primary)",
              }}>
              Verification failed
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-tertiary)",
                marginBottom: 24,
              }}>
              There was a problem verifying your email.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={resendVerification}>
                {loading ? (
                  <span className="spinner" role="status" />
                ) : (
                  "Resend verification"
                )}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/login")}>
                Back to login
              </button>
            </div>
          </div>
        );
    }
  };

  // Outer wrapper — replace <Grid container> with:
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
      <PageCard>{renderContent()}</PageCard>
    </div>
  );
}
