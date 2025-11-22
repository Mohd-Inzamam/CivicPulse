import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Stack, Box, Typography } from "@mui/material";

const Brand = () => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      component={RouterLink}
      to="/"
      style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 6px)",
          gap: "4px",
        }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 16 + i * 4,
              bgcolor: "primary.main",
              borderRadius: 1,
            }}
          />
        ))}
      </Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 800, letterSpacing: 1, color: "text.primary" }}>
        CIVIC-PULSE
      </Typography>
    </Stack>
  );
};

export default Brand;
