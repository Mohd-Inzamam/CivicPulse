// Single source of truth for category icons + colours.
// Used by: CategoryBadge, IssueCard, IssueMap, admin charts, leaderboard.

export const CATEGORY_CONFIG = {
    Road: { icon: "🛣️", color: "#f97316", label: "Road" },
    Electricity: { icon: "⚡", color: "#eab308", label: "Electricity" },
    Water: { icon: "💧", color: "#0ea5e9", label: "Water" },
    Garbage: { icon: "🗑️", color: "#16a34a", label: "Garbage" },
    Other: { icon: "📌", color: "#6b7280", label: "Other" },
};

export function getCategoryConfig(category) {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
}

// Status colours — shared with IssueMap, StatusBadge, StatusTimeline
export const STATUS_CONFIG = {
    Open: { color: "#ef4444", icon: "📋", label: "Open" },
    "In Progress": { color: "#f59e0b", icon: "⚙️", label: "In Progress" },
    Resolved: { color: "#22c55e", icon: "✅", label: "Resolved" },
    Closed: { color: "#6b7280", icon: "🔒", label: "Closed" },
};

export function getStatusConfig(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG.Closed;
}