import { useState, useEffect } from "react";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Navbar components
import Brand from "./navbar/Brand";
import NavButton from "./navbar/NavButton";
import SearchBar from "./navbar/SearchBar";
import MobileDrawer from "./navbar/MobileDrawer";
import ThemeToggle from "./common/ThemeToggle";

const authLinks = [
  { label: "Login", to: "/login", icon: <i className="ti ti-login" style={{ fontSize: "1.25rem" }} /> },
  {
    label: "Register",
    to: "/signup",
    icon: <i className="ti ti-user-plus" style={{ fontSize: "1.25rem" }} />,
  },
];

export default function Navbar({ setFilters }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);

  // Handle scroll trigger equivalent
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = Boolean(anchorEl);

  // Show search only on pages supporting it
  const showSearch = ["/issues", "/dashboard", "/user-dashboard"].includes(
    pathname,
  );

  const links = [
    { label: "Home", to: "/", icon: <i className="ti ti-home" style={{ fontSize: "1.25rem" }} /> },
    {
      label: "Map",
      to: "/map",
      icon: <span style={{ fontSize: 16 }}>🗺️</span>,
    },
    {
      label: "Leaderboard",
      to: "/leaderboard",
      icon: <span style={{ fontSize: 16 }}>🏆</span>,
    },

    ...(user?.role === "user"
      ? [
          {
            label: "Report Issue",
            to: "/report-issue",
            icon: <i className="ti ti-bug" style={{ fontSize: "1.25rem" }} />,
          },
          {
            label: "Issues",
            to: "/user-dashboard",
            icon: <i className="ti ti-list" style={{ fontSize: "1.25rem" }} />,
          },
        ]
      : []),

    ...(user?.role === "admin"
      ? [
          {
            label: "Admin Panel",
            to: "/dashboard",
            icon: <i className="ti ti-layout-dashboard" style={{ fontSize: "1.25rem" }} />,
          },
          {
            label: "Manage Users",
            to: "/admin-user-page",
            icon: <i className="ti ti-users" style={{ fontSize: "1.25rem" }} />,
          },
          {
            label: "Manage Issues",
            to: "/admin-issue-page",
            icon: <i className="ti ti-list" style={{ fontSize: "1.25rem" }} />,
          },
        ]
      : []),
  ];

  const handleSearch = (value) => {
    setSearchValue(value);
    if (setFilters) {
      setFilters((prev) => ({ ...prev, search: value }));
    }
  };
  
  const handleLogout = () => {
    logout();
    setAnchorEl(false);
    navigate("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        background: scrolled
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none", // elevation 8
      }}
    >
      <div className="container-lg" style={{ padding: "4px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", height: 56 }}>
          {/* Left: Logo */}
          <Brand />

          {/* Desktop Nav */}
          <div className="desktop-only" style={{ display: "flex", gap: 12, marginLeft: 32 }}>
            {links.map((item) => (
              <NavButton key={item.to} {...item} />
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flexGrow: 1 }} />

          {/* Search (Desktop only if applicable) */}
          {showSearch && (
            <div className="desktop-only" style={{ marginRight: 16 }}>
              <SearchBar value={searchValue} onChange={handleSearch} />
            </div>
          )}

          {/* Dark / Light Toggle */}
          <div className="desktop-only" style={{ marginRight: 8 }}>
            <ThemeToggle />
          </div>

          {/* Right: Auth Buttons */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!user ? (
              authLinks.map((item) => (
                <RouterLink
                  key={item.to}
                  to={item.to}
                  className={`btn ${item.label === "Register" ? "btn-primary" : "btn-ghost"}`}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  {item.icon}
                  {item.label}
                </RouterLink>
              ))
            ) : (
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 24,
                    transition: "background var(--transition-base)",
                  }}
                  className="user-menu-trigger"
                  onClick={() => setAnchorEl(!anchorEl)}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                       user.displayName?.charAt(0)?.toUpperCase() || user.fullName?.charAt(0)?.toUpperCase() || "?"
                    )}
                  </div>

                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: user.role === "admin" ? "var(--status-open)" : "var(--status-done)",
                      textTransform: "capitalize",
                      userSelect: "none",
                    }}
                  >
                    {user.role === "admin" ? "Admin" : "Citizen"}
                  </span>
                </div>

                {anchorEl && (
                  <>
                    <div 
                      style={{ position: "fixed", inset: 0, zIndex: 9 }} 
                      onClick={() => setAnchorEl(false)} 
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: 8,
                        background: "var(--surface-base)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--shadow-lg)",
                        minWidth: 160,
                        zIndex: 10,
                        overflow: "hidden",
                        padding: 8,
                      }}
                    >
                      <RouterLink
                        to="/profile"
                        onClick={() => setAnchorEl(false)}
                        className="menu-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 16px",
                          color: "var(--ink-primary)",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          borderRadius: "var(--radius-md)",
                          transition: "background 0.2s ease",
                        }}
                      >
                        <i className="ti ti-user-cog" style={{ fontSize: "1.25rem" }} />
                        Profile
                      </RouterLink>

                      <button
                        onClick={handleLogout}
                        className="menu-item"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 16px",
                          color: "var(--status-open)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          borderRadius: "var(--radius-md)",
                          transition: "background 0.2s ease",
                        }}
                      >
                        <i className="ti ti-logout" style={{ fontSize: "1.25rem" }} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu icon */}
          <button
            className="btn-icon mobile-only"
            style={{ marginLeft: 8 }}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <i className="ti ti-menu-2" style={{ fontSize: "1.5rem" }} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 899.95px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 900px) {
          .mobile-only { display: none !important; }
        }
        .user-menu-trigger:hover {
          background: var(--surface-subtle);
        }
        .menu-item:hover {
          background: var(--surface-subtle);
        }
      `}</style>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        links={links}
        authLinks={authLinks}
        searchValue={searchValue}
        onSearchChange={handleSearch}
      />
    </header>
  );
}
