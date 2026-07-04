import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../../../config/api";
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
      uploadAvatar(file); // Automatically upload on select
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

  const uploadAvatar = async (file) => {
    if (!file) return;

    setAvatarUploading(true);

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_AVATAR, {
        method: "PATCH",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();

      if (data.statusCode === 200) {
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
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px", animation: "fadeInUp 0.6s ease-out" }}>
      <div 
        className="card"
        style={{
          background: "var(--surface-base)",
          borderRadius: "var(--radius-xl)",
          border: "0.5px solid var(--border-subtle)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden"
        }}>
        <div style={{ padding: "32px 24px" }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink-primary)",
              margin: "0 0 24px 0",
              textAlign: "center"
            }}>
            Update Profile
          </h1>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <span className="spinner" style={{ "--sz": "40px" }} />
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 32,
                }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "var(--surface-muted)",
                      border: "3px solid var(--surface-base)",
                      boxShadow: "0 0 0 1px var(--border-subtle)",
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
                          fontSize: 32,
                          fontWeight: 700,
                          color: "var(--accent-text)",
                          background: "var(--accent-muted)"
                        }}>
                        {formData.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  
                  {avatarUploading && (
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span className="spinner" style={{ "--sz": "24px", color: "white", borderTopColor: "white", borderRightColor: "white" }} />
                    </div>
                  )}
                </div>
                
                <label
                  className="btn btn-outline"
                  style={{ cursor: "pointer", borderRadius: 20, padding: "6px 16px" }}>
                  <i className="ti ti-camera" style={{ marginRight: 8 }} /> Change photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                  />
                </label>
              </div>

              {/* Fields */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full name
                </label>
                <div style={{ position: "relative" }}>
                  <i className="ti ti-user" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-tertiary)" }} />
                  <input
                    id="name"
                    name="name"
                    className="input"
                    style={{ paddingLeft: 40 }}
                    value={formData.name}
                    onChange={handleInput}
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <i className="ti ti-mail" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-tertiary)" }} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    style={{ paddingLeft: 40 }}
                    value={formData.email}
                    onChange={handleInput}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", borderRadius: 8, fontSize: "1rem" }}
                disabled={updating}
                onClick={submitProfileUpdate}>
                {updating ? (
                  <span className="spinner" style={{ "--sz": "20px" }} />
                ) : (
                  "Save changes"
                )}
              </button>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UpdateProfile;
