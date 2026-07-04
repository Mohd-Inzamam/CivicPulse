import { useState, useEffect } from "react";
import { issuesService } from "../../../services/issuesService";

// Components
import FormField from "../../../components/common/FormField";

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

  if (!issue) return null;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "32px auto 0",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-base)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-md)",
      }}>
      <div style={{ padding: 24 }}>
        <h5
          style={{
            margin: "0 0 24px 0",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "0.4px",
            fontSize: "1.5rem",
          }}>
          Update Issue
        </h5>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <FormField
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <FormField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />

          <FormField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          {/* Image Upload */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 18,
                  border: "2px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-sm)",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 18,
                  border: "2px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-sm)",
                  background: "var(--surface-subtle)",
                }}
              />
            )}

            <label className="btn btn-primary" style={{ borderRadius: 14, padding: "9.6px 24px", cursor: "pointer" }}>
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 8,
            }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
              style={{ borderRadius: 14, padding: "8px 24px" }}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ borderRadius: 14, padding: "8px 24px" }}>
              {loading ? (
                <span className="spinner" style={{ "--sz": "22px" }} />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateIssue;
