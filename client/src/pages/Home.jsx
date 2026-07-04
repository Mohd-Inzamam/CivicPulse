import React, { useEffect, useState } from "react";
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
import { API_ENDPOINTS } from "../config/api";
import heroImage from "../assets/hero-illustration.png";

const MotionBox = motion(Box);

const features = [
  {
    title: "Transparency",
    icon: "🔍",
    text: "Stay informed every step of the way — from report to resolution.",
  },
  {
    title: "Community-Powered",
    icon: "🤝",
    text: "Work together with fellow citizens to create real change.",
  },
  {
    title: "Accountability",
    icon: "📌",
    text: "See which issues are addressed, by whom, and how quickly.",
  },
];

const steps = [
  { icon: "📝", text: "Report issues around you" },
  { icon: "👍", text: "Support and upvote community concerns" },
  { icon: "🔄", text: "Track outcomes as authorities take action" },
  { icon: "🎉", text: "Celebrate improvements together" },
];

function AnimatedCount({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.DASHBOARD_STATS.replace("/stats", "/public-stats")}`)
      .then((r) => r.json())
      .then((d) => setStats(d.data || d))
      .catch(() => {});
  }, []);

  const liveStats = stats
    ? [
        { label: "Issues Reported", value: stats.totalIssues, icon: "📋" },
        { label: "Resolved", value: stats.resolvedIssues, icon: "✅" },
        { label: "In Progress", value: stats.inProgressIssues, icon: "⚙️" },
        { label: "Citizens Joined", value: stats.totalCitizens, icon: "👥" },
      ]
    : null;

  return (
    <Box sx={{ minHeight: "100vh", py: 8 }}>
      {/* HERO */}
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
            {/* <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/report-issue")}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}>
                Report an Issue →
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/issues")}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}>
                Browse Issues
              </Button>
            </Box> */}
            <section
              style={{
                background: "var(--surface-base)",
                padding: "60px 24px 48px",
                textAlign: "center",
              }}>
              <div className="container-md">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--accent)",
                    background: "var(--accent-muted)",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-pill)",
                    marginBottom: 16,
                  }}>
                  📍 Real issues. Real change.
                </span>
                <h1
                  style={{
                    fontSize: "clamp(28px, 5vw, 48px)",
                    fontWeight: 800,
                    color: "var(--ink-primary)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                    marginBottom: 16,
                  }}>
                  What's broken in
                  <br />
                  your community?
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--ink-tertiary)",
                    maxWidth: 480,
                    margin: "0 auto 32px",
                    lineHeight: 1.7,
                  }}>
                  Report it. Track it. See it fixed.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate("/report-issue")}>
                    <i className="ti ti-plus" aria-hidden="true" /> Report an
                    issue
                  </button>
                  <button
                    className="btn btn-ghost btn-lg"
                    onClick={() => navigate("/issues")}>
                    Browse issues
                  </button>
                </div>
              </div>
            </section>
            <Typography
              variant="body2"
              sx={{ mt: 1.5, cursor: "pointer", opacity: 0.7 }}
              onClick={() => navigate("/signup")}>
              Don't have an account? <strong>Join CivicPulse</strong>
            </Typography>
          </MotionBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionBox
            component="img"
            src={heroImage}
            alt="Community"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            sx={{ width: "100%", maxWidth: 520 }}
          />
        </Grid>
      </Grid>

      {/* LIVE STATS BAR */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          mt: 10,
          mx: { xs: 3, md: 8 },
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(66,165,245,0.06))",
          border: "1px solid rgba(25,118,210,0.15)",
          px: 4,
          py: 4,
        }}>
        {liveStats ? (
          <Grid container spacing={2} justifyContent="center">
            {liveStats.map((s, i) => (
              <Grid item xs={6} sm={3} key={i} sx={{ textAlign: "center" }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <Typography sx={{ fontSize: "2rem", mb: 0.5 }}>
                    {s.icon}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    <AnimatedCount target={s.value} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.label}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {[...Array(4)].map((_, i) => (
              <Grid item xs={6} sm={3} key={i} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    height: 60,
                    background: "rgba(0,0,0,0.06)",
                    borderRadius: 2,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </MotionBox>

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
                    <Typography sx={{ fontSize: "2rem", mb: 1 }}>
                      {item.icon}
                    </Typography>
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
                transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "18px",
                    textAlign: "center",
                    height: "100%",
                  }}>
                  <Typography sx={{ fontSize: "2rem", mb: 1 }}>
                    {step.icon}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {index + 1}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 2 }}
                    color="text.secondary">
                    {step.text}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: "center", mt: 12, mb: 6 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Ready to make a difference?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 6, py: 1.4, borderRadius: "12px", textTransform: "none" }}
          onClick={() => navigate("/signup")}>
          Join CivicPulse →
        </Button>
      </Box>
    </Box>
  );
}
