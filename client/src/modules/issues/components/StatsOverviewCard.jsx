import { Card, Typography, Stack, Box, Chip, Divider } from "@mui/material";

export default function StatsOverviewCard({ stats, glass }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 3,
        background: glass.background,
        backdropFilter: `blur(${glass.blur})`,
        border: glass.border,
        boxShadow: glass.shadow,
      }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        📊 Overview
      </Typography>

      <Stack spacing={2}>
        <Row label="Total Issues" value={stats.total} bold />

        <Divider sx={{ opacity: 0.3 }} />

        <Row label="Open" chipValue={stats.open} color="error.main" />
        <Row
          label="In Progress"
          chipValue={stats.inProgress}
          color="warning.main"
        />
        <Row label="Resolved" chipValue={stats.resolved} color="success.main" />
      </Stack>
    </Card>
  );
}

function Row({ label, value, chipValue, color }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2">{label}</Typography>

      {chipValue !== undefined ? (
        <Chip
          label={chipValue}
          size="small"
          sx={{ backgroundColor: color, color: "#fff", fontWeight: 600 }}
        />
      ) : (
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      )}
    </Box>
  );
}
