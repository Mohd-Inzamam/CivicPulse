import React from "react";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 64, // mt: 8 → 8×8 = 64px
        paddingTop: 40, // py: 5 → 5×8 = 40px
        paddingBottom: 40,
        paddingLeft: "clamp(24px, 5vw, 48px)", // px: {xs:3, md:6}
        paddingRight: "clamp(24px, 5vw, 48px)",
        background: "rgba(255,255,255,0.05)", // slightly lighter than var(--surface-base) for contrast
        backdropFilter: "blur(20px) saturate(180%)",
        borderRadius: 22, // borderRadius: 22px
        border: "1px solid rgba(255,255,255,0.3)", // keeping original glass border
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24, // spacing: 3 → 3×8 = 24px
          "@media (min-width: 900px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          }
        }}
        className="footer-flex-container"
      >
        {/* Branding + Tagline */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="footer-brand-section">
          <h6
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8, // gap: 1 → 8px
              color: "var(--ink-primary)",
            }}
          >
            🌐⚡ CivicPulse
          </h6>
          <p
            style={{ 
              margin: 0, 
              fontSize: "0.875rem", 
              color: "var(--ink-secondary)", // color: "text.secondary"
              fontWeight: 500 
            }}
          >
            Empowering Communities, One Issue at a Time.
          </p>
        </div>

        {/* Footer Info Links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32, // spacing: 4 → 4×8 = 32px
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {[
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Terms & Conditions", path: "/terms" },
            { label: "FAQ", path: "/faq" },
            { label: "Team", path: "/team" },
            { label: "Support", path: "/support" },
            { label: "Feedback", path: "/feedback" },
          ].map((item, idx) => (
            <RouterLink
              key={idx}
              to={item.path}
              className="footer-link"
              style={{
                textDecoration: "none",
                color: "var(--ink-primary)", // text.primary
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "inline-block",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {item.label}
            </RouterLink>
          ))}
        </div>

        {/* Social Icons */}
        <div style={{ display: "flex", gap: 8 }}>
          {["brand-facebook", "brand-twitter", "brand-instagram", "brand-github"].map(
            (iconName, idx) => (
              <button
                key={idx}
                className="btn-icon footer-social-btn"
                style={{
                  background: "var(--surface-base)", // bgcolor: "white"
                  color: "var(--accent)", // color: "primary.main"
                  padding: 9.6, // p: 1.2 → 1.2×8 = 9.6px
                  borderRadius: "50%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.25s ease",
                }}
                aria-label={`Follow us on ${iconName.split("-")[1]}`}
              >
                <i className={`ti ti-${iconName}`} aria-hidden="true" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 24, // mt: 3 → 3×8 = 24px
          fontSize: "0.75rem",
          color: "var(--ink-tertiary)", // text.secondary
        }}
      >
        © {new Date().getFullYear()} CivicPulse — All Rights Reserved
      </div>
      
      {/* Adding a style block to handle media queries that inline styles can't */}
      <style>{`
        @media (min-width: 900px) {
          .footer-flex-container {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
          .footer-brand-section {
            align-items: flex-start !important;
          }
        }
        .footer-link:hover {
          color: var(--accent) !important;
          transform: translateY(-2px);
        }
        .footer-social-btn:hover {
          background: var(--accent) !important;
          color: var(--surface-base) !important;
          transform: scale(1.12);
        }
      `}</style>
    </footer>
  );
}
