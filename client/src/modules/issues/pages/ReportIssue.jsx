import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  Box,
  Chip,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

// Components
import FormField from "../../../components/common/FormField";
import SelectField from "../../../components/common/SelectField";
import SubmitButton from "../../../components/common/SubmitButton";
import PageCard from "../../../components/common/PageCard";
import { issuesService } from "../../../services/issuesService";

const categoryOptions = [
  { value: "Road", label: "Road" },
  { value: "Electricity", label: "Electricity" },
  { value: "Water", label: "Water" },
  { value: "Garbage", label: "Garbage" },
  { value: "Other", label: "Other" },
];

const priorityOptions = [
  { label: "Low", color: "success" },
  { label: "Medium", color: "warning" },
  { label: "High", color: "error" },
  { label: "Critical", color: "secondary" },
];

function ReportIssue() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "Medium",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePriorityChange = (priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5)
      newErrors.title = "Title must be at least 5 characters!";
    if (!formData.description || formData.description.length < 15)
      newErrors.description = "Description must be at least 15 characters!";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.location || formData.location.length < 3)
      newErrors.location = "Location must be at least 3 characters long";
    if (!imageFile) newErrors.image = "Please upload an image";
    if (!formData.priority) newErrors.priority = "Please select urgency level";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category", formData.category);
      dataToSend.append("location", formData.location);
      dataToSend.append("priority", formData.priority);
      dataToSend.append("image", imageFile);

      await issuesService.createIssue(dataToSend);

      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "Medium",
      });
      setImageFile(null);
      setPreview(null);
      setError({});

      setSnackbar({
        open: true,
        message: "Issue reported successfully!",
        severity: "success",
      });

      setTimeout(() => navigate("/issues"), 1200);
    } catch (err) {
      console.error(err);
      setError({
        general:
          err.response?.data?.message ||
          err.message ||
          "Failed to create issue",
      });
      setSnackbar({
        open: true,
        message: "Failed to create issue",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard sx={{ maxWidth: 500 }} title="Report an Issue">
      {errors.general && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.general}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          helperText="Provide a descriptive title for quick resolution"
          margin="normal"
        />

        <FormField
          label="Description"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          margin="normal"
        />

        <SelectField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          options={categoryOptions}
          placeholder="Select Category"
          margin="normal"
        />

        <FormField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          margin="normal"
        />

        {/* Priority / Urgency */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Urgency
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {priorityOptions.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                color={option.color}
                variant={
                  formData.priority === option.label ? "filled" : "outlined"
                }
                onClick={() => handlePriorityChange(option.label)}
                sx={{ cursor: "pointer", fontWeight: 600 }}
              />
            ))}
          </Box>
          {errors.priority && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}>
              {errors.priority}
            </Typography>
          )}
        </Box>

        {/* Image Upload */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<PhotoCamera />}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}>
            {imageFile ? "Change Image" : "Upload Image"}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
          {errors.image && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}>
              {errors.image}
            </Typography>
          )}
        </Box>

        {preview && (
          <Box sx={{ mt: 2 }}>
            <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 2 }}>
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{ width: "100%", maxHeight: 250, objectFit: "cover" }}
              />
            </Card>
          </Box>
        )}

        {/* Submit */}
        <Box sx={{ mt: 3 }}>
          <SubmitButton fullWidth disabled={loading}>
            {loading ? "Reporting..." : "Submit Issue"}
          </SubmitButton>
        </Box>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </PageCard>
  );
}

export default ReportIssue;
