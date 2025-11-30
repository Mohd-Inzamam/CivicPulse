import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const COLORS = ["#1976d2", "#d32f2f", "#ed6c02", "#2e7d32"];

export default function SummaryCards({ item, index }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}>
      <Card
        sx={{
          borderRadius: 3,
          textAlign: "center",
          background: theme.palette.background.glass,
          boxShadow: theme.shadows[4],
          py: 2,
          px: 1,
          transition: "0.3s",
          "&:hover": {
            boxShadow: theme.shadows[6],
            transform: "translateY(-2px)",
          },
        }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            mb={1}
            alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS[index % COLORS.length],
                mr: 1,
              }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {item.label}
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold">
            {item.count}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
