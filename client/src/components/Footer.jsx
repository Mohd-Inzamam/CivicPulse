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
        mb: 4,
        mx: 2,
        py: 4,
        px: { xs: 3, md: 6 },
        bgcolor: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderRadius: "2xl",
        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={3}>
        {/* Left: Copy */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.secondary",
            textAlign: { xs: "center", md: "left" },
          }}>
          &copy; {new Date().getFullYear()} Civic Pulse. All rights reserved.
        </Typography>

        {/* Center: Navigation */}
        <Stack direction="row" spacing={3} sx={{ justifyContent: "center" }}>
          <Typography
            component="a"
            href="/"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              position: "relative",
              "&:hover": { color: "primary.main" },
            }}>
            Home
          </Typography>
          <Typography
            component="a"
            href="/issues"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              "&:hover": { color: "primary.main" },
            }}>
            Report
          </Typography>
          <Typography
            component="a"
            href="/dashboard"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              "&:hover": { color: "primary.main" },
            }}>
            Dashboard
          </Typography>
          <Typography
            component="a"
            href="/profile"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              "&:hover": { color: "primary.main" },
            }}>
            Profile
          </Typography>
        </Stack>

        {/* Right: Social */}
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
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}>
                <Icon />
              </IconButton>
            )
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
