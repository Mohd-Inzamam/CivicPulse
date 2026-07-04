import { useEffect, useState } from "react";
import { issuesService } from "../../../services/issuesService";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/common/StatusBadge";
import CategoryBadge from "../../../components/common/CategoryBadge";

export default function UserDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await issuesService.getAllIssues({ createdBy: "me" });
        const fetched = res.data?.issues || res.issues || [];
        setIssues(fetched);
      } catch (err) {
        console.error("Dashboard failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIssues();
  }, []);

  // Personal stats — my issues only
  const total = issues.length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const open = issues.filter((i) => i.status === "Open").length;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ animation: "fadeInUp 0.6s ease-out" }}>
        <div
          className="card"
          style={{
            padding: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-base)",
            border: "0.5px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)"
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 20,
              background: "var(--surface-subtle)",
              borderRadius: "var(--radius-lg)",
              border: "0.5px solid var(--border-subtle)",
              width: "100%"
            }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--accent-muted)",
                overflow: "hidden",
                flexShrink: 0,
              }}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--accent-text)",
                  }}>
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--ink-primary)",
                  margin: 0,
                }}>
                {user?.fullName || "Citizen"}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-tertiary)",
                  margin: "3px 0 0",
                }}>
                {user?.email}
              </p>
            </div>
            <button
              className="btn btn-ghost"
              style={{ marginLeft: "auto", padding: "6px 12px" }}
              onClick={() => navigate("/update-profile")}>
              <i className="ti ti-edit" style={{ marginRight: 8 }} /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Personal stats */}
      <div style={{ marginTop: 32 }}>
        <div className="kpi-grid">
          {[
            { label: "Reported", value: total, color: "var(--ink-primary)" },
            { label: "Open", value: open, color: "var(--status-open)" },
            {
              label: "In Progress",
              value: inProgress,
              color: "var(--status-prog)",
            },
            { label: "Resolved", value: resolved, color: "var(--status-done)" },
          ].map((s) => (
            <div 
              key={s.label} 
              className="card"
              style={{
                padding: "24px 16px",
                textAlign: "center",
                background: "var(--surface-base)",
                borderRadius: "var(--radius-xl)",
                border: "0.5px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)"
              }}>
              <div style={{ fontSize: "2.125rem", fontWeight: 700, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--ink-primary)", opacity: 0.7 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My issues list */}
      <div style={{ animation: "fadeInUp 0.5s ease-out 0.35s both" }}>
        <div 
          className="card"
          style={{ 
            marginTop: 32, 
            padding: 24, 
            background: "var(--surface-base)",
            borderRadius: "var(--radius-xl)",
            border: "0.5px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)"
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <h6 style={{ margin: 0, fontWeight: 600, fontSize: "1.25rem", color: "var(--ink-primary)" }}>
              My Reported Issues
            </h6>
            <button
              className="btn btn-primary"
              style={{ borderRadius: 12, padding: "6px 16px" }}
              onClick={() => navigate("/report-issue")}>
              + Report New
            </button>
          </div>

          <div className="divider" style={{ marginBottom: 16 }} />

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
              <span className="spinner" style={{ "--sz": "40px" }} />
            </div>
          ) : issues.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "var(--ink-primary)", opacity: 0.7, marginBottom: 16 }}>
                You haven't reported any issues yet.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/report-issue")}
                style={{ borderRadius: 12 }}>
                Report your first issue
              </button>
            </div>
          ) : (
            <div className="issue-grid">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="issue-card-hover"
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    background: "var(--surface-subtle)",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => navigate(`/issues/${issue._id}`)}>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: "var(--ink-primary)" }}>
                    {issue.title}
                  </div>
                  <div
                    style={{ fontSize: "0.875rem", color: "var(--ink-primary)", opacity: 0.7, marginBottom: 8 }}>
                    {issue.description?.slice(0, 80)}
                    {issue.description?.length > 80 ? "…" : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}>
                    <CategoryBadge category={issue.category} />
                    <StatusBadge status={issue.status} />
                  </div>
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--ink-primary)", opacity: 0.7, marginTop: 8, display: "block" }}>
                    📍 {issue.location} · 👍 {issue.upvotes} · 💬{" "}
                    {issue.comments?.length ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .kpi-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr 1fr;
        }
        @media (min-width: 600px) {
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .issue-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .issue-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .issue-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        
        .issue-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
}
