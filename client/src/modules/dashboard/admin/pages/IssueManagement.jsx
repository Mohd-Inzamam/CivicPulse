// IssueManagement.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Button,
  Stack,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Modal,
  Divider,
} from "@mui/material";
import { Edit, Delete, Search, MoreHoriz } from "@mui/icons-material";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Adjust this import path to match your project
import { issuesService } from "../../../../services/issuesService";

// Helper: status color mapping (colors use theme tokens where possible)
const statusColor = (status) => {
  if (status === "Open") return "error";
  if (status === "In Progress") return "warning";
  if (status === "Resolved") return "success";
  return "default";
};

const issueRowMinHeight = 64;
const PAGE_LIMIT = 12; // items per page on infinite scroll

export default function IssueManagement() {
  // Data
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | Open | In Progress | Resolved
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  // drawer / edit
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIssue, setDeletingIssue] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // view dialog
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // sentinel for infinite scroll
  const sentinelRef = useRef(null);

  // debounce timer
  const searchTimer = useRef(null);

  // fetch categories for filter (if available from backend you can fetch; here we derive from issues)
  const [categories, setCategories] = useState([]);

  // Build query object used in API
  const buildQuery = (p = page) => {
    const q = {
      page: p,
      limit: PAGE_LIMIT,
    };
    if (search && search.trim().length) q.search = search.trim();
    if (statusFilter !== "all") q.status = statusFilter;
    if (categoryFilter !== "all") q.category = categoryFilter;
    if (locationFilter && locationFilter.trim())
      q.location = locationFilter.trim();
    return q;
  };

  // initial load & reset on filter change
  const loadFirstPage = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const q = buildQuery(1);
        const res = await issuesService.getAllIssues(q);
        // expecting res.data.issues or res.issues
        const list = res?.data?.issues || res?.issues || [];
        setIssues(list);
        // derive categories
        const cats = Array.from(
          new Set(list.map((i) => i.category).filter(Boolean))
        );
        setCategories(cats);
        // set hasMore based on pagination if available
        const pagination = res?.data?.pagination || res?.pagination;
        if (pagination && typeof pagination.pages !== "undefined") {
          setHasMore(pagination.page < pagination.pages);
        } else {
          // fallback: if we got less than limit, assume no more
          setHasMore(list.length === PAGE_LIMIT);
        }
      } catch (err) {
        console.error("Failed to fetch issues", err);
        setError("Failed to load issues. Try again.");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, statusFilter, categoryFilter, locationFilter]
  );

  // load next page for infinite scroll
  const loadNextPage = useCallback(
    async (nextPage) => {
      if (!hasMore) return;
      setLoadingMore(true);
      try {
        const q = buildQuery(nextPage);
        const res = await issuesService.getAllIssues(q);
        const list = res?.data?.issues || res?.issues || [];
        setIssues((prev) => [...prev, ...list]);
        const pagination = res?.data?.pagination || res?.pagination;
        if (
          pagination &&
          typeof pagination.page !== "undefined" &&
          typeof pagination.pages !== "undefined"
        ) {
          setHasMore(pagination.page < pagination.pages);
          setPage(pagination.page + 0); // ensure page is in sync
        } else {
          setHasMore(list.length === PAGE_LIMIT);
          setPage(nextPage);
        }
      } catch (err) {
        console.error("Failed to load more issues", err);
        setToast({
          open: true,
          message: "Failed to load more issues",
          severity: "error",
        });
      } finally {
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasMore, search, statusFilter, categoryFilter, locationFilter]
  );

  // initial mount
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // handle debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      loadFirstPage();
    }, 450);
    return () => clearTimeout(searchTimer.current);
  }, [search, statusFilter, categoryFilter, locationFilter, loadFirstPage]);

  // infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !loadingMore &&
            hasMore &&
            issues.length > 0
          ) {
            // load next page
            loadNextPage(page + 1);
          }
        });
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadNextPage, hasMore, loadingMore, page, issues.length]);

  // open edit drawer
  const openEditDrawer = (issue) => {
    setEditingIssue({ ...issue }); // clone
    setDrawerOpen(true);
  };

  // close drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingIssue(null);
  };

  // view handler
  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedIssue(null);
  };

  // save edits (uses updateIssue)
  const saveEdits = async () => {
    if (!editingIssue) return;
    setEditLoading(true);
    try {
      const updatePayload = {
        title: editingIssue.title,
        description: editingIssue.description,
        category: editingIssue.category,
        location: editingIssue.location,
        image: editingIssue.image, // if changed via uploader (not implemented here)
      };
      const res = await issuesService.updateIssue(
        editingIssue._id || editingIssue.id,
        updatePayload
      );
      const updated = res?.data || res;
      setIssues((prev) =>
        prev.map((it) =>
          it._id === updated._id || it._id === updated.id ? updated : it
        )
      );
      setToast({ open: true, message: "Issue updated", severity: "success" });
      closeDrawer();
    } catch (err) {
      console.error("Failed to update issue", err);
      setToast({ open: true, message: "Update failed", severity: "error" });
    } finally {
      setEditLoading(false);
    }
  };

  // open delete confirmation
  const confirmDelete = (issue) => {
    setDeletingIssue(issue);
    setDeleteDialogOpen(true);
  };

  // perform delete
  const performDelete = async () => {
    if (!deletingIssue) return;
    setDeleteLoading(true);
    try {
      await issuesService.deleteIssue(deletingIssue._id || deletingIssue.id);
      setIssues((prev) =>
        prev.filter(
          (it) => it._id !== deletingIssue._id && it._id !== deletingIssue.id
        )
      );
      setToast({ open: true, message: "Issue deleted", severity: "success" });
      setDeleteDialogOpen(false);
      setDeletingIssue(null);
    } catch (err) {
      console.error("Delete failed", err);
      setToast({ open: true, message: "Delete failed", severity: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // change status quickly (use updateIssueStatus endpoint to keep semantics)
  const changeStatusQuick = async (issueId, newStatus) => {
    // optimistic update
    setIssues((prev) =>
      prev.map((it) =>
        it._id === issueId || it.id === issueId
          ? { ...it, status: newStatus }
          : it
      )
    );
    try {
      await issuesService.updateIssueStatus(issueId, { status: newStatus });
      setToast({ open: true, message: "Status updated", severity: "success" });
    } catch (err) {
      console.error("Status update failed", err);
      setToast({
        open: true,
        message: "Status update failed",
        severity: "error",
      });
      // rollback by reloading first page (simple)
      loadFirstPage();
    }
  };

  // render compact issue list item
  const IssueRow = ({ issue, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.03 }}>
        <Card
          sx={{
            mb: 1.25,
            borderRadius: 2,
            background: "var(--glass-bg)",
            boxShadow: "var(--shadow-light)",
          }}>
          <CardContent
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              minHeight: issueRowMinHeight,
            }}>
            {/* Left: basic info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {issue.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}>
                {issue.category || "—"} • {issue.location || "Unknown location"}{" "}
                • {dayjs(issue.createdAt).format("DD MMM YYYY")}
              </Typography>
            </Box>

            {/* Middle: upvotes + reporter */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mr: 2 }}>
              <Chip label={`👍 ${issue.upvotes || 0}`} size="small" />
              <Typography variant="body2" color="text.secondary">
                {issue.createdBy?.fullName || "Anonymous"}
              </Typography>
            </Stack>

            {/* Right: status + actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={issue.status}
                  onChange={(e) =>
                    changeStatusQuick(issue._id || issue.id, e.target.value)
                  }>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </FormControl>

              <IconButton onClick={() => handleViewIssue(issue)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>

              <IconButton
                onClick={() => openEditDrawer(issue)}
                size="small"
                aria-label="edit">
                <Edit />
              </IconButton>

              <IconButton
                onClick={() => confirmDelete(issue)}
                size="small"
                aria-label="delete">
                <Delete />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Issue Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review, filter and moderate reported issues. Scroll to load more.
        </Typography>
      </Box>

      {/* Filters */}
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
            flexWrap: "wrap",
            alignItems: "center",
          }}>
          <TextField
            size="small"
            placeholder="Search by title..."
            startAdornment={<Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 240 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="City / Area"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          />

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setLocationFilter("");
                loadFirstPage();
              }}>
              Reset
            </Button>
            <Button variant="contained" onClick={() => loadFirstPage()}>
              Apply
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* List */}
      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : issues.length === 0 ? (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary">No issues found.</Typography>
            </CardContent>
          </Card>
        ) : (
          issues.map((issue, idx) => (
            <IssueRow
              key={issue._id || issue.id || idx}
              issue={issue}
              index={idx}
            />
          ))
        )}

        {/* loading more indicator */}
        {loadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {/* sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </Box>

      {/* Edit Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box sx={{ width: { xs: 320, sm: 520 }, p: 3 }}>
          {!editingIssue ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Edit Issue
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ID: {editingIssue._id || editingIssue.id}
              </Typography>

              <TextField
                label="Title"
                value={editingIssue.title || ""}
                onChange={(e) =>
                  setEditingIssue((s) => ({ ...s, title: e.target.value }))
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Description"
                value={editingIssue.description || ""}
                onChange={(e) =>
                  setEditingIssue((s) => ({
                    ...s,
                    description: e.target.value,
                  }))
                }
                fullWidth
                multiline
                minRows={4}
                size="small"
                sx={{ mb: 2 }}
              />

              <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingIssue.category || ""}
                  label="Category"
                  onChange={(e) =>
                    setEditingIssue((s) => ({ ...s, category: e.target.value }))
                  }>
                  {categories.length ? (
                    categories.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))
                  ) : (
                    <>
                      <MenuItem value="Road">Road</MenuItem>
                      <MenuItem value="Water">Water</MenuItem>
                      <MenuItem value="Electricity">Electricity</MenuItem>
                      <MenuItem value="Garbage">Garbage</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>

              <TextField
                label="Location"
                value={editingIssue.location || ""}
                onChange={(e) =>
                  setEditingIssue((s) => ({ ...s, location: e.target.value }))
                }
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={closeDrawer}
                  disabled={editLoading}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={saveEdits}
                  disabled={editLoading}>
                  {editLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this issue? This action cannot be
            undone.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {deletingIssue?.title}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={performDelete}
            disabled={deleteLoading}
            variant="contained">
            {deleteLoading ? <CircularProgress size={16} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* view dialog */}
      <Modal open={viewModalOpen} onClose={handleCloseViewModal}>
        <Box
          sx={{
            width: 500,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            mx: "auto",
            mt: "10vh",
          }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Issue Details
          </Typography>

          {selectedIssue && (
            <>
              <Typography>
                <strong>Title:</strong> {selectedIssue.title}
              </Typography>
              <Typography>
                <strong>Category:</strong> {selectedIssue.category}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedIssue.status}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Description:</strong>
                <br />
                {selectedIssue.description}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Reported By:</strong> {selectedIssue.reportedBy?.name}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Created At:</strong>{" "}
                {new Date(selectedIssue.createdAt).toLocaleString()}
              </Typography>
            </>
          )}

          <Box textAlign="right" mt={3}>
            <Button variant="contained" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

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
