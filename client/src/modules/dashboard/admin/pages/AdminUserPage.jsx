// AdminUsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

// NOTE: Make sure your usersService exposes these methods:
// usersService.getUsers({ page, limit, search, role, isActive, sort })
// usersService.getUser(userId)
// usersService.toggleUserStatus(userId) -> returns updated user
// usersService.updateUserRole(userId, role) -> returns updated user
import { userServices } from "../../../../../src/services/userServices.js"; // adjust path as needed

// ----------------------------
// Helper small UI components
// ----------------------------
const SmallStatCard = ({ title, value, color = "var(--ink-primary)" }) => {
  return (
    <div
      className="card"
      style={{
        borderRadius: 16,
        background: "var(--surface-base)",
        boxShadow: "var(--shadow-sm)",
        height: "100%",
        padding: "12px 16px"
      }}>
      <span style={{ fontSize: "0.75rem", color: "var(--ink-secondary)", display: "block" }}>
        {title}
      </span>
      <h6
        style={{ fontWeight: 700, marginTop: 4, margin: 0, fontSize: "1.25rem", color }}>
        {value}
      </h6>
    </div>
  );
};

// Status chip
const StatusChip = ({ isActive }) => (
  <span
    style={{
      backgroundColor: isActive ? "var(--status-done)" : "var(--status-open)",
      color: "white",
      fontWeight: 700,
      padding: "2px 8px",
      fontSize: "0.8125rem",
      borderRadius: 16,
      display: "inline-block"
    }}
  >
    {isActive ? "Active" : "Disabled"}
  </span>
);

// ----------------------------
// Main Page
// ----------------------------
export default function AdminUsersPage() {
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
      const res = await userServices.getAllUsers({
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
      { label: "Total Users", value: stats.total || 0, color: "var(--ink-primary)" },
      { label: "Active", value: stats.active || 0, color: "var(--status-done)" },
      { label: "Disabled", value: stats.disabled || 0, color: "var(--status-open)" },
      { label: "Admins", value: stats.admins || 0, color: "var(--accent)" },
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

  const onChangePage = async (pageValue) => {
    setPage(pageValue);
    await fetchUsers({ p: pageValue });
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
      const res = await userServices.toggleUserStatus(u._id);
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
      const res = await userServices.updateUserRole(u._id, newRole);
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
      const res = await userServices.getUserById(userId);
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
    <div style={{ minHeight: "100vh", padding: "32px 0", maxWidth: 1200, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, margin: "0 0 8px 0", fontSize: "2.125rem", color: "var(--ink-primary)" }}>
          User Management
        </h4>
        <p style={{ fontSize: "0.875rem", color: "var(--ink-secondary)", margin: 0 }}>
          Manage all users — search, filter, enable/disable, and change roles.
        </p>
      </div>

      {/* Top summary */}
      <div className="grid-summary" style={{ marginBottom: 24 }}>
        {summary.map((s) => (
          <SmallStatCard key={s.label} title={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      {/* Filters row */}
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
            alignItems: "center",
            flexWrap: "wrap",
            padding: 24
          }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", gap: 8, flex: 1, minWidth: 220 }}>
            <div style={{ position: "relative", width: "100%", minWidth: 260 }}>
              <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-tertiary)" }} />
              <input
                className="input"
                style={{ paddingLeft: 36, width: "100%" }}
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap" }}>
              Search
            </button>
          </form>

          <div style={{ minWidth: 140 }}>
            <select
              className="input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: "100%" }}>
              <option value="all">Role: All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ minWidth: 140 }}>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "100%" }}>
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div style={{ minWidth: 160 }}>
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "100%" }}>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              className="btn btn-outline"
              onClick={handleResetFilters}
              style={{ padding: "6px 12px" }}>
              Reset
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                fetchUsers({
                  p: 1,
                  q: search,
                  role: roleFilter,
                  status: statusFilter,
                  sort: sortBy,
                })
              }
              style={{ padding: "6px 16px" }}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ borderRadius: 16, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="user-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", width: 56 }}>#</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>User</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Role</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Joined</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 0" }}>
                    <span className="spinner" style={{ "--sz": "30px" }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 0", color: "var(--ink-secondary)" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <tr
                    key={u._id}
                    className="user-row-hover"
                    style={{
                      height: 56,
                      borderBottom: "1px solid var(--border-subtle)"
                    }}>
                    <td style={{ padding: "8px 16px", fontSize: "0.875rem" }}>{(page - 1) * limit + idx + 1}</td>
                    <td style={{ padding: "8px 16px" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.fullName} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                            {u.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink-primary)" }}>
                            {u.fullName}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--ink-secondary)" }}>
                            {u.officialDetails?.designation || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "8px 16px", fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "8px 16px" }}>
                      <span
                        style={{
                          background:
                            u.role === "admin"
                              ? "var(--accent)"
                              : "var(--accent-muted)",
                          color: u.role === "admin" ? "white" : "var(--accent-text)",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 16,
                          fontSize: "0.75rem"
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "8px 16px" }}>
                      <StatusChip isActive={u.isActive} />
                    </td>
                    <td style={{ padding: "8px 16px", fontSize: "0.75rem", color: "var(--ink-secondary)" }}>
                      {dayjs(u.createdAt).format("DD MMM YYYY")}
                    </td>
                    <td style={{ padding: "8px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", alignItems: "center" }}>
                        <button
                          className="btn-icon"
                          title={u.isActive ? "Disable user" : "Enable user"}
                          onClick={() => toggleUser(u)}>
                          {u.isActive ? (
                            <i className="ti ti-ban" style={{ color: "var(--status-open)", fontSize: "1.25rem" }} />
                          ) : (
                            <i className="ti ti-user-check" style={{ color: "var(--status-done)", fontSize: "1.25rem" }} />
                          )}
                        </button>

                        <button
                          className="btn-icon"
                          title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                          onClick={() =>
                            changeRole(
                              u,
                              u.role === "admin" ? "user" : "admin"
                            )
                          }>
                          <i className="ti ti-dots-vertical" style={{ fontSize: "1.25rem" }} />
                        </button>

                        <button
                          className="btn-icon"
                          title="View profile"
                          onClick={() => openProfile(u._id)}>
                          <i className="ti ti-search" style={{ fontSize: "1.25rem" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", padding: 16, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`btn ${page === i + 1 ? "btn-primary" : "btn-outline"}`}
                  style={{ padding: "4px 12px" }}
                  onClick={() => onChangePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Drawer */}
      <div 
        className={`drawer-overlay ${drawerOpen ? "open" : ""}`} 
        onClick={() => setDrawerOpen(false)}
      >
        <div 
          className="drawer" 
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: 24 }}>
            {!selectedUser ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
                <span className="spinner" style={{ "--sz": "40px" }} />
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>
                      {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h6 style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem", color: "var(--ink-primary)" }}>{selectedUser.fullName}</h6>
                    <span style={{ fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
                      {selectedUser.email}
                    </span>
                  </div>
                </div>

                <div className="divider" style={{ marginBottom: 16 }} />

                <h6 style={{ fontSize: "0.875rem", color: "var(--ink-secondary)", marginBottom: 8, marginTop: 0 }}>
                  Official Details
                </h6>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    <strong>Department:</strong>{" "}
                    {selectedUser.officialDetails?.department || "-"}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    <strong>Designation:</strong>{" "}
                    {selectedUser.officialDetails?.designation || "-"}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    <strong>Employee ID:</strong>{" "}
                    {selectedUser.officialDetails?.employeeId || "-"}
                  </div>
                </div>

                <div className="divider" style={{ marginBottom: 16 }} />

                <h6 style={{ fontSize: "0.875rem", color: "var(--ink-secondary)", marginBottom: 8, marginTop: 0 }}>
                  Account
                </h6>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    <strong>Status:</strong>{" "}
                    {selectedUser.isActive ? "Active" : "Disabled"}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    <strong>Role:</strong> {selectedUser.role}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)" }}>
                    <strong>Joined:</strong>{" "}
                    {dayjs(selectedUser.createdAt).format("DD MMM YYYY")}
                  </div>
                </div>

                <div className="divider" style={{ marginBottom: 16 }} />

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className={`btn ${selectedUser.isActive ? "btn-outline" : "btn-primary"}`}
                    style={selectedUser.isActive ? { color: "var(--status-open)", borderColor: "var(--status-open)" } : { background: "var(--status-done)", borderColor: "var(--status-done)" }}
                    onClick={() => toggleUser(selectedUser)}>
                    {selectedUser.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      changeRole(
                        selectedUser,
                        selectedUser.role === "admin" ? "user" : "admin"
                      )
                    }>
                    {selectedUser.role === "admin"
                      ? "Demote to User"
                      : "Promote to Admin"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

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
      
      <style>{`
        .grid-summary {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .grid-summary {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .grid-summary {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }
        }
        
        .user-table th {
          font-weight: 600;
          color: var(--ink-secondary);
          font-size: 0.875rem;
        }
        
        .user-row-hover:hover {
          background-color: var(--surface-subtle);
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
            width: 420px;
          }
        }
        
        .drawer-overlay.open .drawer {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}
