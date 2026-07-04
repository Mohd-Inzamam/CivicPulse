import React, { useState } from "react";

const PasswordField = ({
  label = "Password",
  name = "password",
  value,
  onChange,
  onBlur,
  error,
  helperText,
  fullWidth = true,
  margin = "normal",
  placeholder,
  disabled = false,
  required = false,
  autoComplete = "current-password",
  animationDelay = 0, // kept for API compat, no animation
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = `field-${name}`;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const marginStyle =
    margin === "normal"
      ? { marginTop: 16, marginBottom: 8 }
      : margin === "dense"
        ? { marginTop: 8, marginBottom: 4 }
        : {};

  return (
    <div
      className="form-group"
      style={{
        width: fullWidth ? "100%" : "auto",
        ...marginStyle,
      }}
    >
      {label && (
        <label className="form-label" htmlFor={fieldId}>
          {label}
          {required && <span style={{ color: "var(--status-open)" }}> *</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          id={fieldId}
          className={`input${error ? " error" : ""}`}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={{ borderRadius: 16, paddingRight: 44 }} // borderRadius: 2 → 16px
          {...props}
        />
        <button
          type="button"
          className="input-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          style={{ color: "var(--ink-tertiary)" }} // color: "text.secondary"
        >
          {showPassword ? (
            <i className="ti ti-eye-off" aria-hidden="true" />
          ) : (
            <i className="ti ti-eye" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-hint">{helperText}</span>}
    </div>
  );
};

export default PasswordField;
