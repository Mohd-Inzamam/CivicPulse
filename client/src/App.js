// App.js
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IssuePage from "./modules/issues/pages/IssuePage";
import IssueDetail from "./modules/issues/pages/IssueDetail";
import Dashboard from "./modules/dashboard/pages/Dashboard";
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
import UpdateProfile from "./modules/auth/pages/UpdateProfile";
import UpdateIssue from "./modules/issues/pages/UpdateIssue";

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
    </div>
  );
}

export default App;

// // App.js
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import IssuePage from "./modules/issues/pages/IssuePage";
// import IssueDetail from "./modules/issues/pages/IssueDetail";
// import Dashboard from "./modules/dashboard/pages/Dashboard";
// import { useState } from "react";
// import Signup from "./modules/auth/pages/Signup";
// import Login from "./modules/auth/pages/Login";
// import ForgotPassword from "./modules/auth/pages/ForgotPassword";
// import ResetPassword from "./modules/auth/pages/ResetPassword";
// import EmailVerification from "./modules/auth/pages/EmailVerification";
// import Unauthorized from "./pages/Unauthorized";
// import AuthGuard from "./components/auth/AuthGuard";
// import SessionTimeout from "./components/auth/SessionTimeout";

// const dummyIssues = [];

// function App() {
//   const [issues, setIssues] = useState(dummyIssues);
//   const [filters, setFilters] = useState({
//     search: "",
//     category: "",
//     status: "",
//     location: "",
//   });

//   // Function to add a new issue
//   const addIssue = (newIssue) => {
//     const issueWithId = {
//       ...newIssue,
//       id: Date.now().toString(),
//       upvotes: 0,
//       status: newIssue.status || "Open", // default status
//       createdAt: new Date().toISOString(), // 👈 needed for LineChart
//     };
//     setIssues([...issues, issueWithId]);
//   };

//   // Update issue status
//   const handleStatusChange = (id, newStatus) => {
//     setIssues((prev) =>
//       prev.map((issue) =>
//         issue.id === id ? { ...issue, status: newStatus } : issue
//       )
//     );
//   };

//   return (
//     <div className="App">
//       <Navbar setFilters={setFilters} />
//       <SessionTimeout />

//       <Routes>
//         {/* Public routes */}
//         <Route
//           path="/"
//           element={
//             <div style={{ textAlign: "center", marginTop: "2rem" }}>
//               <h2 style={{ color: "var(--color-primary)", fontWeight: "bold" }}>
//                 Welcome to CivicPulse
//               </h2>
//             </div>
//           }
//         />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/verify-email" element={<EmailVerification />} />
//         <Route path="/unauthorized" element={<Unauthorized />} />

//         {/* Protected routes */}
//         <Route
//           path="/issues"
//           element={
//             <AuthGuard>
//               <IssuePage
//                 issues={issues}
//                 setIssues={setIssues}
//                 addIssue={addIssue}
//                 filters={filters}
//               />
//             </AuthGuard>
//           }
//         />

//         <Route
//           path="/issues/:id"
//           element={
//             <AuthGuard>
//               <IssueDetail issues={issues} setIssues={setIssues} />
//             </AuthGuard>
//           }
//         />

//         <Route
//           path="/dashboard"
//           element={
//             <AuthGuard>
//               <Dashboard
//                 issues={issues}
//                 updateIssueStatus={handleStatusChange}
//               />
//             </AuthGuard>
//           }
//         />

//         {/* Admin-only routes */}
//         <Route
//           path="/admin/*"
//           element={
//             <AuthGuard requiredRole="admin">
//               <div>Admin Panel - Coming Soon</div>
//             </AuthGuard>
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;
