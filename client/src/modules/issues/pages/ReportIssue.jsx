import { useState } from "react";
import { Typography, Button, Grid, Card } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

// Components
import FormField from "../../../components/common/FormField";
import SelectField from "../../../components/common/SelectField";
import SubmitButton from "../../../components/common/SubmitButton";
import PageCard from "../../../components/common/PageCard";

const categoryOptions = [
  { value: "Road", label: "Road" },
  { value: "Electricity", label: "Electricity" },
  { value: "Water", label: "Water" },
  { value: "Garbage", label: "Garbage" },
  { value: "Other", label: "Other" },
];

function ReportIssue({ addIssue }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setError] = useState({});

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation (matches backend rules)
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters!";
    }
    if (!formData.description || formData.description.length < 15) {
      newErrors.description = "Description must be at least 15 characters!";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.location || formData.location.length < 3) {
      newErrors.location = "Location must be at least 3 characters long";
    }
    if (!imageFile) {
      newErrors.image = "Please upload an image";
    }

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // Prepare FormData
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("image", imageFile);

      // ✅ Only call addIssue (from IssuePage)
      if (addIssue) {
        await addIssue(formDataToSend);
      }

      // Reset the form
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
      });
      setImageFile(null);
      setPreview(null);

      alert("Issue reported successfully!");
    } catch (error) {
      console.error("Error creating issue:", error);
      setError({ general: error.message || "Failed to create issue" });
    }
  };

  return (
    <div
      style={{
        background: "var(--color-bg-default)",
        minHeight: "100vh",
        padding: "30px",
      }}>
      <PageCard title="Report an Issue">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <FormField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <FormField
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                options={categoryOptions}
                placeholder="Select Category"
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <FormField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<PhotoCamera />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}>
                {imageFile ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
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
            </Grid>

            {/* Preview */}
            {preview && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                  }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "250px",
                      objectFit: "cover",
                    }}
                  />
                </Card>
              </Grid>
            )}

            {/* Submit */}
            <Grid item xs={12}>
              <SubmitButton>Submit Issue</SubmitButton>
            </Grid>
          </Grid>
        </form>
      </PageCard>
    </div>
  );
}

export default ReportIssue;
