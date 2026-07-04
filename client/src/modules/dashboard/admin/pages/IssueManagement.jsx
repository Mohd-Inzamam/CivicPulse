// IssueManagement.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import dayjs from "dayjs";

// Adjust this import path to match your project
import { issuesService } from "../../../../services/issuesService";
import { API_BASE_URL } from "../../../../config/api.js";

// Helper: status color mapping (colors use theme tokens where possible)
const statusColor = (status) => {
  if (status === "Open") return "var(--status-open)";
  if (status === "In Progress") return "var(--status-warn)";
  if (status === "Resolved") return "var(--status-done)";
  return "var(--ink-secondary)";
};

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

  // AI response suggestion state
  const [aiResponseDialog, setAiResponseDialog] = useState({
    open: false,
    issueId: null,
    newStatus: "",
    suggestion: "",
    loading: false,
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
          new Set(list.map((i) => i.category).filter(Boolean)),
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
    [search, statusFilter, categoryFilter, locationFilter],
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
    [hasMore, search, statusFilter, categoryFilter, locationFilter],
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
      { root: null, rootMargin: "300px", threshold: 0.1 },
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
        updatePayload,
      );
      const updated = res?.data || res;
      setIssues((prev) =>
        prev.map((it) =>
          it._id === updated._id || it._id === updated.id ? updated : it,
        ),
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
          (it) => it._id !== deletingIssue._id && it._id !== deletingIssue.id,
        ),
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
          : it,
      ),
    );
    try {
      const validatedStatus = newStatus.trim();
      await issuesService.updateIssueStatus(issueId, validatedStatus);
      setToast({ open: true, message: "Status updated", severity: "success" });

      // Fetch AI response suggestion in background — show dialog with result
      setAiResponseDialog({
        open: false,
        issueId,
        newStatus,
        suggestion: "",
        loading: true,
      });
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/ai/suggest-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          body: JSON.stringify({ issueId, newStatus }),
        });
        const data = await res.json();
        const suggestion = data.data?.suggestion || data.suggestion || "";
        if (suggestion) {
          setAiResponseDialog({
            open: true,
            issueId,
            newStatus,
            suggestion,
            loading: false,
          });
        }
      } catch {
        // silently ignore — AI suggestion is optional
        setAiResponseDialog((p) => ({ ...p, loading: false, open: false }));
      }
    } catch (err) {
      console.error("Status update failed", err);
      setToast({
        open: true,
        message: "Status update failed",
        severity: "error",
      });
      loadFirstPage();
    }
  };

  // render compact issue list item
  const IssueRow = ({ issue, index }) => {
    return (
      <div
        style={{
          animation: `fadeInUp 0.35s ease-out ${index * 0.03}s both`,
        }}>
        <div
          className="card"
          style={{
            marginBottom: 10,
            borderRadius: 16,
            background: "var(--surface-base)",
            boxShadow: "var(--shadow-sm)",
          }}>
          <div
            className="card-body"
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              padding: "16px 24px",
            }}>
            {/* Left: basic info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink-primary)" }}>
                {issue.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-secondary)", display: "block" }}>
                {issue.category || "—"} • {issue.location || "Unknown location"}{" "}
                • {dayjs(issue.createdAt).format("DD MMM YYYY")}
              </div>
            </div>

            {/* Middle: upvotes + reporter */}
            <div
              style={{ display: "flex", gap: 16, alignItems: "center", marginRight: 16 }}>
              <span
                style={{
                  background: "var(--surface-subtle)",
                  padding: "4px 8px",
                  borderRadius: 16,
                  fontSize: "0.8125rem",
                  color: "var(--ink-primary)"
                }}
              >
                👍 {issue.upvotes || 0}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
                {issue.createdBy?.fullName || "Anonymous"}
              </span>
            </div>

            {/* Right: status + actions */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                className="input"
                style={{ padding: "4px 8px", width: 140, height: 32 }}
                value={issue.status}
                onChange={(e) =>
                  changeStatusQuick(issue._id || issue.id, e.target.value)
                }>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button className="btn-icon" onClick={() => handleViewIssue(issue)}>
                <i className="ti ti-eye" style={{ fontSize: "1.25rem" }} />
              </button>

              <button
                className="btn-icon"
                onClick={() => openEditDrawer(issue)}
                title="Edit">
                <i className="ti ti-edit" style={{ fontSize: "1.25rem" }} />
              </button>

              <button
                className="btn-icon"
                onClick={() => confirmDelete(issue)}
                title="Delete">
                <i className="ti ti-trash" style={{ fontSize: "1.25rem", color: "var(--status-open)" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", padding: "32px 0", maxWidth: 1200, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, margin: "0 0 8px 0", fontSize: "2.125rem", color: "var(--ink-primary)" }}>
          Issue Management
        </h4>
        <p style={{ fontSize: "0.875rem", color: "var(--ink-secondary)", margin: 0 }}>
          Review, filter and moderate reported issues. Scroll to load more.
        </p>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: "var(--surface-base)",
          boxShadow: "var(--shadow-sm)",
        }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
            padding: 24,
          }}>
          <div style={{ position: "relative", minWidth: 240 }}>
            <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-tertiary)" }} />
            <input
              className="input"
              style={{ paddingLeft: 36, width: "100%" }}
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "100%" }}>
              <option value="all">Status: All</option>
              <option value="Open">Status: Open</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Resolved">Status: Resolved</option>
            </select>
          </div>

          <div style={{ minWidth: 160 }}>
            <select
              className="input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: "100%" }}>
              <option value="all">Category: All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <input
            className="input"
            style={{ minWidth: 160 }}
            placeholder="City / Area"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              className="btn btn-outline"
              style={{ padding: "6px 12px" }}
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setLocationFilter("");
                loadFirstPage();
              }}>
              Reset
            </button>
            <button 
              className="btn btn-primary" 
              style={{ padding: "6px 16px" }}
              onClick={() => loadFirstPage()}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <span className="spinner" style={{ "--sz": "40px" }} />
          </div>
        ) : issues.length === 0 ? (
          <div className="card" style={{ borderRadius: 16 }}>
            <div style={{ padding: 24 }}>
              <p style={{ color: "var(--ink-secondary)", margin: 0 }}>No issues found.</p>
            </div>
          </div>
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
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
            <span className="spinner" style={{ "--sz": "20px" }} />
          </div>
        )}

        {/* sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>

      {/* Edit Drawer */}
      <div 
        className={`drawer-overlay ${drawerOpen ? "open" : ""}`} 
        onClick={closeDrawer}
      >
        <div 
          className="drawer" 
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}>
            {!editingIssue ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
                <span className="spinner" style={{ "--sz": "40px" }} />
              </div>
            ) : (
              <>
                <h6 style={{ fontWeight: 700, margin: "0 0 8px 0", fontSize: "1.25rem", color: "var(--ink-primary)" }}>
                  Edit Issue
                </h6>
                <p style={{ fontSize: "0.875rem", color: "var(--ink-secondary)", margin: "0 0 16px 0" }}>
                  ID: {editingIssue._id || editingIssue.id}
                </p>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    className="input"
                    value={editingIssue.title || ""}
                    onChange={(e) =>
                      setEditingIssue((s) => ({ ...s, title: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="input"
                    value={editingIssue.description || ""}
                    onChange={(e) =>
                      setEditingIssue((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="input"
                    value={editingIssue.category || ""}
                    onChange={(e) =>
                      setEditingIssue((s) => ({ ...s, category: e.target.value }))
                    }>
                    {categories.length ? (
                      categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Road">Road</option>
                        <option value="Water">Water</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Garbage">Garbage</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    className="input"
                    value={editingIssue.location || ""}
                    onChange={(e) =>
                      setEditingIssue((s) => ({ ...s, location: e.target.value }))
                    }
                  />
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    className="btn btn-outline"
                    onClick={closeDrawer}
                    disabled={editLoading}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={saveEdits}
                    disabled={editLoading}>
                    {editLoading ? (
                      <span className="spinner" style={{ "--sz": "16px" }} />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      {deleteDialogOpen && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 400, width: "100%" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink-primary)", fontWeight: 500 }}>
                Confirm Delete
              </h2>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ margin: 0, color: "var(--ink-primary)" }}>
                Are you sure you want to delete this issue? This action cannot be undone.
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--ink-secondary)", marginTop: 8 }}>
                {deletingIssue?.title}
              </p>
            </div>
            <div style={{ padding: 16, display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-subtle)" }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ background: "var(--status-open)", borderColor: "var(--status-open)" }}
                onClick={performDelete} 
                disabled={deleteLoading}
              >
                {deleteLoading ? <span className="spinner" style={{ "--sz": "16px" }} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* view dialog */}
      {viewModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseViewModal}>
          <div 
            className="modal" 
            style={{ maxWidth: 500, width: "100%", margin: "10vh auto", maxHeight: "80vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 24 }}>
              <h6 style={{ margin: "0 0 16px 0", fontWeight: 600, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
                Issue Details
              </h6>

              {selectedIssue && (
                <>
                  <p style={{ margin: "0 0 8px 0", color: "var(--ink-primary)" }}>
                    <strong>Title:</strong> {selectedIssue.title}
                  </p>
                  <p style={{ margin: "0 0 8px 0", color: "var(--ink-primary)" }}>
                    <strong>Category:</strong> {selectedIssue.category}
                  </p>
                  <p style={{ margin: "0 0 8px 0", color: "var(--ink-primary)" }}>
                    <strong>Status:</strong> {selectedIssue.status}
                  </p>
                  <p style={{ margin: "8px 0", color: "var(--ink-primary)" }}>
                    <strong>Description:</strong>
                    <br />
                    {selectedIssue.description}
                  </p>
                  <p style={{ margin: "8px 0 0 0", color: "var(--ink-primary)" }}>
                    <strong>Reported By:</strong> {selectedIssue.reportedBy?.name}
                  </p>
                  <p style={{ margin: "8px 0 0 0", color: "var(--ink-primary)" }}>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedIssue.createdAt).toLocaleString()}
                  </p>
                </>
              )}

              <div style={{ textAlign: "right", marginTop: 24 }}>
                <button className="btn btn-primary" onClick={handleCloseViewModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.open && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1400 }}>
          <div style={{ 
            background: toast.severity === "success" ? "var(--status-done)" : "var(--status-open)", 
            color: "#fff", 
            padding: "12px 24px", 
            borderRadius: 8, 
            boxShadow: "var(--shadow-md)",
            fontSize: "0.875rem",
            fontWeight: 500
          }}>
            {toast.message}
          </div>
        </div>
      )}

      {/* AI Response Suggestion Dialog */}
      {aiResponseDialog.open && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 600, width: "100%" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-sparkles" style={{ color: "var(--accent)", fontSize: 20 }} />
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink-primary)", fontWeight: 500 }}>
                AI Response Suggestion
              </h2>
            </div>
            
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-secondary)", marginBottom: 16 }}>
                Status changed to <strong>{aiResponseDialog.newStatus}</strong>.
                Here's a suggested public response you can use:
              </p>
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--border-subtle)",
                  fontStyle: "italic",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--ink-primary)"
                }}>
                {aiResponseDialog.suggestion}
              </div>
              <p
                style={{ fontSize: "0.75rem", color: "var(--ink-secondary)", marginTop: 16, display: "block" }}>
                You can copy this and paste it as a comment on the issue.
              </p>
            </div>
            
            <div style={{ padding: 16, display: "flex", justifyContent: "flex-end", gap: 8, borderTop: "1px solid var(--border-subtle)" }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setAiResponseDialog((p) => ({ ...p, open: false }))}
              >
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  navigator.clipboard.writeText(aiResponseDialog.suggestion);
                  setToast({ open: true, message: "Copied to clipboard!", severity: "success" });
                  setAiResponseDialog((p) => ({ ...p, open: false }));
                }} 
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1300;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        
        .drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          background: var(--surface-base);
          box-shadow: -4px 0 24px rgba(0,0,0,0.1);
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        
        @media (min-width: 600px) {
          .drawer {
            width: 520px;
          }
        }
        
        .drawer-overlay.open .drawer {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}
