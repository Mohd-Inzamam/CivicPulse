import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import { issuesService } from "../services/issuesService";
import { geocodeLocation, fallbackCoords } from "../utils/geocode";

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  Open: "#ef4444",
  "In Progress": "#f59e0b",
  Resolved: "#22c55e",
  Closed: "#6b7280",
};

const STATUS_LABELS = {
  Open: "🔴 Open",
  "In Progress": "🟡 In Progress",
  Resolved: "🟢 Resolved",
  Closed: "⚫ Closed",
};

const CATEGORY_ICONS = {
  Road: "🛣️",
  Electricity: "⚡",
  Water: "💧",
  Garbage: "🗑️",
  Other: "📌",
};

// Default map center — India (covers most civic apps in this region)
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 5;

// ─── Leaflet loader (CDN, no npm install) ────────────────────────────────────

let leafletLoaded = false;
let leafletLoadPromise = null;

function loadLeaflet() {
  if (leafletLoaded) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      leafletLoaded = true;
      resolve(window.L);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return leafletLoadPromise;
}

// ─── custom coloured pin icon ─────────────────────────────────────────────────

function createPinIcon(L, color, category) {
  const emoji = CATEGORY_ICONS[category] || "📌";
  return L.divIcon({
    className: "",
    html: `
      <div style="
        display: flex; flex-direction: column; align-items: center;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
      ">
        <div style="
          width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
          background: ${color}; transform: rotate(-45deg);
          border: 2.5px solid white;
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 15px; line-height: 1;">
            ${emoji}
          </span>
        </div>
        <div style="
          width: 6px; height: 6px; background: ${color};
          border-radius: 50%; margin-top: -3px;
        "></div>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

// ─── popup HTML ───────────────────────────────────────────────────────────────

function buildPopupHtml(issue) {
  const color = STATUS_COLORS[issue.status] || "#6b7280";
  const catIcon = CATEGORY_ICONS[issue.category] || "📌";
  return `
    <div style="font-family: system-ui, sans-serif; min-width: 220px; max-width: 260px;">
      <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 6px; line-height: 1.4;">
        ${catIcon} ${issue.title}
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
        <span style="
          background: ${color}22; color: ${color};
          padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500;
        ">${issue.status}</span>
        <span style="
          background: #f1f5f9; color: #475569;
          padding: 2px 8px; border-radius: 20px; font-size: 11px;
        ">${issue.category}</span>
      </div>
      <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
        📍 ${issue.location}
      </div>
      <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
        👍 ${issue.upvotes || 0} upvotes · 💬 ${issue.comments?.length || 0} comments
      </div>
      <a
        href="/issues/${issue._id}"
        style="
          display: block; text-align: center;
          background: #1976d2; color: white;
          padding: 6px 12px; border-radius: 8px;
          text-decoration: none; font-size: 12px; font-weight: 500;
        "
        onclick="event.preventDefault(); window.__civicMapNavigate && window.__civicMapNavigate('${issue._id}')"
      >
        View Issue →
      </a>
    </div>
  `;
}

// ─── main component ───────────────────────────────────────────────────────────

export default function IssueMap() {
  const navigate = useNavigate();
  const theme = useTheme();
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  // expose navigate to popup links
  useEffect(() => {
    window.__civicMapNavigate = (id) => navigate(`/issues/${id}`);
    return () => {
      delete window.__civicMapNavigate;
    };
  }, [navigate]);

  // Load all issues
  useEffect(() => {
    (async () => {
      try {
        const res = await issuesService.getAllIssues({ limit: 200 });
        const all = res.data?.issues || res.issues || [];
        setIssues(all);
        setStats({
          total: all.length,
          open: all.filter((i) => i.status === "Open").length,
          inProgress: all.filter((i) => i.status === "In Progress").length,
          resolved: all.filter((i) => i.status === "Resolved").length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = issues;
    if (statusFilter !== "all")
      result = result.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q),
      );
    }
    setFilteredIssues(result);
  }, [issues, statusFilter, search]);

  // Initialise Leaflet map once
  useEffect(() => {
    if (!mapRef.current) return;

    let mounted = true;
    loadLeaflet().then((L) => {
      if (!mounted || leafletMapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;
    });

    return () => {
      mounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Place / update markers whenever filteredIssues changes
  const placeMarkers = useCallback(async () => {
    const L = window.L;
    const map = leafletMapRef.current;
    if (!L || !map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (filteredIssues.length === 0) return;

    setGeocoding(true);

    const bounds = [];
    let resolvedCount = 0;

    // Geocode in parallel batches of 3 to respect Nominatim rate limits
    for (let i = 0; i < filteredIssues.length; i += 3) {
      const batch = filteredIssues.slice(i, i + 3);
      await Promise.all(
        batch.map(async (issue, batchIdx) => {
          const globalIdx = i + batchIdx;
          let coords = await geocodeLocation(issue.location);
          if (!coords) coords = fallbackCoords(DEFAULT_CENTER, globalIdx);

          const icon = createPinIcon(
            L,
            STATUS_COLORS[issue.status] || "#6b7280",
            issue.category,
          );
          const marker = L.marker([coords.lat, coords.lng], { icon })
            .addTo(map)
            .bindPopup(buildPopupHtml(issue), {
              maxWidth: 280,
              closeButton: true,
            });

          markersRef.current.push(marker);
          bounds.push([coords.lat, coords.lng]);
          resolvedCount++;
        }),
      );

      // Delay between batches for Nominatim (1 req/sec policy)
      if (i + 3 < filteredIssues.length) {
        await new Promise((r) => setTimeout(r, 350));
      }
    }

    setGeocoding(false);

    // Fit map to all pins
    if (bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      } catch {
        map.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_ZOOM);
      }
    }
  }, [filteredIssues]);

  // Re-place markers when issues or map is ready
  useEffect(() => {
    if (!loading && leafletMapRef.current) {
      const delay = setTimeout(placeMarkers, 100);
      return () => clearTimeout(delay);
    }
  }, [loading, placeMarkers]);

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
      }}>
      {/* ── Header bar ── */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          background: isDark ? "#1e293b" : "white",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          zIndex: 10,
          flexShrink: 0,
        }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MapIcon sx={{ color: "primary.main", fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16 }}>
            Issue Map
          </Typography>
        </Box>

        {/* Stats pills */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {[
            { label: `${stats.total} total`, color: "default" },
            { label: `${stats.open} open`, color: "error" },
            { label: `${stats.inProgress} in progress`, color: "warning" },
            { label: `${stats.resolved} resolved`, color: "success" },
          ].map((s) => (
            <Chip
              key={s.label}
              label={s.label}
              size="small"
              color={s.color}
              variant="outlined"
              sx={{ fontSize: 11 }}
            />
          ))}
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search title, location, category…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 220, ml: "auto" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Status filter */}
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(_, val) => val && setStatusFilter(val)}
          size="small">
          {["all", "Open", "In Progress", "Resolved", "Closed"].map((s) => (
            <ToggleButton
              key={s}
              value={s}
              sx={{ fontSize: 11, py: 0.4, px: 1.2, textTransform: "none" }}>
              {s === "all" ? "All" : STATUS_LABELS[s]?.replace(/^.\s/, "") || s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* ── Map container ── */}
      <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Loading overlay */}
        {(loading || geocoding) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(4px)",
              gap: 2,
              pointerEvents: "none",
            }}>
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary">
              {loading
                ? "Loading issues…"
                : `Placing ${filteredIssues.length} pins on map…`}
            </Typography>
          </Box>
        )}

        {/* Leaflet map div */}
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {/* Legend */}
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            left: 12,
            zIndex: 1000,
            background: isDark
              ? "rgba(30,41,59,0.95)"
              : "rgba(255,255,255,0.95)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
            borderRadius: 2,
            px: 1.5,
            py: 1,
            backdropFilter: "blur(8px)",
          }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 600,
              mb: 0.75,
              opacity: 0.6,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontSize: 10,
            }}>
            Status
          </Typography>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <Box
              key={status}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontSize: 12 }}>
                {status}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
            }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 600,
                mb: 0.5,
                opacity: 0.6,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontSize: 10,
              }}>
              Category
            </Typography>
            {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
              <Box
                key={cat}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
                <Typography sx={{ fontSize: 12, lineHeight: 1 }}>
                  {icon}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 12 }}>
                  {cat}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Empty state */}
        {!loading && !geocoding && filteredIssues.length === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 500,
              textAlign: "center",
              background: isDark
                ? "rgba(30,41,59,0.9)"
                : "rgba(255,255,255,0.9)",
              borderRadius: 3,
              px: 4,
              py: 3,
              backdropFilter: "blur(8px)",
            }}>
            <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🗺️</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              No issues found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different filter or search term
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
