// App.js
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IssuePage from "./modules/issues/pages/IssuePage";
import IssueDetail from "./modules/issues/pages/IssueDetail";
import Dashboard from "./modules/dashboard/admin/pages/Dashboard";
import { useState } from "react";
import Signup from "./modules/auth/pages/Signup";
import Login from "./modules/auth/pages/Login";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import EmailVerification from "./modules/auth/pages/EmailVerification";
import Unauthorized from "./pages/Unauthorized";
import AuthGuard from "./components/auth/AuthGuard";
import SessionTimeout from "./components/auth/SessionTimeout";
import Home from "./pages/Home";
import UpdateProfile from "./modules/dashboard/user/UpdateProfile";
import UpdateIssue from "./modules/issues/pages/UpdateIssue";
import Footer from "./components/Footer";
import UserDashboard from "./modules/dashboard/user/UserDashboard";
import ReportIssue from "./modules/issues/pages/ReportIssue.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import FAQ from "./pages/FAQ.jsx";
import Team from "./pages/Team.jsx";
import Support from "./pages/Support.jsx";
import Feedback from "./pages/Feedback.jsx";

function App() {
  // ✅ Only keep filters state - issues are now managed by individual components
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    location: "",
  });

  return (
    <div className="App">
      <Navbar setFilters={setFilters} />
      <SessionTimeout />

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Home />
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/team" element={<Team />} />
        <Route path="/support" element={<Support />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Protected routes */}
        <Route
          path="/issues"
          element={
            <AuthGuard requiredRole={"user"}>
              {/* ✅ IssuePage now manages its own issues from backend */}
              <IssuePage filters={filters} />
            </AuthGuard>
          }
        />

        <Route
          path="/report-issue"
          element={
            <AuthGuard requiredRole={"user"}>
              {/* ✅ IssuePage now manages its own issues from backend */}
              <ReportIssue />
            </AuthGuard>
          }
        />

        <Route
          path="/issues/:id"
          element={
            <AuthGuard requiredRole={"user"}>
              {/* ✅ IssueDetail will fetch its own data from backend */}
              <IssueDetail />
            </AuthGuard>
          }
        />

        <Route
          path="/issues/:id"
          element={
            <AuthGuard requiredRole={"user"}>
              {/* Update Issue */}
              <UpdateIssue />
            </AuthGuard>
          }
        />

        <Route
          path="user-dashboard"
          element={
            <AuthGuard requiredRole={"user"}>
              {/* Update Issue */}
              <UserDashboard />
            </AuthGuard>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthGuard requiredRole={["user", "admin"]}>
              <UpdateProfile />
            </AuthGuard>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AuthGuard requiredRole={"admin"}>
              {/* ✅ Dashboard will fetch its own data from backend */}
              <Dashboard />
            </AuthGuard>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin/*"
          element={
            <AuthGuard requiredRole="admin">
              <div>Admin Panel - Coming Soon</div>
            </AuthGuard>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
