import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { issuesService } from "../../../services/issuesService";

const UpdateIssue = ({ issue, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const file = e.target.files[0];
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
        // Send FormData if image is updated
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
          payload.append(key, value)
        );
        payload.append("image", image);
      } else {
        // Send JSON if no image
        payload = { ...formData };
      }

      const response = await issuesService.updateIssue(issue._id, payload);
      console.log("Issue updated:", response);

      if (onUpdate) onUpdate(response.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to update issue:", err);
      alert(err.message || "Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {issue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}>
          <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Update Issue
              </Typography>

              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3">
                <TextField
                  label="Title"
                  name="title"
                  fullWidth
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="Category"
                  name="category"
                  fullWidth
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="Location"
                  name="location"
                  fullWidth
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

                {/* Image Upload */}
                <div className="d-flex align-items-center gap-3">
                  <Avatar
                    src={imagePreview}
                    sx={{ width: 80, height: 80, border: "2px solid #ccc" }}
                  />
                  <Button variant="contained" component="label">
                    Change Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </div>

                <div className="d-flex gap-2 justify-content-end mt-2">
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}>
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={22} /> : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateIssue;
