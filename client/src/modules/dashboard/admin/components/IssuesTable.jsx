// IssuesTable.jsx

const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return { bg: "var(--status-open)", label: "Open" };
    case "In Progress":
      return { bg: "var(--status-warn)", label: "In Progress" };
    case "Resolved":
      return { bg: "var(--status-done)", label: "Resolved" };
    default:
      return { bg: "var(--ink-secondary)", label: status };
  }
};

export default function IssuesTable({ issues, handleStatusChange }) {
  return (
    <div style={{ animation: "fadeInUp 0.8s ease-out" }}>
      <div className="card" style={{ borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)" }}>
        <div style={{ padding: 24 }}>
          <h5 style={{ margin: "0 0 16px 0", fontWeight: 600, fontSize: "1.5rem", color: "var(--ink-primary)" }}>
            Recent Issues
          </h5>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.875rem" }}>ID</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.875rem" }}>Issue</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.875rem" }}>Reporter</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.875rem" }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.875rem" }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, index) => {
                  const issueId = issue._id || issue.id;
                  const statusStyle = getStatusColor(issue.status);
                  
                  return (
                    <tr
                      key={issueId || index}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                        transition: "background 0.2s"
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontSize: "0.875rem", color: "var(--ink-primary)" }}>{issueId || "N/A"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.875rem", color: "var(--ink-primary)", fontWeight: 500 }}>{issue.title}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.875rem", color: "var(--ink-secondary)" }}>
                        {issue.createdBy?.fullName || "Unknown"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            borderRadius: 16,
                            padding: "4px 10px",
                            color: "white",
                            backgroundColor: statusStyle.bg,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          className="input"
                          style={{ minWidth: 130, padding: "4px 8px", height: 32 }}
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issueId, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        tbody tr:hover {
          background-color: var(--surface-subtle);
        }
      `}</style>
    </div>
  );
}
