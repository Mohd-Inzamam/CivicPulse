import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const PrivacyPolicy = () => {
  return (
    <Box
      sx={{
        // backgroundColor: "background.default",
        minHeight: "100vh",
        pt: 10,
        pb: 10,
        color: "text.primary",
      }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            textAlign: "center",
            py: 5,
            px: 3,
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.25) 0%, rgba(123,31,162,0.2) 100%)",
            boxShadow: "0px 4px 18px rgba(0,0,0,0.1)",
          }}>
          <Typography variant="h3" fontWeight="bold">
            Privacy Policy
          </Typography>
          <Typography variant="body1" mt={1} sx={{ opacity: 0.85 }}>
            Last Updated: {new Date().getFullYear()}
          </Typography>
        </MotionBox>
      </Container>

      {/* Content */}
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          sx={{ lineHeight: 1.7 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Introduction
          </Typography>
          <Typography variant="body1" mb={4}>
            At CivicPulse, your privacy matters to us. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our platform to report and track civic issues in your
            community.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Information We Collect
          </Typography>
          <Typography variant="body1" mb={4}>
            We may collect personal details such as your name, email address,
            profile picture, and issue reports submitted through our platform.
            Additional data like device information, location (if permitted),
            and usage behavior may be collected to improve your experience.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" mb={4}>
            We use the data we collect to:
            <ul>
              <li>Provide services such as issue reporting and updates</li>
              <li>Improve app security and performance</li>
              <li>Communicate updates, confirmations, and notifications</li>
              <li>Analyze trends to better serve our users</li>
            </ul>
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Sharing of Data
          </Typography>
          <Typography variant="body1" mb={4}>
            We do not sell or distribute your personal information to third
            parties except when required by law, or when data is shared
            anonymously to government bodies to support civic improvement
            efforts.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Data Security
          </Typography>
          <Typography variant="body1" mb={4}>
            We use modern security practices including encryption and
            authentication measures to ensure your data remains safe and
            protected from unauthorized access.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Your Rights
          </Typography>
          <Typography variant="body1" mb={4}>
            You may request access to, correction of, or deletion of your
            personal data at any time. Our support team will assist you with
            your request promptly.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Contact Us
          </Typography>
          <Typography variant="body1" mb={4}>
            If you have any privacy concerns or queries, feel free to reach out:
            <br />
            📩 Email: privacy@civicpulse.app
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} CivicPulse. All Rights Reserved.
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
