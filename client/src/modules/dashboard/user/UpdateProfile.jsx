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
    <Box
      sx={{
        maxWidth: 650,
        mx: "auto",
        mt: 6,
        px: 2,
      }}>
      <Card
        sx={{
          borderRadius: theme.shape.borderRadius * 0.2,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          background: theme.palette.background.glass,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: theme.shadows[4],
          p: { xs: 1, sm: 2 },
        }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}>
            Update Profile
          </Typography>

          {/* Avatar Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
            <Avatar
              src={avatarPreview}
              sx={{
                width: 90,
                height: 90,
                borderRadius: theme.shape.borderRadius * 0.2,
                border: `2px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[2],
              }}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderRadius: 14,
                  py: 1.2,
                  px: 3,
                  textTransform: "none",
                  "&:hover": {
                    boxShadow: theme.shadows[2],
                    background: "rgba(255,255,255,0.6)",
                  },
                }}>
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
                  variant="contained"
                  onClick={uploadAvatar}
                  disabled={avatarUploading}
                  sx={{
                    borderRadius: 14,
                    py: 1.2,
                    px: 3,
                    textTransform: "none",
                    "&:hover": {
                      boxShadow: theme.shadows[2],
                      background: "rgba(255,255,255,0.6)",
                    },
                  }}>
                  {avatarUploading ? (
                    <CircularProgress size={22} />
                  ) : (
                    "Save Avatar"
                  )}
                </Button>
              )}
            </Box>
          </Box>

          {/* Form Fields */}
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInput}
                />

                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInput}
                />

                <TextField
                  label="SSN"
                  name="ssn"
                  fullWidth
                  value={formData.ssn}
                  onChange={handleInput}
                />
              </Box>

              <Button
                variant="outlined"
                onClick={submitProfileUpdate}
                disabled={updating}
                sx={{
                  borderRadius: 14,
                  py: 1.2,
                  px: 3,
                  textTransform: "none",
                  "&:hover": {
                    boxShadow: theme.shadows[2],
                    background: "rgba(255,255,255,0.6)",
                  },
                  marginTop: 3,
                }}>
                {updating ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateProfile;
