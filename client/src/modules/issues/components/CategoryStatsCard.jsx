import { Card, Typography, Stack, Box } from "@mui/material";

export default function CategoryStatsCard({ stats, glass, sx }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 3,
        background: glass.background,
        backdropFilter: `blur(${glass.blur})`,
        border: glass.border,
        boxShadow: glass.shadow,
        ...sx,
      }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        🏷️ By Category
      </Typography>

      <Stack spacing={1.5}>
        {Object.entries(stats.byCategory).map(([cat, count]) => (
          <Box
            key={cat}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.05)",
              p: 1.5,
              borderRadius: 2,
            }}>
            <Typography sx={{ textTransform: "capitalize" }}>{cat}</Typography>
            <Typography fontWeight={700}>{count}</Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
