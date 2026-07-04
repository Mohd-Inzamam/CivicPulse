const PageCard = ({
  children,
  title,
  subtitle,
  elevation = 6,
  maxWidth = 700,
  sx = {},
  animationDelay = 0,
  ...props
}) => {
  return (
    <div
      style={{
        animation: `fadeInUp 0.6s ease-out ${animationDelay}s both`,
        maxWidth,
        margin: "24px auto",
        width: "100%",
        ...sx,
      }}
      {...props}
    >
      <div 
        className="card" 
        style={{ 
          borderRadius: "var(--radius-xl)", 
          boxShadow: elevation > 4 ? "var(--shadow-lg)" : "var(--shadow-md)",
          background: "var(--surface-base)",
          border: "0.5px solid var(--border-subtle)"
        }}
      >
        <div style={{ padding: "32px 24px" }}>
          {title && (
            <h2
              style={{
                textAlign: "center",
                color: "var(--ink-primary)",
                fontWeight: 700,
                fontSize: "2rem",
                marginBottom: subtitle ? 8 : 24,
                marginTop: 0
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                textAlign: "center",
                color: "var(--ink-secondary)",
                fontSize: "1rem",
                marginBottom: 24,
                marginTop: 0
              }}
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PageCard;
