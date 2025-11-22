import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import API_ENDPOINTS from "../../../config/api"; // adjust the path if needed
import { useAuth } from "../../../context/AuthContext";

const UpdateProfile = () => {
  const { login } = useAuth();
  const [user, setUser] = useState(null);
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

  // Load profile on mount
  useEffect(() => {
    getProfile();
  }, []);

  // Fetch logged-in user data
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

  // Input handler
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save profile details (name, email, ssn)
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

  // Upload avatar separately
  const uploadAvatar = async () => {
    if (!avatar) return alert("No avatar selected!");

    setAvatarUploading(true);

    const fd = new FormData();
    fd.append("avatar", avatar);

    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_AVATAR, {
        method: "PATCH",
        credentials: "include",
        // DO NOT set Content-Type — browser will set multipart boundary
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
    <div className="container mt-5">
      <Card className="p-3 shadow-sm">
        <CardContent>
          <Typography variant="h5" className="mb-4 fw-bold">
            Update Profile
          </Typography>

          {/* Avatar Upload Section */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <Avatar
              src={avatarPreview}
              sx={{ width: 90, height: 90, border: "3px solid #ccc" }}
            />

            <div className="d-flex flex-column gap-2">
              <Button variant="contained" component="label">
                Choose Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>

              {avatar && (
                <Button
                  variant="outlined"
                  onClick={uploadAvatar}
                  disabled={avatarUploading}>
                  {avatarUploading ? (
                    <CircularProgress size={22} />
                  ) : (
                    "Save Avatar"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <div className="row g-3">
                <div className="col-md-6">
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleInput}
                  />
                </div>

                <div className="col-md-6">
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleInput}
                  />
                </div>

                <div className="col-md-6">
                  <TextField
                    label="SSN"
                    name="ssn"
                    fullWidth
                    value={formData.ssn}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <Button
                variant="contained"
                className="mt-4"
                onClick={submitProfileUpdate}
                disabled={updating}>
                {updating ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfile;
