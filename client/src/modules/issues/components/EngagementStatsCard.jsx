import { Card, Typography, Stack, Divider, Chip, Box } from "@mui/material";

export default function EngagementStatsCard({ stats, glass }) {
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
        👍 Engagement
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">Total Upvotes</Typography>
          <Typography variant="h5" fontWeight={700}>
            {stats.totalUpvotes}
          </Typography>
        </Box>

        {stats.mostUpvoted && (
          <>
            <Divider sx={{ opacity: 0.3 }} />
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Most Popular
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {stats.mostUpvoted.title}
              </Typography>

              <Chip
                label={`${stats.mostUpvoted.upvotes || 0} votes`}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </>
        )}
      </Stack>
    </Card>
  );
}
