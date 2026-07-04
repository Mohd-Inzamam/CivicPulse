import React from "react";

const SubmitButton = ({
  children = "Submit",
  loading = false,
  disabled = false,
  fullWidth = true,
  variant = "contained", // kept for API compat
  color = "primary", // kept for API compat
  size = "large", // kept for API compat
  sx = {},
  animationDelay = 0, // kept for API compat, no animation
  ...props
}) => {
  return (
    <div>
      <button
        type="submit"
        className={`btn btn-primary${fullWidth ? " btn-full" : ""}${size === "large" ? " btn-lg" : ""}`}
        disabled={disabled || loading}
        style={{
          paddingTop: 9.6, // py: 1.2 → 1.2×8 = 9.6px
          paddingBottom: 9.6,
          borderRadius: 16, // borderRadius: 2 → 2×8 = 16px
          fontWeight: 700,
          ...sx,
        }}
        {...props}
      >
        {loading ? (
          <span
            className="spinner"
            style={{ "--sz": "24px" }}
            role="status"
            aria-label="Loading"
          />
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
