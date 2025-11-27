import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I report an issue?",
    answer:
      "Simply go to the 'Report' section in the Navbar, fill in the issue details, and submit. You can track its status in your dashboard.",
  },
  {
    question: "How can I edit or delete my issues?",
    answer:
      "Navigate to your user dashboard. You can click 'Edit' to modify an issue or 'Delete' to remove it permanently.",
  },
  {
    question: "What roles are supported?",
    answer:
      "We currently have two roles: Citizen and Admin. Citizens can report and track issues. Admins manage and resolve reported issues.",
  },
  {
    question: "How is my data used?",
    answer:
      "Your data is used only for the purpose of tracking civic issues and improving the platform. We never share personal information publicly.",
  },
  {
    question: "Who can I contact for support?",
    answer:
      "You can use the 'Contact' page to reach out to our support team. We aim to respond within 24-48 hours.",
  },
];

export default function FAQ() {
  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}>
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}>
          Find answers to common questions about Civic Pulse.
        </Typography>
      </motion.div>

      {/* FAQ List */}
      <Box>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Accordion
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: 2,
                "&:before": { display: "none" },
              }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  bgcolor: "background.glass",
                  borderRadius: 3,
                  "& .MuiAccordionSummary-content": { alignItems: "center" },
                }}>
                <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
}
