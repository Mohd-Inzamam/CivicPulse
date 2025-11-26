import React from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

const features = [
  {
    title: "Transparency",
    text: "Stay informed every step of the way — from report to resolution.",
  },
  {
    title: "Community-Powered",
    text: "Work together with fellow citizens to create real change.",
  },
  {
    title: "Accountability",
    text: "See which issues are addressed, by whom, and how quickly.",
  },
];

const steps = [
  "Report issues around you",
  "Support and upvote community concerns",
  "Track outcomes as authorities take action",
  "Celebrate improvements together",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", py: 8 }}>
      {/* HERO SECTION */}
      <Grid
        container
        spacing={5}
        alignItems="center"
        sx={{ px: { xs: 3, md: 8 } }}>
        <Grid item xs={12} md={6}>
          <MotionBox
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}>
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Be the Change
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: "420px" }}>
              Your voice matters. Join neighbors in improving your community —
              one report at a time.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.2,
                textTransform: "none",
                fontSize: "1.1rem",
              }}>
              Be the Change →
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 1.5, cursor: "pointer" }}
              onClick={() => navigate("/register")}>
              Don’t have an account? <strong>Join CivicPulse</strong>
            </Typography>
          </MotionBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionBox
            component="img"
            src="/hero-illustration.png"
            alt="Community Illustration"
            className="img-fluid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            sx={{ width: "100%", maxWidth: 520 }}
          />
        </Grid>
      </Grid>

      {/* WHY SECTION */}
      <Box sx={{ mt: 12, px: { xs: 3, md: 8 }, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Why CivicPulse?
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
          Small problems grow when ignored. CivicPulse gives communities the
          tools to speak up and make progress together.
        </Typography>

        <Grid container spacing={3}>
          {features.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.75)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* HOW IT WORKS */}
      <Box sx={{ mt: 12, px: { xs: 3, md: 8 } }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          How It Works
        </Typography>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "18px",
                    textAlign: "center",
                    height: "100%",
                  }}>
                  <Typography variant="h4" fontWeight={700}>
                    {index + 1}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 2 }}
                    color="text.secondary">
                    {step}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA SECTION */}
      <Box sx={{ textAlign: "center", mt: 12, mb: 6 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Ready to make a difference?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 6, py: 1.4, borderRadius: "12px" }}
          onClick={() => navigate("/register")}>
          Join CivicPulse →
        </Button>
      </Box>
    </Box>
  );
}
