import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";

export default function NoIssuesCard({ glass, onReport }) {
  return (
    <Stack alignItems="center">
      <Box sx={{ maxWidth: 600, width: "100%" }}>
        <Card
          sx={{
            borderRadius: 5,
            p: 4,
            textAlign: "center",
            background: glass.background,
            backdropFilter: `blur(${glass.blur})`,
            border: glass.border,
            boxShadow: glass.shadow,
          }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} mb={2}>
              🚀 No Issues Found
            </Typography>

            <Typography variant="body1" mb={3}>
              Be the first to raise a concern and make a difference!
            </Typography>

            <Button variant="contained" size="large" onClick={onReport}>
              Report an Issue
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
