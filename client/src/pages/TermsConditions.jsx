import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function TermsConditions() {
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
            Terms & Conditions
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
            Acceptance of Terms
          </Typography>
          <Typography variant="body1" mb={4}>
            By accessing CivicPulse and its services, you agree to abide by
            these Terms & Conditions. If you do not agree with any part of these
            terms, you should immediately stop using the platform.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Use of Service
          </Typography>
          <Typography variant="body1" mb={4}>
            Our platform allows users to report civic issues, track progress,
            and engage with the community. You agree not to misuse the service
            by submitting false or harmful information, or by attempting to
            disrupt system operations.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            User Accounts & Responsibility
          </Typography>
          <Typography variant="body1" mb={4}>
            You are responsible for maintaining the security of your account
            credentials. You must ensure the information you provide is accurate
            and up to date. Any suspicious activity should be reported to our
            support team immediately.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Content Ownership
          </Typography>
          <Typography variant="body1" mb={4}>
            All reports and content submitted remain the intellectual property
            of their creators. However, by submitting data you grant us
            permission to use anonymized content for civic improvement,
            analytics, and service optimization.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Termination of Access
          </Typography>
          <Typography variant="body1" mb={4}>
            We reserve the right to suspend or terminate accounts that violate
            these terms, engage in illegal behavior, or pose a risk to the
            community’s well-being.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" mb={4}>
            CivicPulse is provided “as-is” and we are not liable for issues such
            as delays, data loss, or inaccuracies within third-party processes.
            Your use of the platform is at your own discretion and risk.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Updates to These Terms
          </Typography>
          <Typography variant="body1" mb={4}>
            We may update these Terms & Conditions periodically. Continued use
            of the platform after updates implies acceptance of the revised
            terms.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} CivicPulse. All Rights Reserved.
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  );
}
