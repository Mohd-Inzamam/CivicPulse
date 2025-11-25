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

// import { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { CircularProgress, Box, Typography } from "@mui/material";
// import { API_ENDPOINTS } from "../../config/api";

// const AuthGuard = ({ children, requiredRole = null }) => {
//   const location = useLocation();
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     user: null,
//     loading: true,
//   });

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         console.log("AuthGuard: Checking auth", {
//           token: !!token,
//           storedUser: !!storedUser,
//         });

//         if (!token) {
//           setAuthState({ isAuthenticated: false, user: null, loading: false });
//           return;
//         }

//         // Parse stored user data
//         let userData = null;
//         if (storedUser) {
//           try {
//             userData = JSON.parse(storedUser);
//           } catch (e) {
//             console.error("Failed to parse user data:", e);
//           }
//         }

//         // Verify token with backend
//         const res = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//         });

//         if (!res.ok) {
//           console.log("AuthGuard: Token invalid — clearing storage");
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           setAuthState({ isAuthenticated: false, user: null, loading: false });
//           return;
//         }

//         const data = await res.json();
//         const verifiedUser = data.data?.user || data.user || userData;

//         setAuthState({
//           isAuthenticated: true,
//           user: verifiedUser,
//           loading: false,
//         });
//       } catch (error) {
//         console.error("AuthGuard: Verification error:", error);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setAuthState({ isAuthenticated: false, user: null, loading: false });
//       }
//     };

//     checkAuth();
//   }, [location.pathname]);

//   // ⏳ Show loading spinner
//   if (authState.loading) {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         minHeight="100vh"
//         sx={{ backgroundColor: "background.default" }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Verifying authentication...
//         </Typography>
//       </Box>
//     );
//   }

//   // 🚫 Not authenticated → redirect to login
//   if (!authState.isAuthenticated) {
//     console.log("AuthGuard: Redirecting to login");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 🚫 Role-based access check
//   if (
//     requiredRole &&
//     Array.isArray(requiredRole) &&
//     !requiredRole.includes(authState.user?.role)
//   ) {
//     console.log(
//       `AuthGuard: Unauthorized — Required: ${requiredRole.join(",")}, Found: ${
//         authState.user?.role
//       }`
//     );
//     return <Navigate to="/" replace />;
//   }

//   // 🚫 Email not verified for dashboard routes
//   if (
//     location.pathname.startsWith("/dashboard") &&
//     !authState.user?.isEmailVerified
//   ) {
//     console.log("AuthGuard: Email not verified for dashboard access");
//     return <Navigate to="/verify-email" replace />;
//   }

//   console.log("AuthGuard: ✅ Access granted");
//   return children;
// };

// export default AuthGuard;
