import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { issuesService } from "../../../services/issuesService";
import { useTheme } from "@mui/material/styles";

const UpdateIssue = ({ issue, onClose, onUpdate }) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate initial form data
  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        category: issue.category || "",
        location: issue.location || "",
      });
      setImagePreview(issue.image || null);
    }
  }, [issue]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload;

      if (image) {
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
          payload.append(key, value)
        );
        payload.append("image", image);
      } else {
        payload = { ...formData };
      }

      const response = await issuesService.updateIssue(issue._id, payload);

      if (onUpdate) onUpdate(response.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to update:", err);
      alert(err.message || "Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {issue && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.35, ease: "easeOut" }}>
          <Card
            sx={{
              maxWidth: { xs: "90%", sm: 500, md: 600 },
              mx: "auto",
              mt: 4,
              borderRadius: theme.shape.borderRadius * 0.2,
              p: 0,
              background: theme.palette.background.glass,
              backdropFilter: "blur(22px) saturate(180%)",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
            }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: "0.4px",
                }}>
                Update Issue
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing(2.5),
                }}>
                <TextField
                  label="Title"
                  name="title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                />

                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                />

                <TextField
                  label="Category"
                  name="category"
                  fullWidth
                  variant="outlined"
                  value={formData.category}
                  onChange={handleChange}
                />

                <TextField
                  label="Location"
                  name="location"
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  onChange={handleChange}
                />

                {/* Image Upload */}
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <Avatar
                    src={imagePreview}
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: "18px",
                      border: `2px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[2],
                    }}
                  />

                  <Button
                    variant="contained"
                    component="label"
                    sx={{ borderRadius: "14px", py: 1.2, px: 3 }}>
                    Change Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Stack>

                {/* Action Buttons */}
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={1.5}
                  sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    sx={{ borderRadius: "14px", py: 1, px: 3 }}>
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{ borderRadius: "14px", py: 1, px: 3 }}>
                    {loading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateIssue;
