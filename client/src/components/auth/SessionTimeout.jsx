import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";

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
    <Dialog open={showWarning} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" color="warning.main">
          Session Timeout Warning
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your session will expire in <strong>{formatTime(timeLeft)}</strong>{" "}
          due to inactivity.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click "Stay Logged In" to continue your session, or you will be
          automatically logged out.
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / (WARNING_TIME / 1000)) * 100}
          color="warning"
          sx={{ height: 8, borderRadius: 4 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="error" variant="outlined">
          Logout Now
        </Button>
        <Button
          onClick={handleStayLoggedIn}
          color="primary"
          variant="contained"
          autoFocus>
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeout;
