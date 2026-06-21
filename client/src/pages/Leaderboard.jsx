import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { API_BASE_URL } from "../config/api";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/leaderboard`)
      .then((r) => r.json())
      .then((d) => setData(d.data || d))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", py: 6, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 720, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🏆</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Citizen Leaderboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Celebrating the most active citizens making a difference in their
            community
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !data || data.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>📋</Typography>
            <Typography variant="h6">No data yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to report an issue and top the leaderboard.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {data.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border:
                      index < 3
                        ? `1.5px solid ${["#facc15", "#94a3b8", "#fb923c"][index]}55`
                        : `1px solid ${theme.palette.divider}`,
                    background:
                      index < 3
                        ? `linear-gradient(135deg, ${["#facc15", "#94a3b8", "#fb923c"][index]}0D, transparent)`
                        : theme.palette.background.paper,
                  }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 1.75,
                      "&:last-child": { pb: 1.75 },
                    }}>
                    {/* Rank */}
                    <Box sx={{ width: 36, textAlign: "center", flexShrink: 0 }}>
                      {index < 3 ? (
                        <Typography sx={{ fontSize: "1.5rem" }}>
                          {MEDAL[index]}
                        </Typography>
                      ) : (
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}>
                          {index + 1}
                        </Typography>
                      )}
                    </Box>

                    <Avatar
                      sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
                      {entry.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                        {entry.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.issuesFiled} issue
                        {entry.issuesFiled !== 1 ? "s" : ""} reported
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}>
                      <Chip
                        label={`👍 ${entry.totalUpvotesReceived}`}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 500 }}
                      />
                      <Chip
                        label={`${entry.resolutionRate}% resolved`}
                        size="small"
                        color={
                          entry.resolutionRate >= 50 ? "success" : "default"
                        }
                        sx={{ fontSize: 11, fontWeight: 500 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
