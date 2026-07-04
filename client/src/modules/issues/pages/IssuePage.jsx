import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IssueList from "./IssueList";
import { issuesService } from "../../../services/issuesService";

// Reusable Components
import StatsOverviewCard from "../components/StatsOverviewCard";
import CategoryStatsCard from "../components/CategoryStatsCard";
import EngagementStatsCard from "../components/EngagementStatsCard";
import NoIssuesCard from "../components/NoIssuesCard";

function IssuePage({ filters }) {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Compute statistics
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status?.toLowerCase() === "open").length,
    inProgress: issues.filter((i) => i.status?.toLowerCase() === "in progress")
      .length,
    resolved: issues.filter((i) => i.status?.toLowerCase() === "resolved")
      .length,
    byCategory: issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {}),
    totalUpvotes: issues.reduce((sum, i) => sum + (i.upvotes || 0), 0),
    mostUpvoted: [...issues].sort(
      (a, b) => (b.upvotes || 0) - (a.upvotes || 0),
    )[0],
  };

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await issuesService.getAllIssues({
          page: 1,
          limit: 12,
        });
        const fetched = response.data?.issues || response.issues || [];
        const pagination = response.data?.pagination || response.pagination;
        setIssues(fetched);
        setPage(1);
        setHasMore(pagination ? pagination.page < pagination.pages : false);
      } catch (err) {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await issuesService.getAllIssues({
        page: nextPage,
        limit: 12,
      });
      const fetched = response.data?.issues || response.issues || [];
      const pagination = response.data?.pagination || response.pagination;
      setIssues((prev) => [...prev, ...fetched]);
      setPage(nextPage);
      setHasMore(pagination ? pagination.page < pagination.pages : false);
    } catch (err) {
      console.error("Failed to load more issues", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleUpvote = async (issueId) => {
    try {
      const response = await issuesService.upvoteIssue(issueId);
      const result = response?.data || response;
      const updatedUpvotes = result?.upvotes;

      setIssues((prev) =>
        prev.map((i) =>
          i._id === issueId
            ? { ...i, upvotes: updatedUpvotes ?? i.upvotes }
            : i,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="container-lg" style={{ padding: "48px 0" }}>
        <div
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "50vh" 
          }}>
          <span className="spinner" style={{ "--sz": "60px" }} />
          <p style={{ marginTop: 16, color: "var(--ink-primary)" }}>Loading issues...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container-lg" style={{ padding: "48px 0" }}>
        <div className="card" style={{ padding: 32 }}>{error}</div>
      </div>
    );

  const hasIssues = issues.length > 0;
  
  return (
    <div style={{ minHeight: "100vh", padding: "32px 0" }}>
      <div className="container-xl" style={{ padding: "0 24px" }}>
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          {!hasIssues ? (
            <NoIssuesCard onReport={() => navigate("/report-issue")} />
          ) : (
            <div>
              <div className="grid-container" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {/* STATS — Top Horizontal */}
                <div style={{ width: "100%" }}>
                  <div
                    className="stats-container"
                    style={{ 
                      display: "flex",
                      width: "100%", 
                      justifyContent: "flex-start",
                      gap: 24,
                    }}>
                    <StatsOverviewCard
                      stats={stats}
                      sx={{ minWidth: 300, maxWidth: 400, flex: 1 }}
                    />
                    <CategoryStatsCard
                      stats={stats}
                      sx={{ minWidth: 300, maxWidth: 400, flex: 1 }}
                    />
                    <EngagementStatsCard
                      stats={stats}
                      sx={{ minWidth: 300, maxWidth: 400, flex: 1 }}
                    />
                  </div>

                  <div style={{ marginTop: 8, opacity: 0.5 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--ink-primary)" }}>
                      Insights update when new issues are reported or actions
                      performed.
                    </span>
                  </div>
                </div>
                
                {/* ISSUES BELOW */}
                <div style={{ width: "100%" }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 16, minHeight: "calc(100vh - 300px)" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      <div /> {/* Placeholder for left align */}
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate("/report-issue")}>
                        + Report Issue
                      </button>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <IssueList
                        issues={issues}
                        onUpvote={handleUpvote}
                        onUpdateIssue={(u) =>
                          setIssues((prev) =>
                            prev.map((i) => (i._id === u._id ? u : i)),
                          )
                        }
                        onDeleteIssue={(id) =>
                          setIssues((prev) => prev.filter((i) => i._id !== id))
                        }
                      />
                    </div>

                    {hasMore && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "24px 0",
                        }}>
                        <button
                          className="btn btn-outline"
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          style={{
                            borderRadius: 24,
                            padding: "8px 32px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                          }}>
                          {loadingMore && <span className="spinner" style={{ "--sz": "18px" }} />}
                          {loadingMore ? "Loading…" : "Load More Issues"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .stats-container {
          flex-direction: column;
        }
        @media (min-width: 900px) {
          .stats-container {
            flex-direction: row;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default IssuePage;
