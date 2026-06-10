import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "5rem", md: "8rem" },
            fontWeight: 700,
            opacity: 0.15,
            lineHeight: 1,
          }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>
          Page not found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, mb: 4, maxWidth: 400 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "12px", textTransform: "none", px: 3 }}
            onClick={() =>
              navigate(
                user
                  ? user.role === "admin"
                    ? "/dashboard"
                    : "/user-dashboard"
                  : "/",
              )
            }>
            Go Home
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: "12px", textTransform: "none", px: 3 }}
            onClick={() => navigate("/issues")}>
            Browse Issues
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
