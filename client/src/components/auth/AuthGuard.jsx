import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAuth } from "../../../src/context/AuthContext";

const AuthGuard = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // ⏳ Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: "background.default" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying authentication...
        </Typography>
      </Box>
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

  // 🚫 Email not verified for dashboard routes
  if (location.pathname.startsWith("/dashboard") && !user.isEmailVerified) {
    console.log("AuthGuard: Email not verified for dashboard access");
    return <Navigate to="/verify-email" replace />;
  }

  console.log("AuthGuard: ✅ Access granted");
  return children;
};

export default AuthGuard;
