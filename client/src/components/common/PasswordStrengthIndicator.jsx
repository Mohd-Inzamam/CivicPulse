import React from "react";

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    const levels = {
      0: { label: "Very Weak", colorClass: "poor", colorVar: "var(--status-open)", value: 0 },
      1: { label: "Weak", colorClass: "poor", colorVar: "var(--status-open)", value: 20 },
      2: { label: "Fair", colorClass: "fair", colorVar: "var(--status-prog)", value: 40 },
      3: { label: "Good", colorClass: "fair", colorVar: "var(--accent)", value: 60 },
      4: { label: "Strong", colorClass: "good", colorVar: "var(--status-done)", value: 80 },
      5: { label: "Very Strong", colorClass: "good", colorVar: "var(--status-done)", value: 100 },
    };

    return {
      score,
      ...levels[score],
      checks,
    };
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div>
      {/* mt: 1 → 8px, mb: 2 → 16px */}
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        {/* mb: 1 → 8px */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 11, color: "var(--ink-tertiary)" }}>
            Password Strength
          </span>
          <span style={{
            fontSize: 11,
            color: strength.colorVar,
            fontWeight: "bold",
          }}>
            {strength.label}
          </span>
        </div>

        {/* LinearProgress → quality-track/quality-fill */}
        {/* height: 6, borderRadius: 3 → 24px, mb: 1 → 8px */}
        <div className="quality-track" style={{ height: 6, marginBottom: 8, borderRadius: 24 }}>
          <div
            className={`quality-fill ${strength.colorClass}`}
            style={{ width: `${strength.value}%`, borderRadius: 24 }}
          />
        </div>

        {/* gap: 1 → 8px */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(strength.checks).map(([key, passed]) => (
            <span
              key={key}
              style={{
                color: passed ? "var(--status-done)" : "var(--ink-disabled)",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 4, // gap: 0.5 → 0.5×8 = 4px
              }}
            >
              {passed ? "✓" : "○"} {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
