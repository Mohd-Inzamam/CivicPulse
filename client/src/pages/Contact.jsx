import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!formData.fullName.trim())
      validationErrors.fullName = "Name is required";
    if (!formData.email.trim()) validationErrors.email = "Email is required";
    if (!formData.message.trim())
      validationErrors.message = "Message can't be empty";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Message submitted! (Backend not connected yet)");
      setFormData({ fullName: "", email: "", message: "" });
    }
  };

  return (
    <Box
      sx={{
        // backgroundColor: "background.default",
        minHeight: "100vh",
        pt: 10,
        color: "text.primary",
      }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <MotionBox
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            textAlign: "center",
            py: 5,
            px: 3,
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.2) 0%, rgba(123,31,162,0.15))",
            boxShadow: "0px 4px 18px rgba(0,0,0,0.1)",
          }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 700, mx: "auto", opacity: 0.9 }}>
            Have a question, feedback, or need support? We’d love to hear from
            you!
          </Typography>
        </MotionBox>
      </Container>

      {/* Form + Info Section */}
      <Container sx={{ pb: 8 }}>
        <Grid container spacing={5}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <MotionPaper
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              sx={{
                p: 4,
                borderRadius: "20px",
                backgroundColor: "background.paper",
                boxShadow: "0px 4px 18px rgba(0,0,0,0.08)",
              }}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Send us a Message
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{ py: 1.2, fontSize: "1rem", fontWeight: "bold" }}>
                  Send Message
                </Button>
              </form>
            </MotionPaper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Get in Touch
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FaEnvelope size={22} />
                <Typography>Email: support@civicpulse.app</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FaPhoneAlt size={22} />
                <Typography>+91 98765 43210</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={4}>
                <FaMapMarkerAlt size={22} />
                <Typography>
                  Mumbai, India <br /> (Actual location integration TBD)
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Map Placeholder */}
              <Paper
                sx={{
                  height: 220,
                  borderRadius: "16px",
                  backgroundColor: "rgba(0,0,0,0.05)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                  opacity: 0.7,
                }}>
                Map Integration Coming Soon
              </Paper>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
