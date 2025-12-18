import { useState } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Button,
  Box,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  useScrollTrigger,
  useTheme,
  Typography,
  Tooltip,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import ManageAccountsRounded from "@mui/icons-material/ManageAccountsRounded";

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Navbar components
import Brand from "./navbar/Brand";
import NavButton from "./navbar/NavButton";
import SearchBar from "./navbar/SearchBar";
import MobileDrawer from "./navbar/MobileDrawer";
import ThemeToggle from "./common/ThemeToggle";

const authLinks = [
  { label: "Login", to: "/login", icon: <LoginRoundedIcon fontSize="small" /> },
  {
    label: "Register",
    to: "/signup",
    icon: <PersonAddAltRoundedIcon fontSize="small" />,
  },
];

export default function Navbar({ setFilters }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);

  // Show search only on pages supporting it
  const showSearch = ["/issues", "/dashboard", "/user-dashboard"].includes(
    pathname
  );

  const links = [
    { label: "Home", to: "/", icon: <HomeRoundedIcon fontSize="small" /> },

    ...(user?.role === "user"
      ? [
          {
            label: "Report Issue",
            to: "/issues",
            icon: <BugReportRoundedIcon fontSize="small" />,
          },
          {
            label: "Issues",
            to: "/user-dashboard",
            icon: <FormatListBulletedRoundedIcon fontSize="small" />,
          },
        ]
      : []),

    ...(user?.role === "admin"
      ? [
          {
            label: "Admin Panel",
            to: "/dashboard",
            icon: <SpaceDashboardRoundedIcon fontSize="small" />,
          },
          {
            label: "Manage Users",
            to: "/admin-user-page",
            icon: <ManageAccountsRounded fontSize="small" />,
          },
          {
            label: "Manage Issues",
            to: "/admin-issue-page",
            icon: <FormatListBulletedRoundedIcon fontSize="small" />,
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

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 8 : 0}
      sx={{
        top: 0,
        zIndex: 1200,
        bgcolor: trigger
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
        transition: "all 0.3s ease",
      }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 0.5 }}>
          {/* Left: Logo */}
          <Brand />

          {/* Desktop Nav */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ display: { xs: "none", md: "flex" }, ml: 4 }}>
            {links.map((item) => (
              <NavButton key={item.to} {...item} />
            ))}
          </Stack>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Search (Desktop only if applicable) */}
          {showSearch && (
            <Box sx={{ display: { xs: "none", md: "block" }, mr: 2 }}>
              <SearchBar value={searchValue} onChange={handleSearch} />
            </Box>
          )}

          {/* Dark / Light Toggle */}
          <Box sx={{ display: { xs: "none", md: "block" }, mr: 1 }}>
            <ThemeToggle />
          </Box>

          {/* Right: Auth Buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}>
            {!user ? (
              authLinks.map((item) => (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  startIcon={item.icon}
                  variant={item.label === "Register" ? "contained" : "text"}
                  sx={{ textTransform: "none" }}>
                  {item.label}
                </Button>
              ))
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar
                    src={user?.avatar}
                    alt={user?.fullName}
                    sx={{ width: 36, height: 36 }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color:
                        user?.role === "admin"
                          ? "error.main" // admin styling
                          : "success.main", // citizen styling
                      textTransform: "capitalize",
                      userSelect: "none",
                    }}>
                    {user?.role === "admin" ? "Admin" : "Citizen"}
                  </Typography>
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      mt: 1,
                      backdropFilter: "blur(10px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}>
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={() => setAnchorEl(null)}>
                    <ManageAccountsRounded
                      fontSize="small"
                      style={{ marginRight: 8 }}
                    />
                    Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      logout();
                      setAnchorEl(null);
                    }}
                    sx={{ color: "error.main" }}>
                    <LogoutRoundedIcon
                      fontSize="small"
                      style={{ marginRight: 8 }}
                    />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>

          {/* Mobile menu icon */}
          <IconButton
            edge="end"
            sx={{ display: { xs: "inline-flex", md: "none" }, ml: 1 }}
            onClick={() => setOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        links={links}
        authLinks={authLinks}
        searchValue={searchValue}
        onSearchChange={handleSearch}
      />
    </AppBar>
  );
}
