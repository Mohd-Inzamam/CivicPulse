import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
} from '@mui/material';

const SessionTimeout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes warning
  const [isActive, setIsActive] = useState(true);

  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
  const CHECK_INTERVAL = 1000; // Check every second

  const resetTimer = useCallback(() => {
    setIsActive(true);
    setShowWarning(false);
    setTimeLeft(Math.floor(WARNING_TIME / 1000));
  }, []);

  const logoutUser = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  useEffect(() => {
    let timeoutId;
    let intervalId;

    const startTimer = () => {
      // Clear any existing timers
      clearTimeout(timeoutId);
      clearInterval(intervalId);

      // Set main timeout
      timeoutId = setTimeout(() => {
        logoutUser();
      }, SESSION_TIMEOUT);

      // Set warning timeout
      const warningTimeout = setTimeout(() => {
        setShowWarning(true);
        setIsActive(false);
        
        // Start countdown
        intervalId = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              logoutUser();
              return 0;
            }
            return prev - 1;
          });
        }, CHECK_INTERVAL);
      }, SESSION_TIMEOUT - WARNING_TIME);
    };

    // Activity listeners
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = () => {
      if (isActive) {
        resetTimer();
        startTimer();
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start initial timer
    startTimer();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isActive, resetTimer, logoutUser]);

  const handleStayLoggedIn = () => {
    resetTimer();
    setIsActive(true);
  };

  const handleLogout = () => {
    logoutUser();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={showWarning}
      disableEscapeKeyDown
      disableBackdropClick
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" color="warning.main">
          Session Timeout Warning
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your session will expire in{' '}
          <strong>{formatTime(timeLeft)}</strong> due to inactivity.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click "Stay Logged In" to continue your session, or you will be automatically logged out.
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / (WARNING_TIME / 1000)) * 100}
          color="warning"
          sx={{ height: 8, borderRadius: 4 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleLogout}
          color="error"
          variant="outlined"
        >
          Logout Now
        </Button>
        <Button
          onClick={handleStayLoggedIn}
          color="primary"
          variant="contained"
          autoFocus
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeout;
