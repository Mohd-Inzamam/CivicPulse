import React, { useState, useEffect, useCallback } from "react";
import SummaryCards from "../components/SummaryCards.jsx";
import DashboardCharts from "../components/DashboardCharts.jsx";
import { issuesService } from "../../../../services/issuesService.js";
import { API_BASE_URL } from "../../../../config/api.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

function CivicInsightCard() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchInsight = useCallback(async () => {
    setLoading(true);
    setVisible(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/civic-insight`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      setInsight(
        data.data?.insight ||
          data.insight ||
          "Keep monitoring issue trends and prioritise long-standing open cases.",
      );
    } catch {
      setInsight(
        "Keep monitoring issue trends and prioritise long-standing open cases for faster community impact.",
      );
    } finally {
      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    }
  }, []);

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  return (
    <div
      className="card"
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(25,118,210,0.2)",
        background: "linear-gradient(135deg, rgba(25,118,210,0.05), rgba(66,165,245,0.03))",
        boxShadow: "0 2px 16px rgba(25,118,210,0.08)",
        marginBottom: 32,
      }}>
      <div style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-sparkles" style={{ color: "var(--accent)", fontSize: 20 }} />
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontSize: 11,
                color: "var(--ink-secondary)",
                fontWeight: 600,
              }}>
              AI Civic Insight
            </span>
          </div>
          <button
            className="btn btn-ghost"
            onClick={fetchInsight}
            disabled={loading}
            style={{ fontSize: 12, padding: "2px 8px" }}>
            <i className="ti ti-refresh" style={{ fontSize: 14, marginRight: 4 }} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div>
            <div className="skeleton" style={{ width: "90%", height: 20, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: "75%", height: 20, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: "60%", height: 20 }} />
          </div>
        ) : (
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}>
            <p
              style={{ lineHeight: 1.75, color: "var(--ink-primary)", fontSize: 14, margin: 0 }}>
              {insight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await issuesService.getAllIssues();
        setIssues(response.data?.issues || response.issues || []);
      } catch {
        setError("Failed to load issues. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = issues.length;
  const openCount = issues.filter((i) => i.status === "Open").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress",
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  const summary = [
    { label: "Total Issues", count: total, color: "primary" },
    { label: "Open", count: openCount, color: "error" },
    { label: "In Progress", count: inProgressCount, color: "warning" },
    { label: "Resolved", count: resolvedCount, color: "success" },
  ];

  const recentIssues = issues.slice(0, 5);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <span className="spinner" style={{ "--sz": "40px" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <div style={{ padding: 16, background: "var(--status-open)", color: "white", borderRadius: 8 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "32px 0", maxWidth: 1200, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
      <h4 style={{ fontWeight: 700, margin: "0 0 8px 0", fontSize: "2.125rem", color: "var(--ink-primary)" }}>
        Admin Dashboard
      </h4>
      <p style={{ color: "var(--ink-secondary)", margin: "0 0 32px 0", fontSize: "1rem" }}>
        Quick insight into system activity &amp; ongoing issues.
      </p>

      {/* AI Insight Card */}
      <CivicInsightCard />

      {/* KPI Cards */}
      <div className="kpi-grid-4" style={{ marginBottom: 32 }}>
        {summary.map((item, i) => (
          <div key={item.label}>
            <SummaryCards item={item} index={i} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts issues={issues} />

      {/* Recent Issues */}
      <div className="card" style={{ borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)" }}>
        <div style={{ padding: 24 }}>
          <h5 style={{ margin: "0 0 16px 0", fontWeight: 600, fontSize: "1.5rem", color: "var(--ink-primary)" }}>
            Recent Issues
          </h5>
          {recentIssues.length === 0 ? (
            <div
              style={{ padding: "16px 0", textAlign: "center", color: "var(--ink-secondary)", fontSize: "0.875rem" }}>
              No issues yet.
            </div>
          ) : (
            recentIssues.map((issue, index) => (
              <div key={issue._id || index} style={{ padding: "12px 0" }}>
                <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--ink-primary)" }}>
                  {issue.title}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
                  Reported by: {issue.createdBy?.fullName || "Unknown"} · 📍{" "}
                  {issue.location}
                </div>
                <span
                  className="badge"
                  style={{ 
                    marginTop: 8, 
                    display: "inline-block",
                    background: issue.status === "Open" ? "var(--status-open)" : issue.status === "In Progress" ? "var(--status-warn)" : "var(--status-done)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 16,
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}>
                  {issue.status}
                </span>
                {index !== recentIssues.length - 1 && (
                  <div className="divider" style={{ marginTop: 16 }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <style>{`
        .kpi-grid-4 {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .kpi-grid-4 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .kpi-grid-4 {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }
        }
        
        .skeleton {
          background: linear-gradient(90deg, var(--surface-subtle) 25%, var(--border-subtle) 50%, var(--surface-subtle) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
