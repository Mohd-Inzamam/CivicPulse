// AdminUsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Pagination,
  Drawer,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { Search, Block, HowToReg, MoreVert } from "@mui/icons-material";
import { motion } from "framer-motion";
import dayjs from "dayjs";

// NOTE: Make sure your usersService exposes these methods:
// usersService.getUsers({ page, limit, search, role, isActive, sort })
// usersService.getUser(userId)
// usersService.toggleUserStatus(userId) -> returns updated user
// usersService.updateUserRole(userId, role) -> returns updated user
import { usersService } from "../../../../services/usersService"; // adjust path as needed

// ----------------------------
// Helper small UI components
// ----------------------------
const SmallStatCard = ({ title, value, color = "primary" }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        borderRadius: 2,
        background: "var(--glass-bg)",
        backdropFilter: "blur(14px)",
        boxShadow: "var(--shadow-light)",
        height: "100%",
      }}>
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mt: 0.5 }}
          color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Status chip
const StatusChip = ({ isActive }) => (
  <Chip
    label={isActive ? "Active" : "Disabled"}
    size="small"
    sx={{
      bgcolor: isActive ? "var(--color-success)" : "var(--color-error)",
      color: "white",
      fontWeight: 700,
      px: 1,
    }}
  />
);

// ----------------------------
// Main Page
// ----------------------------
export default function AdminUsersPage() {
  const theme = useTheme();

  // data + UI state
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    disabled: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  // filters / pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // show 12 rows per page (compact)
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | user | admin
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | disabled
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | name

  // drawer (profile view)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // fetch users
  const fetchUsers = async (opts = {}) => {
    const {
      p = page,
      q = search,
      role = roleFilter,
      status = statusFilter,
      sort = sortBy,
    } = opts;
    try {
      if (p === 1) setLoading(true);
      else setPageLoading(true);

      // the service should accept these query params. adapt if your service differs.
      const res = await usersService.getUsers({
        page: p,
        limit,
        search: q || undefined,
        role: role !== "all" ? role : undefined,
        isActive:
          status === "active"
            ? true
            : status === "disabled"
            ? false
            : undefined,
        sort, // backend should interpret this
      });

      // Expect backend response shape: { data: { users: [], pagination: { page, pages } , stats: {..} } }
      const usersList = res.data?.users || res.users || [];
      const pagination = res.data?.pagination || res.pagination || { pages: 1 };
      const serverStats = res.data?.stats || {};

      setUsers(usersList);
      setTotalPages(pagination.pages || 1);
      // If server returns stats use them, otherwise derive locally
      if (serverStats && Object.keys(serverStats).length) {
        setStats(serverStats);
      } else {
        const total = usersList.length;
        const active = usersList.filter((u) => u.isActive).length;
        const disabled = usersList.filter((u) => !u.isActive).length;
        const admins = usersList.filter((u) => u.role === "admin").length;
        setStats({ total, active, disabled, admins });
      }
    } catch (err) {
      console.error("Failed fetching users", err);
      setToast({
        open: true,
        message: "Failed to load users",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ p: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // memoized summary array
  const summary = useMemo(
    () => [
      { label: "Total Users", value: stats.total || 0, color: "primary" },
      { label: "Active", value: stats.active || 0, color: "success" },
      { label: "Disabled", value: stats.disabled || 0, color: "error" },
      { label: "Admins", value: stats.admins || 0, color: "secondary" },
    ],
    [stats]
  );

  // handlers
  const handleSearchSubmit = async (e) => {
    e?.preventDefault?.();
    setPage(1);
    await fetchUsers({ p: 1, q: search });
  };

  const handleResetFilters = async () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
    setPage(1);
    await fetchUsers({
      p: 1,
      q: "",
      role: "all",
      status: "all",
      sort: "newest",
    });
  };

  const onChangePage = async (e, value) => {
    setPage(value);
    await fetchUsers({ p: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // toggle active status (enable/disable)
  const toggleUser = async (u) => {
    try {
      // optimistic UI
      setUsers((prev) =>
        prev.map((it) =>
          it._id === u._id ? { ...it, isActive: !it.isActive } : it
        )
      );
      const res = await usersService.toggleUserStatus(u._id);
      const updated = res.data?.user || res.user || res;
      setUsers((prev) =>
        prev.map((it) => (it._id === updated._id ? updated : it))
      );
      setToast({
        open: true,
        message: `User ${
          updated.isActive ? "enabled" : "disabled"
        } successfully`,
        severity: "success",
      });
      // update stats local
      setStats((s) => ({
        ...s,
        active: updated.isActive ? s.active + 1 : s.active - 1,
        disabled: updated.isActive ? s.disabled - 1 : s.disabled + 1,
      }));
    } catch (err) {
      console.error("toggle user failed", err);
      setToast({ open: true, message: "Action failed", severity: "error" });
      // rollback by refetching current page
      fetchUsers({ p: page });
    }
  };

  // change role (promote/demote)
  const changeRole = async (u, newRole) => {
    try {
      setUsers((prev) =>
        prev.map((it) => (it._id === u._id ? { ...it, role: newRole } : it))
      );
      const res = await usersService.updateUserRole(u._id, newRole);
      const updated = res.data?.user || res.user || res;
      setUsers((prev) =>
        prev.map((it) => (it._id === updated._id ? updated : it))
      );
      setToast({
        open: true,
        message: `Role updated to ${updated.role}`,
        severity: "success",
      });
    } catch (err) {
      console.error("role change failed", err);
      setToast({
        open: true,
        message: "Role update failed",
        severity: "error",
      });
      fetchUsers({ p: page });
    }
  };

  const openProfile = async (userId) => {
    try {
      const res = await usersService.getUser(userId);
      const u = res.data?.user || res.user || res;
      setSelectedUser(u);
      setDrawerOpen(true);
    } catch (err) {
      console.error("Failed to get user", err);
      setToast({
        open: true,
        message: "Unable to load profile",
        severity: "error",
      });
    }
  };

  // UI: small compact table rows
  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage all users — search, filter, enable/disable, and change roles.
        </Typography>
      </Box>

      {/* Top summary */}
      <Grid container spacing={2} mb={3}>
        {summary.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <SmallStatCard title={s.label} value={s.value} color={s.color} />
          </Grid>
        ))}
      </Grid>

      {/* Filters row */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          background: "var(--glass-bg)",
          boxShadow: "var(--shadow-light)",
        }}>
        <CardContent
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ display: "flex", gap: 1, flex: 1, minWidth: 220 }}>
            <TextField
              size="small"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ minWidth: 260 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ whiteSpace: "nowrap" }}>
              Search
            </Button>
          </Box>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sortBy}
              label="Sort"
              onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              size="small">
              Reset
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                fetchUsers({
                  p: 1,
                  q: search,
                  role: roleFilter,
                  status: statusFilter,
                  sort: sortBy,
                })
              }>
              Apply
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 2, boxShadow: "var(--shadow-medium)" }}>
        <CardContent sx={{ p: 1.5 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 56 }}>#</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, idx) => (
                    <TableRow
                      key={u._id}
                      sx={{
                        "&:hover": { background: theme.palette.action.hover },
                        height: 56,
                      }}>
                      <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={u.avatar}
                            sx={{ width: 36, height: 36 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {u.fullName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary">
                              {u.officialDetails?.designation || ""}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{u.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          size="small"
                          sx={{
                            background:
                              u.role === "admin"
                                ? "var(--color-secondary)"
                                : "var(--color-primary)",
                            color: "white",
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip isActive={u.isActive} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(u.createdAt).format("DD MMM YYYY")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          alignItems="center">
                          <Tooltip
                            title={u.isActive ? "Disable user" : "Enable user"}>
                            <IconButton
                              size="small"
                              onClick={() => toggleUser(u)}>
                              {u.isActive ? (
                                <Block sx={{ color: "var(--color-error)" }} />
                              ) : (
                                <HowToReg
                                  sx={{ color: "var(--color-success)" }}
                                />
                              )}
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              u.role === "admin"
                                ? "Demote to user"
                                : "Promote to admin"
                            }>
                            <IconButton
                              size="small"
                              onClick={() =>
                                changeRole(
                                  u,
                                  u.role === "admin" ? "user" : "admin"
                                )
                              }>
                              <MoreVert />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View profile">
                            <IconButton
                              size="small"
                              onClick={() => openProfile(u._id)}>
                              <Search />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={onChangePage}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Profile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 3 }}>
          {!selectedUser ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                  src={selectedUser.avatar}
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography variant="h6">{selectedUser.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Official Details
              </Typography>
              <Stack spacing={1} mb={2}>
                <Typography variant="body2">
                  <strong>Department:</strong>{" "}
                  {selectedUser.officialDetails?.department || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong>{" "}
                  {selectedUser.officialDetails?.designation || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong>Employee ID:</strong>{" "}
                  {selectedUser.officialDetails?.employeeId || "-"}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Account
              </Typography>
              <Stack spacing={1} mb={2}>
                <Typography variant="body2">
                  <strong>Status:</strong>{" "}
                  {selectedUser.isActive ? "Active" : "Disabled"}
                </Typography>
                <Typography variant="body2">
                  <strong>Role:</strong> {selectedUser.role}
                </Typography>
                <Typography variant="body2">
                  <strong>Joined:</strong>{" "}
                  {dayjs(selectedUser.createdAt).format("DD MMM YYYY")}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant={selectedUser.isActive ? "outlined" : "contained"}
                  color={selectedUser.isActive ? "error" : "success"}
                  onClick={() => toggleUser(selectedUser)}>
                  {selectedUser.isActive ? "Disable" : "Enable"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() =>
                    changeRole(
                      selectedUser,
                      selectedUser.role === "admin" ? "user" : "admin"
                    )
                  }>
                  {selectedUser.role === "admin"
                    ? "Demote to User"
                    : "Promote to Admin"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
