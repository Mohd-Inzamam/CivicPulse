import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  { label: "Low", color: "var(--status-done)" },
  { label: "Medium", color: "var(--status-warn)" },
  { label: "High", color: "var(--status-open)" },
  { label: "Critical", color: "var(--ink-primary)" },
];

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

function ReportIssue() {
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

  const qualityColorVar =
    qualityScore === null
      ? "var(--ink-secondary)"
      : qualityScore >= 8
        ? "var(--status-done)"
        : qualityScore >= 5
          ? "var(--status-warn)"
          : "var(--status-open)";

  return (
    <PageCard sx={{ maxWidth: 500 }} title="Report an Issue">
      {errors.general && (
        <p className="form-error" style={{ marginBottom: 16 }}>
          {errors.general}
        </p>
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
          <div style={{ marginTop: -8, marginBottom: 12 }}>
            {scoringQuality ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spinner" style={{ "--sz": "12px" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--ink-tertiary)" }}>
                  Checking report quality…
                </span>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: qualityTip ? 4 : 0,
                  }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                    Report quality: {qualityScore}/10
                  </span>
                  <div style={{ flex: 1, maxWidth: 100 }}>
                    <div className="quality-track" style={{ height: 5, borderRadius: 24 }}>
                      <div 
                        className="quality-fill" 
                        style={{ width: `${qualityScore * 10}%`, background: qualityColorVar, borderRadius: 24 }} 
                      />
                    </div>
                  </div>
                </div>
                {qualityTip && (
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--ink-tertiary)", fontStyle: "italic", display: "block" }}>
                    💡 {qualityTip}
                  </span>
                )}
              </div>
            )}
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span className="spinner" style={{ "--sz": "12px" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--ink-tertiary)" }}>
              AI is analysing your description…
            </span>
          </div>
        )}
        {aiSuggestion && !suggestingCategory && (
          <div
            style={{
              marginTop: 8,
              padding: 10,
              borderRadius: 16,
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-sparkles" style={{ fontSize: 14, color: "var(--accent)" }} />
              <span style={{ fontSize: "0.75rem" }}>
                AI suggests <strong>{aiSuggestion.category}</strong>
                {aiSuggestion.priority
                  ? ` · ${aiSuggestion.priority} priority`
                  : ""}
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setAiSuggestion(null)}
                style={{ fontSize: 11, minWidth: "auto", padding: "2px 8px" }}>
                Dismiss
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={applyAiSuggestion}
                style={{ fontSize: 11, padding: "2px 8px" }}>
                Apply
              </button>
            </div>
          </div>
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
        <div style={{ marginTop: 16 }}>
          <h6 style={{ fontSize: "0.875rem", fontWeight: 600, margin: "0 0 8px 0" }}>
            Urgency
          </h6>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {priorityOptions.map((option) => (
              <button
                type="button"
                key={option.label}
                onClick={() => handlePriorityChange(option.label)}
                style={{
                  cursor: "pointer", 
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  padding: "4px 12px",
                  borderRadius: 16,
                  border: formData.priority === option.label ? "none" : `1px solid ${option.color}`,
                  background: formData.priority === option.label ? option.color : "transparent",
                  color: formData.priority === option.label ? "#fff" : option.color,
                  transition: "all 0.2s ease"
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.priority && (
            <span className="form-error" style={{ display: "block", marginTop: 8 }}>
              {errors.priority}
            </span>
          )}
        </div>

        {/* Image Upload */}
        <div style={{ marginTop: 16 }}>
          <label 
            className="btn btn-outline btn-full" 
            style={{ 
              paddingTop: 12, 
              paddingBottom: 12, 
              borderRadius: 16, 
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
              display: "flex",
              justifyContent: "center",
              gap: 8
            }}>
            <i className="ti ti-camera" style={{ fontSize: "1.25rem" }} />
            {imageFile ? "Change Image" : "Upload Image"}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              style={{ display: "none" }}
            />
          </label>
          {errors.image && (
            <span className="form-error" style={{ display: "block", marginTop: 8 }}>
              {errors.image}
            </span>
          )}
        </div>

        {preview && (
          <div style={{ marginTop: 16 }}>
            <div className="card" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%", maxHeight: 250, objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: 24 }}>
          <SubmitButton fullWidth disabled={loading || dupCheck.checking} loading={loading || dupCheck.checking}>
            {dupCheck.checking
              ? "Checking for duplicates…"
              : loading
                ? "Reporting..."
                : "Submit Issue"}
          </SubmitButton>
        </div>
      </form>

      {/* AI duplicate detection dialog */}
      {dupCheck.open && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 600, width: "100%" }} role="dialog" aria-modal="true">
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-sparkles" style={{ color: "var(--accent)", fontSize: 20 }} />
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink-primary)", fontWeight: 500 }}>
                Possible duplicate found
              </h2>
            </div>
            
            <div style={{ padding: 24 }}>
              <p style={{ margin: "0 0 16px 0", fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
                We found {dupCheck.duplicates.length} similar issue
                {dupCheck.duplicates.length !== 1 ? "s" : ""} already reported
                nearby. You can view them or report yours anyway.
              </p>
              
              {dupCheck.duplicates.map((d) => (
                <div
                  key={d._id}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 16,
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    background: "var(--surface-base)"
                  }}
                  onClick={() => navigate(`/issues/${d._id}`)}
                >
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{d.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-tertiary)", marginTop: 4 }}>
                    📍 {d.location} · {d.status}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ padding: 16, display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-subtle)" }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setDupCheck({ open: false, duplicates: [], checking: false })}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleReportAnyway} 
                disabled={loading}
              >
                {loading ? "Reporting…" : "Report Anyway"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 1400 }}>
          <div style={{ 
            background: snackbar.severity === "success" ? "var(--status-done)" : "var(--status-open)", 
            color: "#fff", 
            padding: "12px 24px", 
            borderRadius: 8, 
            boxShadow: "var(--shadow-md)",
            fontSize: "0.875rem",
            fontWeight: 500
          }}>
            {snackbar.message}
          </div>
        </div>
      )}
    </PageCard>
  );
}

export default ReportIssue;
