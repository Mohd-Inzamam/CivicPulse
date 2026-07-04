import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../src/context/AuthContext";

const AuthGuard = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // ⏳ Show loading spinner while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "var(--surface-base)",
        }}
      >
        <div
          className="spinner"
          style={{ "--sz": "60px", color: "var(--accent)" }}
          role="status"
          aria-label="Loading"
        />
        <h6 style={{ marginTop: 16, fontSize: "1.25rem", fontWeight: 500, color: "var(--ink-primary)" }}>
          Verifying authentication...
        </h6>
      </div>
    );
  }

  // 🚫 Not authenticated → redirect to login
  if (!user) {
    console.log("AuthGuard: Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Role-based access check
  if (
    requiredRole &&
    Array.isArray(requiredRole) &&
    !requiredRole.includes(user.role)
  ) {
    console.log(
      `AuthGuard: Unauthorized — Required: ${requiredRole.join(",")}, Found: ${
        user.role
      }`
    );
    return <Navigate to="/" replace />;
  }
  
  if (
    requiredRole &&
    !Array.isArray(requiredRole) &&
    requiredRole !== user.role
  ) {
    console.log(
      `AuthGuard: Unauthorized — Required: ${requiredRole}, Found: ${
        user.role
      }`
    );
    return <Navigate to="/" replace />;
  }

  // 🚫 Email not verified for dashboard routes
  if (location.pathname.startsWith("/dashboard") && !user.isEmailVerified) {
    console.log("AuthGuard: Email not verified for dashboard access");
    return <Navigate to="/verify-email" replace />;
  }

  console.log("AuthGuard: ✅ Access granted");
  return children;
};

export default AuthGuard;
