import { useState } from "react";
import { useLocation } from "react-router-dom";
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
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import navbar components
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

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return (
    <Box component={motion.div} animate={{ y: 0 }} initial={{ y: -24 }}>
      {children({ elevation: trigger ? 6 : 0 })}
    </Box>
  );
}

export default function Navbar({ setFilters }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const { user, logout } = useAuth();

  const links = [
    { label: "Home", to: "/", icon: <HomeRoundedIcon fontSize="small" /> },

    // USER-only: show Report/Issues
    ...(user?.role === "user"
      ? [
          {
            label: "Report",
            to: "/issues",
            icon: <ReportProblemRoundedIcon fontSize="small" />,
          },

          {
            label: "Activity",
            to: "/user-dashboard",
            icon: <ReportProblemRoundedIcon fontSize="small" />,
          },
        ]
      : []),

    // ADMIN-only: show Dashboard
    ...(user?.role === "admin"
      ? [
          {
            label: "Dashboard",
            to: "/dashboard",
            icon: <DashboardRoundedIcon fontSize="small" />,
          },
        ]
      : []),
  ];
  console.log(user);

  // Shared search logic
  const handleSearch = (value) => {
    setSearchValue(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  return (
    <ElevationScroll>
      {({ elevation }) => (
        <AppBar
          position="sticky"
          color="inherit"
          elevation={elevation}
          sx={{
            backdropFilter: "blur(16px) saturate(180%)",
            bgcolor: "rgba(255,255,255,0.75)",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ py: 0.5 }}>
              {/* Left: Brand */}
              <Brand />

              {/* Desktop Links */}
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ ml: 4, display: { xs: "none", md: "flex" } }}>
                {links.map((l) => (
                  <NavButton key={l.to} {...l} />
                ))}
              </Stack>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Search (desktop) */}
              <Box sx={{ display: { xs: "none", md: "block" }, mr: 2 }}>
                <SearchBar value={searchValue} onChange={handleSearch} />
              </Box>

              {/* Theme Toggle */}
              <Box sx={{ display: { xs: "none", md: "block" }, mr: 1 }}>
                <ThemeToggle />
              </Box>

              {/* Right: Auth */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                }}>
                {!user ? (
                  <>
                    {authLinks.map((l) => (
                      <Button
                        key={l.label}
                        component={RouterLink}
                        to={l.to}
                        startIcon={l.icon}
                        variant={l.label === "Register" ? "contained" : "text"}
                        sx={{ textTransform: "none" }}>
                        {l.label}
                      </Button>
                    ))}
                  </>
                ) : (
                  <>
                    <Avatar
                      src={user.avatar}
                      alt={user.fullName}
                      sx={{ width: 36, height: 36, cursor: "pointer" }}
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    />

                    <Menu
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={() => setAnchorEl(null)}
                      PaperProps={{
                        sx: {
                          borderRadius: 3,
                          mt: 1,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        },
                      }}>
                      {/* <MenuItem onClick={() => setAnchorEl(null)}>
                        Profile
                      </MenuItem> */}
                      <MenuItem
                        component={RouterLink}
                        to="/profile"
                        onClick={() => setAnchorEl(null)}>
                        Profile
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          logout();
                          setAnchorEl(null);
                        }}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Stack>

              {/* Mobile: Menu Button */}
              <IconButton
                edge="end"
                sx={{ ml: 1, display: { xs: "inline-flex", md: "none" } }}
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
      )}
    </ElevationScroll>
  );
}
