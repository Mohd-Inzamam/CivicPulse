import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { motion, AnimatePresence } from "framer-motion";
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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
        },
      }}>
      <Box sx={{ width: 300, p: 2 }} role="presentation">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ThemeToggle />
            <IconButton onClick={onClose}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ my: 1 }} />

        {/* Search */}
        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search issues..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon color="action" />
                </InputAdornment>
              ),
              style: {
                borderRadius: 50,
                backgroundColor: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              },
            }}
          />
        </Box>

        <List>
          <AnimatePresence initial={false}>
            {links.map((l, idx) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: idx * 0.05 }}>
                <ListItemButton
                  component={RouterLink}
                  to={l.to}
                  onClick={onClose}
                  selected={pathname === l.to}>
                  {l.icon}
                  <ListItemText primary={l.label} sx={{ ml: 1 }} />
                </ListItemButton>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>

        <Divider sx={{ my: 1 }} />

        <List>
          {!user ? (
            authLinks.map((l) => (
              <ListItemButton
                key={l.label}
                component={RouterLink}
                to={l.to}
                onClick={onClose}>
                {l.icon}
                <ListItemText primary={l.label} sx={{ ml: 1 }} />
              </ListItemButton>
            ))
          ) : (
            <>
              <ListItemButton disabled>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName}
                  sx={{ width: 28, height: 28, mr: 1 }}
                />
                <ListItemText primary={user.displayName} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  logout();
                  onClose();
                }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
