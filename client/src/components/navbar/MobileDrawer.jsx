import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";

const MobileDrawer = ({
  open,
  onClose,
  links,
  authLinks,
  searchValue,
  onSearchChange,
}) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop */}
      {open && <div className="drawer-backdrop" onClick={onClose} />}

      {/* Drawer panel */}
      <div
        className={`drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        style={{
          width: 300,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          background: "var(--surface-base)",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ width: 300, padding: 16 }} role="presentation">
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-primary)" }}>
              Menu
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ThemeToggle />
              <button className="btn-icon" onClick={onClose} aria-label="Close menu">
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="divider" style={{ marginTop: 8, marginBottom: 8 }} />

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <div className="search-wrap">
              <i className="ti ti-search search-icon" aria-hidden="true" />
              <input
                className="search-input"
                type="text"
                placeholder="Search issues..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Nav links */}
          <nav>
            {links.map((l) => (
              <RouterLink
                key={l.to}
                to={l.to}
                onClick={onClose}
                className={`sidebar-link${pathname === l.to ? " active" : ""}`}
                style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}
              >
                {l.icon}
                <span style={{ marginLeft: 8 }}>{l.label}</span>
              </RouterLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="divider" style={{ marginTop: 8, marginBottom: 8 }} />

          {/* Auth section */}
          <nav>
            {!user ? (
              authLinks.map((l) => (
                <RouterLink
                  key={l.label}
                  to={l.to}
                  onClick={onClose}
                  className="sidebar-link"
                  style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}
                >
                  {l.icon}
                  <span style={{ marginLeft: 8 }}>{l.label}</span>
                </RouterLink>
              ))
            ) : (
              <>
                <div
                  className="sidebar-link"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", opacity: 0.7 }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 8,
                    }}
                  >
                    {user.displayName?.charAt(0)?.toUpperCase() || user.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span>{user.displayName || user.fullName}</span>
                </div>
                <button
                  className="sidebar-link"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 12px",
                    color: "var(--ink-primary)",
                    fontSize: 14,
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
