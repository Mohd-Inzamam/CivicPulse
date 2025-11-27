import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaUsers, FaHandshake, FaBullhorn } from "react-icons/fa"; // For icons

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const About = () => {
  return (
    <Box
      sx={{
        // backgroundColor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        pt: 10, // Navbar height adjustment
      }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            textAlign: "center",
            py: 5,
            px: 3,
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.2) 0%, rgba(123,31,162,0.15) 100%)",
            boxShadow: "0px 4px 18px rgba(0,0,0,0.1)",
          }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            About CivicPulse
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: "800px", mx: "auto", opacity: 0.9 }}>
            Empowering citizens to voice issues, collaborate with authorities,
            and shape a better society.
          </Typography>
        </MotionBox>
      </Container>

      {/* Stats Section */}
      <Container sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <FaUsers size={32} />,
              title: "Community Driven",
              desc: "Every voice matters.",
            },
            {
              icon: <FaBullhorn size={32} />,
              title: "Active Communication",
              desc: "Issues raised transparently.",
            },
            {
              icon: <FaHandshake size={32} />,
              title: "Collaboration",
              desc: "Citizens & Officials together.",
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "20px",
                  backgroundColor: "background.paper",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                }}>
                <CardContent>
                  {stat.icon}
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" mt={1} sx={{ opacity: 0.7 }}>
                    {stat.desc}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ maxWidth: "900px", mx: "auto", mb: 6 }} />

      {/* Mission & Vision Section */}
      <Container sx={{ pb: 8 }}>
        <Grid container spacing={5}>
          {[
            {
              title: "Our Mission",
              desc: "To build a transparent civic platform where citizens can report issues and receive timely responses.",
            },
            {
              title: "Our Vision",
              desc: "To create a connected, empowered urban ecosystem that enhances public well-being through technology.",
            },
          ].map((section, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MotionBox
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                  {section.desc}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
