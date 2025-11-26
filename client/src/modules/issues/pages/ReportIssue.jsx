import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Card, Box } from "@mui/material";
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

function ReportIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation
    if (!formData.title || formData.title.length < 5)
      newErrors.title = "Title must be at least 5 characters!";
    if (!formData.description || formData.description.length < 15)
      newErrors.description = "Description must be at least 15 characters!";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.location || formData.location.length < 3)
      newErrors.location = "Location must be at least 3 characters long";
    if (!imageFile) newErrors.image = "Please upload an image";

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      // Prepare FormData
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category", formData.category);
      dataToSend.append("location", formData.location);
      dataToSend.append("image", imageFile);

      // Call backend
      await issuesService.createIssue(dataToSend);

      // Reset form
      setFormData({ title: "", description: "", category: "", location: "" });
      setImageFile(null);
      setPreview(null);
      setError({});

      alert("Issue reported successfully!");

      // Redirect to IssuePage to show all issues including the new one
      navigate("/issues");
    } catch (err) {
      console.error("Error creating issue:", err);
      setError({
        general:
          err.response?.data?.message ||
          err.message ||
          "Failed to create issue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard title="Report an Issue">
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

        {/* Preview */}
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
    </PageCard>
  );
}

export default ReportIssue;
