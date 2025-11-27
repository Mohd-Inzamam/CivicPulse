import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const troubleshootingGuides = [
  {
    title: "Can't login to your account?",
    steps: [
      "Ensure your email and password are correct.",
      "Reset your password using the 'Forgot Password' link.",
      "Clear browser cache and try again.",
      "Contact support if the issue persists.",
    ],
  },
  {
    title: "Issue not showing after reporting?",
    steps: [
      "Refresh the issues page.",
      "Check your network connection.",
      "Make sure you are reporting in the correct category.",
      "Contact support if it still doesn’t appear.",
    ],
  },
];

const faqData = [
  {
    question: "How do I report an issue?",
    answer:
      "Go to the 'Report' page from the navbar and fill in the issue details.",
  },
  {
    question: "Can I edit a submitted report?",
    answer:
      "Yes, you can edit your issues from the 'Issues' dashboard before they are resolved.",
  },
];

export default function Support() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="md" sx={{ my: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}>
          Support
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}>
          Find troubleshooting guides, FAQs, and contact options to help you get
          the best experience.
        </Typography>
      </motion.div>

      {/* Troubleshooting Guides */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Troubleshooting Guides
        </Typography>
        <Stack spacing={3}>
          {troubleshootingGuides.map((guide, idx) => (
            <Box
              key={idx}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(20px) saturate(180%)",
                boxShadow: 3,
                border: "1px solid rgba(255,255,255,0.3)",
              }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {guide.title}
              </Typography>
              <List>
                {guide.steps.map((step, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText primary={`• ${step}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* FAQ */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Frequently Asked Questions
        </Typography>
        <Stack spacing={2}>
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                borderRadius: 3,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(20px) saturate(180%)",
                boxShadow: 3,
                border: "1px solid rgba(255,255,255,0.3)",
                "&:before": { display: "none" },
              }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      {/* Contact Support */}
      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, borderRadius: 3 }}>
          Contact Support
        </Button>
      </Box>
    </Container>
  );
}
