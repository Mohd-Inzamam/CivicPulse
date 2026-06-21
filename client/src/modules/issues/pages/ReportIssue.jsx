import { useState, useEffect, useRef, useCallback } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// Components
import FormField from "../../../components/common/FormField";
import SelectField from "../../../components/common/SelectField";
import SubmitButton from "../../../components/common/SubmitButton";
import PageCard from "../../../components/common/PageCard";
import { issuesService } from "../../../services/issuesService";
import { API_BASE_URL } from "../../../config/api";

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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

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

  // ── AI: category + priority suggestion ──────────────────────────────────
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  const [categoryUserEdited, setCategoryUserEdited] = useState(false);

  // ── AI: report quality scorer ────────────────────────────────────────────
  const [qualityScore, setQualityScore] = useState(null);
  const [qualityTip, setQualityTip] = useState(null);
  const [scoringQuality, setScoringQuality] = useState(false);
  const qualityDebounceRef = useRef(null);

  // ── AI: duplicate detection ──────────────────────────────────────────────
  const [dupCheck, setDupCheck] = useState({
    open: false,
    duplicates: [],
    checking: false,
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
    if (name === "category") setCategoryUserEdited(true);

    // Debounced quality scoring while typing description
    if (name === "description") {
      if (qualityDebounceRef.current) clearTimeout(qualityDebounceRef.current);
      if (value.trim().length < 20) {
        setQualityScore(null);
        setQualityTip(null);
        return;
      }
      qualityDebounceRef.current = setTimeout(() => {
        scoreQuality(value, formData.title, formData.location);
      }, 1200);
    }
  };

  const scoreQuality = async (description, title, location) => {
    setScoringQuality(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/report-quality`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ title, description, location }),
      });
      const data = await res.json();
      const result = data.data || data;
      setQualityScore(result.score ?? null);
      setQualityTip(result.tip ?? null);
    } catch {
      // silently ignore — quality score is optional
    } finally {
      setScoringQuality(false);
    }
  };

  // AI category suggestion on description blur
  const handleDescriptionBlur = async () => {
    if (formData.description.trim().length < 15) return;
    if (categoryUserEdited && formData.category) return; // don't override user's choice

    setSuggestingCategory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/suggest-category`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });
      const data = await res.json();
      const suggestion = data.data || data;
      if (suggestion?.category) {
        setAiSuggestion(suggestion);
      }
    } catch {
      // silently ignore — suggestion is optional
    } finally {
      setSuggestingCategory(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setFormData((prev) => ({
      ...prev,
      category: aiSuggestion.category || prev.category,
      priority: aiSuggestion.priority || prev.priority,
    }));
    setCategoryUserEdited(true);
    setAiSuggestion(null);
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

  const submitIssue = async () => {
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
      setQualityScore(null);
      setQualityTip(null);
      setAiSuggestion(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // AI duplicate check before submitting
    setDupCheck((p) => ({ ...p, checking: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/check-duplicates`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        }),
      });
      const data = await res.json();
      const result = data.data || data;

      if (result?.duplicates?.length > 0) {
        setDupCheck({
          open: true,
          duplicates: result.duplicates,
          checking: false,
        });
        return; // wait for user decision in dialog
      }
    } catch {
      // if duplicate check fails, proceed with submission anyway
    }
    setDupCheck((p) => ({ ...p, checking: false }));
    await submitIssue();
  };

  const handleReportAnyway = async () => {
    setDupCheck({ open: false, duplicates: [], checking: false });
    await submitIssue();
  };

  const qualityColor =
    qualityScore === null
      ? "default"
      : qualityScore >= 8
        ? "success"
        : qualityScore >= 5
          ? "warning"
          : "error";

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
          onBlur={handleDescriptionBlur}
          error={errors.description}
          margin="normal"
        />

        {/* AI report quality indicator */}
        {(scoringQuality || qualityScore !== null) && (
          <Box sx={{ mt: -1, mb: 1.5 }}>
            {scoringQuality ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={12} />
                <Typography variant="caption" color="text.secondary">
                  Checking report quality…
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: qualityTip ? 0.5 : 0,
                  }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Report quality: {qualityScore}/10
                  </Typography>
                  <Box sx={{ flex: 1, maxWidth: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={qualityScore * 10}
                      color={qualityColor}
                      sx={{ height: 5, borderRadius: 3 }}
                    />
                  </Box>
                </Box>
                {qualityTip && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}>
                    💡 {qualityTip}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}

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

        {/* AI category suggestion banner */}
        {suggestingCategory && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <CircularProgress size={12} />
            <Typography variant="caption" color="text.secondary">
              AI is analysing your description…
            </Typography>
          </Box>
        )}
        {aiSuggestion && !suggestingCategory && (
          <Box
            sx={{
              mt: 1,
              p: 1.25,
              borderRadius: 2,
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: "primary.main" }} />
              <Typography variant="caption">
                AI suggests <strong>{aiSuggestion.category}</strong>
                {aiSuggestion.priority
                  ? ` · ${aiSuggestion.priority} priority`
                  : ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button
                size="small"
                variant="text"
                onClick={() => setAiSuggestion(null)}
                sx={{ fontSize: 11, minWidth: "auto", py: 0.25 }}>
                Dismiss
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={applyAiSuggestion}
                sx={{ fontSize: 11, py: 0.25 }}>
                Apply
              </Button>
            </Box>
          </Box>
        )}

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
          <SubmitButton fullWidth disabled={loading || dupCheck.checking}>
            {dupCheck.checking
              ? "Checking for duplicates…"
              : loading
                ? "Reporting..."
                : "Submit Issue"}
          </SubmitButton>
        </Box>
      </form>

      {/* AI duplicate detection dialog */}
      <Dialog
        open={dupCheck.open}
        onClose={() =>
          setDupCheck({ open: false, duplicates: [], checking: false })
        }
        maxWidth="sm"
        fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 20 }} />
          Possible duplicate found
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We found {dupCheck.duplicates.length} similar issue
            {dupCheck.duplicates.length !== 1 ? "s" : ""} already reported
            nearby. You can view them or report yours anyway.
          </Typography>
          {dupCheck.duplicates.map((d) => (
            <Box
              key={d._id}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/issues/${d._id}`)}>
              <Typography variant="subtitle2">{d.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                📍 {d.location} · {d.status}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() =>
              setDupCheck({ open: false, duplicates: [], checking: false })
            }>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReportAnyway}
            disabled={loading}>
            {loading ? "Reporting…" : "Report Anyway"}
          </Button>
        </DialogActions>
      </Dialog>

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
