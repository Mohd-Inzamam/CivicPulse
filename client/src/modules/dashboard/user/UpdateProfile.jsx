import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import API_ENDPOINTS from "../../../config/api";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "@mui/material/styles";

const UpdateProfile = () => {
  const { login } = useAuth();
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ssn: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data?.data?.user) {
        setUser(data.data.user);
        setFormData({
          name: data.data.user.fullName || "",
          email: data.data.user.email || "",
          ssn: data.data.user.SSN || "",
        });
        setAvatarPreview(data.data.user.avatar || null);
        login(data?.data?.user);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const submitProfileUpdate = async () => {
    setUpdating(true);

    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_ACCOUNT, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.statusCode === 200) {
        alert("Profile updated!");
        login(data?.data?.user);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) return alert("No avatar selected!");

    setAvatarUploading(true);

    const fd = new FormData();
    fd.append("avatar", avatar);

    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_AVATAR, {
        method: "PATCH",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();

      if (data.statusCode === 200) {
        alert("Avatar updated!");
        setAvatarPreview(data.data.user.avatar);
      } else {
        alert(data.message || "Avatar update failed");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px" }}>
      <div className="card">
        <div className="card-body">
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--ink-primary)",
              marginBottom: 24,
            }}>
            Update profile
          </h1>

          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <span
                className="spinner"
                style={{ "--sz": "32px" }}
                role="status"
                aria-label="Loading profile"
              />
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "var(--surface-muted)",
                    border: "2px solid var(--border-subtle)",
                  }}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "var(--accent-text)",
                      }}>
                      {formData.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <label
                  className="btn btn-ghost btn-sm"
                  style={{ cursor: "pointer" }}>
                  <i className="ti ti-camera" aria-hidden="true" /> Change photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarUploading && (
                  <span
                    className="spinner"
                    role="status"
                    aria-label="Uploading photo"
                  />
                )}
              </div>

              {/* Fields */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  value={formData.name}
                  onChange={handleInput}
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={handleInput}
                  placeholder="you@example.com"
                />
              </div>

              <button
                className="btn btn-primary btn-full"
                disabled={updating}
                onClick={submitProfileUpdate}>
                {updating ? (
                  <span className="spinner" role="status" />
                ) : (
                  "Save changes"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
