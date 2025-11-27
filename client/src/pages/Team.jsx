import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

// Dummy team data
const teamMembers = [
  {
    name: "Inzamam Sheikh",
    role: "Frontend Developer",
    avatar: "/avatars/inzamam.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
      twitter: "https://twitter.com/",
    },
  },
  {
    name: "Ayesha Khan",
    role: "Backend Developer",
    avatar: "/avatars/ayesha.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
      twitter: "https://twitter.com/",
    },
  },
  {
    name: "Rahul Sharma",
    role: "UI/UX Designer",
    avatar: "/avatars/rahul.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
      twitter: "https://twitter.com/",
    },
  },
];

export default function Team() {
  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
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
          Meet Our Team
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 8 }}>
          The passionate minds behind Civic Pulse, working to make civic
          engagement simple and effective.
        </Typography>
      </motion.div>

      {/* Team Grid */}
      <Grid container spacing={4}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  boxShadow: 3,
                  textAlign: "center",
                  p: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                }}>
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {member.socials.linkedin && (
                      <IconButton
                        component="a"
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          bgcolor: "white",
                          color: "primary.main",
                          p: 1.2,
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}>
                        <LinkedInIcon />
                      </IconButton>
                    )}
                    {member.socials.github && (
                      <IconButton
                        component="a"
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          bgcolor: "white",
                          color: "primary.main",
                          p: 1.2,
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}>
                        <GitHubIcon />
                      </IconButton>
                    )}
                    {member.socials.twitter && (
                      <IconButton
                        component="a"
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          bgcolor: "white",
                          color: "primary.main",
                          p: 1.2,
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}>
                        <TwitterIcon />
                      </IconButton>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
