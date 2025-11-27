import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would send the feedback to backend (currently just mock)
    console.log({ rating, feedback });

    setSnackbarOpen(true);
    setRating(0);
    setFeedback("");
  };

  return (
    <Container maxWidth="sm" sx={{ my: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}>
          Feedback
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}>
          We value your thoughts! Rate your experience and leave your feedback
          below.
        </Typography>
      </motion.div>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(20px) saturate(180%)",
          boxShadow: 3,
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
        <Stack spacing={3}>
          {/* Rating */}
          <Box textAlign="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Rate your experience
            </Typography>
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>

          {/* Feedback Text */}
          <TextField
            label="Your Feedback"
            variant="outlined"
            multiline
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            fullWidth
            sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
          />

          {/* Submit Button */}
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
              disabled={rating === 0 || feedback.trim() === ""}>
              Submit Feedback
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled">
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </Container>
  );
}
