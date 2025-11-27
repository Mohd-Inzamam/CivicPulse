import React from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 5,
        px: { xs: 3, md: 6 },
        bgcolor: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderRadius: "22px",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
      }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={3}>
        {/* Branding + Tagline */}
        <Stack alignItems={{ xs: "center", md: "flex-start" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}>
            🌐⚡ CivicPulse
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}>
            Empowering Communities, One Issue at a Time.
          </Typography>
        </Stack>

        {/* Footer Info Links */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ textAlign: "center", justifyContent: "center" }}>
          {[
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Terms & Conditions", path: "/terms" },
            { label: "FAQ", path: "/faq" },
            { label: "Team", path: "/team" },
            { label: "Support", path: "/support" },
            { label: "Feedback", path: "/feedback" },
          ].map((item, idx) => (
            <Typography
              key={idx}
              component="a"
              href={item.path}
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontWeight: 600,
                "&:hover": {
                  color: "primary.main",
                  transform: "translateY(-2px)",
                  transition: "0.2s ease-in-out",
                },
              }}>
              {item.label}
            </Typography>
          ))}
        </Stack>

        {/* Social Icons */}
        <Stack direction="row" spacing={1}>
          {[FacebookIcon, TwitterIcon, InstagramIcon, GitHubIcon].map(
            (Icon, idx) => (
              <IconButton
                key={idx}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  p: 1.2,
                  borderRadius: "50%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "scale(1.12)",
                  },
                }}>
                <Icon />
              </IconButton>
            )
          )}
        </Stack>
      </Stack>

      {/* Copyright */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 3,
          color: "text.secondary",
        }}>
        © {new Date().getFullYear()} CivicPulse — All Rights Reserved
      </Typography>
    </Box>
  );
}
