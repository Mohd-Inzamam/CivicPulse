import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SessionTimeout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes warning
  const [lastActivity, setLastActivity] = useState(Date.now());

  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
  const CHECK_INTERVAL = 1000; // Check every second

  const logoutUser = useCallback(() => {
    setShowWarning(false);
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setTimeLeft(Math.floor(WARNING_TIME / 1000));
  }, [WARNING_TIME]);

  useEffect(() => {
    // Only run if user is authenticated
    if (!user) {
      setShowWarning(false);
      return;
    }

    let checkIntervalId;

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeUntilTimeout = SESSION_TIMEOUT - timeSinceActivity;

      // If session expired
      if (timeUntilTimeout <= 0) {
        logoutUser();
        return;
      }

      // If warning should show
      if (timeUntilTimeout <= WARNING_TIME && !showWarning) {
        setShowWarning(true);
      }

      // Update countdown if warning is showing
      if (showWarning) {
        const secondsLeft = Math.ceil(timeUntilTimeout / 1000);
        setTimeLeft(secondsLeft);

        if (secondsLeft <= 0) {
          logoutUser();
        }
      }
    };

    // Start checking inactivity
    checkIntervalId = setInterval(checkInactivity, CHECK_INTERVAL);

    // Activity listeners
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      clearInterval(checkIntervalId);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [
    user,
    lastActivity,
    showWarning,
    logoutUser,
    resetTimer,
    SESSION_TIMEOUT,
    WARNING_TIME,
    CHECK_INTERVAL,
  ]);

  const handleStayLoggedIn = () => {
    // Reset the activity timer to extend session
    resetTimer();
  };

  const handleLogout = () => {
    logoutUser();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {showWarning && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 600, width: "100%" }} role="dialog" aria-modal="true">
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--status-warn)", fontWeight: 500 }}>
                Session Timeout Warning
              </h2>
            </div>
            
            <div style={{ padding: 24 }}>
              <p style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "var(--ink-primary)" }}>
                Your session will expire in <strong>{formatTime(timeLeft)}</strong> due to inactivity.
              </p>
              <p style={{ margin: "0 0 16px 0", fontSize: "0.875rem", color: "var(--ink-tertiary)" }}>
                Click "Stay Logged In" to continue your session, or you will be automatically logged out.
              </p>
              
              <div className="quality-track" style={{ height: 8, borderRadius: 4 }}>
                <div 
                  className="quality-fill fair" 
                  style={{ 
                    width: `${(timeLeft / (WARNING_TIME / 1000)) * 100}%`,
                    backgroundColor: "var(--status-warn)",
                    borderRadius: 4
                  }} 
                />
              </div>
            </div>
            
            <div style={{ padding: 16, display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-subtle)" }}>
              <button className="btn btn-outline" style={{ color: "var(--status-open)", borderColor: "var(--status-open)" }} onClick={handleLogout}>
                Logout Now
              </button>
              <button className="btn btn-primary" onClick={handleStayLoggedIn}>
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionTimeout;
